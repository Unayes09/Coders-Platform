package com.javafest.DiffDeptStormers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import com.javafest.DiffDeptStormers.service.FeedbackService;
import com.javafest.DiffDeptStormers.model.Feedback;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // API to send feedback
    @PostMapping("/send")
    public ResponseEntity<String> sendFeedback(@RequestBody Feedback feedback) {
        try {
            feedbackService.sendFeedback(feedback);
            return ResponseEntity.ok("Feedback sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // API to get all feedback
    @GetMapping("/get")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        try {
            List<Feedback> feedbackList = feedbackService.getAllFeedback();
            return ResponseEntity.ok(feedbackList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
