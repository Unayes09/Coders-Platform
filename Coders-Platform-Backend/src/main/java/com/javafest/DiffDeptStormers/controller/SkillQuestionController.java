package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.SkillQuestions;
import com.javafest.DiffDeptStormers.service.SkillQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/skill")
public class SkillQuestionController {

    @Autowired
    private SkillQuestionService skillQuestionService;

    @PostMapping("/add-all")
    public String addSkillQuestions(@RequestBody List<SkillQuestions> skillQuestions) {
        skillQuestionService.insertSkillQuestions(skillQuestions);
        return "All Skill Questions added successfully!";
    }

    // New API to get random questions for a topic
    @GetMapping("/questions/{topic}")
    public Map<String, List<Map<String, String>>> getRandomQuestions(@PathVariable String topic) {
        return skillQuestionService.getRandomQuestionsByTopic(topic);
    }
    
 // POST API to add a certificate with status code
    @PostMapping("/certificate")
    public ResponseEntity<String> addCertificate(@RequestParam String userEmail, 
                                                 @RequestParam String type, 
                                                 @RequestParam String secretCode) {
        String result = skillQuestionService.addCertificate(userEmail, type, secretCode);
        
        // Return appropriate status code based on result
        if (result.equals("Certificate added successfully!")) {
            return new ResponseEntity<>(result, HttpStatus.CREATED); // 201 for successful creation
        } else if (result.equals("Certificate of this type already exists for the user.")) {
            return new ResponseEntity<>(result, HttpStatus.CONFLICT); // 409 for conflict
        } else {
            return new ResponseEntity<>(result, HttpStatus.FORBIDDEN); // 403 for invalid secret code
        }
    }

    // GET API to get certificate types for a user with status code
    @GetMapping("/certificate/{userEmail}")
    public ResponseEntity<List<String>> getCertificateTypes(@PathVariable String userEmail) {
        List<String> certificateTypes = skillQuestionService.getCertificateTypes(userEmail);
        
        if (certificateTypes.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 if no certificates found
        } else {
            return new ResponseEntity<>(certificateTypes, HttpStatus.OK); // 200 for successful retrieval
        }
    }

}
