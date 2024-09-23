package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.File;
import com.javafest.DiffDeptStormers.model.Repository;
import com.javafest.DiffDeptStormers.model.User;
import com.javafest.DiffDeptStormers.service.MongoRepoService;
import com.javafest.DiffDeptStormers.service.MongoUserService;
import com.javafest.DiffDeptStormers.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins="*")
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

    private boolean isAuthorized(String token, String userId) {
        String email = getEmailFromToken(token);
        User user = userService.findByEmail(email);
        return user != null && user.getId().equals(userId);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRepository(@RequestBody Repository repository, @RequestParam String userId, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {
                return validationResponse;
            }

            if (!isAuthorized(token, userId)) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            String email = getEmailFromToken(token);
            repository.setUserId(userId);
            Repository savedRepository = repositoryService.saveRepository(repository, email);
            return ResponseEntity.ok(savedRepository);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    @PostMapping("/{repoId}/files")
    public ResponseEntity<?> uploadFiles(@PathVariable String repoId, @RequestBody List<File> files, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null){return validationResponse;}

            String email = getEmailFromToken(token);
            Optional<Repository> repositoryOptional = repositoryService.findRepositoryById(repoId);
            if (repositoryOptional.isPresent()) {
                Repository repository = repositoryOptional.get();
                if (!isAuthorized(token, repository.getUserId())) {
                    return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
                }

                for (File file : files) {
                    file.setRepoId(repoId);
                    repositoryService.saveFile(file, email);
                }
                return ResponseEntity.ok(files);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    @PutMapping("/{repoId}/files/{fileId}")
    public ResponseEntity<?> updateFile(
            @PathVariable String repoId,
            @PathVariable String fileId,
            @RequestBody File updatedFile,
            @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            String email = getEmailFromToken(token);
            Optional<Repository> repositoryOptional = repositoryService.findRepositoryById(repoId);
            if (repositoryOptional.isPresent()) {
                Repository repository = repositoryOptional.get();
                if (!isAuthorized(token, repository.getUserId())) {
                    return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
                }

                updatedFile.setId(fileId);
                updatedFile.setRepoId(repoId); // Ensure the repository ID matches
                updatedFile.setEmail(email); // Ensure the email is correct
                updatedFile.setTimestamp(new Date()); // Update timestamp to current date and time

                File updated = repositoryService.updateFile(fileId, updatedFile, email);
                return ResponseEntity.ok(updated);
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"Repository not found\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable String fileId, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            String email = getEmailFromToken(token);
            Optional<File> fileOptional = repositoryService.findFileById(fileId);
            if (fileOptional.isPresent()) {
                File file = fileOptional.get();
                Optional<Repository> repositoryOptional = repositoryService.findRepositoryById(file.getRepoId());
                if (repositoryOptional.isPresent()) {
                    Repository repository = repositoryOptional.get();
                    if (!isAuthorized(token, repository.getUserId())) {
                        return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
                    }
                    repositoryService.deleteFile(fileId, email);
                    return ResponseEntity.ok("Deleted file with ID: " + fileId);
                } else {
                    return ResponseEntity.status(404).body("{\"message\": \"Repository not found\"}");
                }
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"File not found\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    @PutMapping("/{repoId}")
    public ResponseEntity<?> editRepository(@PathVariable String repoId, @RequestBody Repository updatedRepository, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            Optional<Repository> repositoryOptional = repositoryService.findRepositoryById(repoId);
            if (repositoryOptional.isPresent()) {
                Repository repository = repositoryOptional.get();
                if (!isAuthorized(token, repository.getUserId())) {
                    return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
                }
                String email = getEmailFromToken(token);
                Repository updatedRepo = repositoryService.updateRepository(repoId, updatedRepository, email);
                return ResponseEntity.ok(updatedRepo);
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"Repository not found\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating repository: " + e.getMessage());
        }
    }

    @DeleteMapping("/{repoId}")
    public ResponseEntity<?> deleteRepository(@PathVariable String repoId, @RequestParam String token) {
        try {
            
            // Find the repository by ID
            Optional<Repository> repositoryOptional = repositoryService.findRepositoryById(repoId);
            if (!repositoryOptional.isPresent()) {
                return ResponseEntity.status(404).body("{\"message\": \"Repository not found\"}");
            }
            
            Repository repository = repositoryOptional.get();
            String repositoryOwnerEmail = repository.getEmail(); // Assuming the repository has a `getUserEmail()` method
    
            // If token is "admin", delete the repository using the owner's email
            if ("admin".equals(token)) {
                repositoryService.deleteRepositoryById(repoId, repositoryOwnerEmail);
                return ResponseEntity.ok("Admin deleted repository with ID: " + repoId);
            }
    
            // Validate token for normal users
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}
    
            // Check authorization for non-admin users
            if (!isAuthorized(token, repository.getUserId())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }
    
            // Proceed with deletion for authorized users
            String email = getEmailFromToken(token);
            repositoryService.deleteRepositoryById(repoId, email);
            return ResponseEntity.ok("Deleted repository with ID: " + repoId);
    
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting repository: " + e.getMessage());
        }
    }
    

    @GetMapping("/public")
    public ResponseEntity<List<Repository>> getAllPublicRepositories() {
        try {
            List<Repository> publicRepositories = repositoryService.getAllPublicRepositories();
            return ResponseEntity.ok(publicRepositories);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Repository>> searchPublicRepositories(@RequestParam String query) {
        try {
            List<Repository> repositories = repositoryService.searchPublicRepositories(query);
            return ResponseEntity.ok(repositories);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{repoId}/files")
    public ResponseEntity<?> getAllFilesOfRepository(@PathVariable String repoId, @RequestParam String token) {
        try {
            Optional<Repository> repositoryOptional = repositoryService.findRepositoryById(repoId);
            if (repositoryOptional.isPresent()) {
                Repository repository = repositoryOptional.get();
                List<File> files = repositoryService.getAllFilesOfRepository(repoId);

                // Combine repository and files into a single JSON response
                Map<String, Object> response = new HashMap<>();
                response.put("repository", repository);
                response.put("files", files);

                if (repository.isPublic()) {
                    return ResponseEntity.ok(response);
                } else {
                    String email = jwtUtil.getEmailFromToken(token);
                    if (email == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid token\"}");
                    }

                    if (!isAuthorized(token, repository.getUserId())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Unauthorized\"}");
                    }

                    return ResponseEntity.ok(response);
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"Repository not found\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    @GetMapping("/{userId}/repos")
    public ResponseEntity<?> getAllRepositoriesOfUser(@PathVariable String userId, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, userId)) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            List<Repository> repositories = repositoryService.getAllRepositoriesOfUser(userId);
            return ResponseEntity.ok(repositories);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }
}
