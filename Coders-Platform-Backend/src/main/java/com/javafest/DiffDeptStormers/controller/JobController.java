package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.Job;
import com.javafest.DiffDeptStormers.model.User;
import com.javafest.DiffDeptStormers.service.JobService;
import com.javafest.DiffDeptStormers.service.MongoUserService;
import com.javafest.DiffDeptStormers.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;
    
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
        return jwtUtil.getEmailFromToken(token); 
    }

    private boolean isAuthorized(String token, String ownerEmail) {
        String email = getEmailFromToken(token);
        return email.equals(ownerEmail);
    }

    // Create a new job
    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Job job, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, job.getEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            Job createdJob = jobService.createJob(job);
            return ResponseEntity.ok(createdJob);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Get all jobs
    @GetMapping
    public ResponseEntity<?> getAllJobs() {
        try {
            List<Job> jobs = jobService.getAllJobs();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Get a job by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable String id) {
        try {
            Job job = jobService.getJobById(id);
            if (job != null) {
                return ResponseEntity.ok(job);
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"Job not found\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Delete a job by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable String id, @RequestParam String token, @RequestParam String email) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, email)) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            jobService.deleteJob(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchJobs(@RequestParam String searchTerm) {
        try {
            List<Job> jobs = jobService.searchJobs(searchTerm);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }
    
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsersBySkills(@RequestParam String skill) {
        try {
            List<User> users = userService.searchUsersBySkills(skill);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }


}
