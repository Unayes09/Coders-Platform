package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.File;
import com.javafest.DiffDeptStormers.model.Repository;
import com.javafest.DiffDeptStormers.model.User;
import com.javafest.DiffDeptStormers.service.MongoRepoService;
import com.javafest.DiffDeptStormers.service.MongoUserService;
import com.javafest.DiffDeptStormers.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/repos")
public class RepositoryController {

    @Autowired
    private MongoRepoService repositoryService;

    @Autowired
    private MongoUserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private ResponseEntity<?> validateToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("{\"message\": \"Invalid token\"}");
        }
        return null;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRepository(@RequestBody Repository repository, @RequestParam String userId, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) {
            return validationResponse;
        }

        User user = userService.findById(userId);
        if (user != null) {
            repository = repositoryService.saveRepository(repository);
            user.getRepos().add(repository);
            userService.saveUser(user);
            return ResponseEntity.ok(repository);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/{repoId}/files")
    public ResponseEntity<?> uploadFiles(@PathVariable String repoId, @RequestBody List<File> files, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) return validationResponse;

        Optional<Repository> repositoryOptional = repositoryService.findRepositoryById(repoId);
        if (repositoryOptional.isPresent()) {
            Repository repository = repositoryOptional.get();
            for (File file : files) {
                repository.getFiles().add(file);
            }
            repositoryService.saveRepository(repository);
            return ResponseEntity.ok(repository);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{repoId}/files")
    public ResponseEntity<?> deleteFiles(@PathVariable String repoId, @RequestBody List<File> files, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) return validationResponse;

        Optional<Repository> repositoryOptional = repositoryService.findRepositoryById(repoId);
        if (repositoryOptional.isPresent()) {
            Repository repository = repositoryOptional.get();
            repository.getFiles().removeAll(files);
            repositoryService.saveRepository(repository);
            return ResponseEntity.ok(repository);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{repoId}")
    public ResponseEntity<?> editRepository(@PathVariable String repoId, @RequestBody Repository updatedRepository, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) return validationResponse;

        try {
            Repository repository = repositoryService.updateRepository(repoId, updatedRepository);
            return ResponseEntity.ok(repository);
        } catch (ResponseStatusException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{repoId}")
    public ResponseEntity<?> deleteRepository(@PathVariable String repoId, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) return validationResponse;

        repositoryService.deleteRepositoryById(repoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public")
    public ResponseEntity<List<Repository>> getAllPublicRepositories() {
        List<Repository> publicRepositories = repositoryService.getAllPublicRepositories();
        return ResponseEntity.ok(publicRepositories);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Repository>> searchPublicRepositories(@RequestParam String query) {
        List<Repository> repositories = repositoryService.searchPublicRepositories(query);
        return ResponseEntity.ok(repositories);
    }
}
