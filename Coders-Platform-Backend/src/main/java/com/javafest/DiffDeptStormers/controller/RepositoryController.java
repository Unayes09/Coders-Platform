package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.File;
import com.javafest.DiffDeptStormers.model.Repository;
import com.javafest.DiffDeptStormers.service.MongoRepoService;
import com.javafest.DiffDeptStormers.service.MongoUserService;
import com.javafest.DiffDeptStormers.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    private String getEmailFromToken(String token) {
        return jwtUtil.getEmailFromToken(token); // assuming email is the username in the token
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRepository(@RequestBody Repository repository, @RequestParam String userId, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) {
            return validationResponse;
        }

        String email = getEmailFromToken(token);
        repository.setUserId(userId);
        Repository savedRepository = repositoryService.saveRepository(repository,email);
        return ResponseEntity.ok(savedRepository);
    }

    @PostMapping("/{repoId}/files")
    public ResponseEntity<?> uploadFiles(@PathVariable String repoId, @RequestBody List<File> files, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) return validationResponse;

        String email = getEmailFromToken(token);
        Optional<Repository> repositoryOptional = repositoryService.findRepositoryById(repoId);
        if (repositoryOptional.isPresent()) {
            for (File file : files) {
                file.setRepoId(repoId);
                repositoryService.saveFile(file,email);
            }
            return ResponseEntity.ok(files);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable String fileId, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) return validationResponse;

        String email = getEmailFromToken(token);
        try {
            repositoryService.deleteFile(fileId, email);
            return ResponseEntity.ok("Deleted file with ID: " + fileId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting file: " + e.getMessage());
        }
    }

    @PutMapping("/{repoId}")
    public ResponseEntity<?> editRepository(@PathVariable String repoId, @RequestBody Repository updatedRepository, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) return validationResponse;

        String email = getEmailFromToken(token);
        try {
            Repository repository = repositoryService.updateRepository(repoId, updatedRepository, email);
            return ResponseEntity.ok(repository);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating repository: " + e.getMessage());
        }
    }

    @DeleteMapping("/{repoId}")
    public ResponseEntity<?> deleteRepository(@PathVariable String repoId, @RequestParam String token) {
        ResponseEntity<?> validationResponse = validateToken(token);
        if (validationResponse != null) return validationResponse;

        String email = getEmailFromToken(token);
        try {
            repositoryService.deleteRepositoryById(repoId, email);
            return ResponseEntity.ok("Deleted repository with ID: " + repoId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting repository: " + e.getMessage());
        }
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
    
    @GetMapping("/{repoId}/files")
    public ResponseEntity<?> getAllFilesOfRepository(@PathVariable String repoId) {
        List<File> files = repositoryService.getAllFilesOfRepository(repoId);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/{userId}/repos")
    public ResponseEntity<?> getAllRepositoriesOfUser(@PathVariable String userId) {
        List<Repository> repositories = repositoryService.getAllRepositoriesOfUser(userId);
        return ResponseEntity.ok(repositories);
    }
}
