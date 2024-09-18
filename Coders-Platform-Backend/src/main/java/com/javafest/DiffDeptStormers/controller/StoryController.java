package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.stories.Comment;
import com.javafest.DiffDeptStormers.model.stories.Story;
import com.javafest.DiffDeptStormers.service.StoryService;
import com.javafest.DiffDeptStormers.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryService storyService;
    
    @Autowired
    private JwtUtil jwtUtil;

    // Create a new Story
    @PostMapping("/create")
    public ResponseEntity<?> createStory(@RequestParam String token, @RequestBody Story story) {
        try {
        	// Extract email from token
            String tokenEmail = jwtUtil.getEmailFromToken(token);

            // Validate email
            if (!story.getEmail().equals(tokenEmail)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Email does not match token");
            }
            Story createdStory = storyService.createStory(story);
            return ResponseEntity.ok(createdStory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating story: " + e.getMessage());
        }
    }
    
    // API to get all stories
    @GetMapping("/all")
    public ResponseEntity<?> getAllStories() {
        try {
            List<Story> stories = storyService.getAllStories();
            return new ResponseEntity<>(stories, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching stories: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all Stories by email
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getAllStoriesByEmail(@PathVariable String email) {
        try {
            List<Story> stories = storyService.getAllStoriesByEmail(email);
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching stories: " + e.getMessage());
        }
    }

    // Update a Story
    @PutMapping("/update/{storyId}")
    public ResponseEntity<?> updateStory(@RequestParam String token, @PathVariable String storyId, @RequestBody Story story) {
        try {
        	// Extract email from token
            String tokenEmail = jwtUtil.getEmailFromToken(token);

            // Validate email
            if (!story.getEmail().equals(tokenEmail)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Email does not match token");
            }
            Story updatedStory = storyService.updateStory(storyId, story.getName(), story.getDescription(), story.getImageLinks());
            return ResponseEntity.ok(updatedStory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating story: " + e.getMessage());
        }
    }

    // Delete a Story
    @DeleteMapping("/delete/{storyId}")
    public ResponseEntity<?> deleteStory(@RequestParam String token, @PathVariable String storyId) {
        try {
        	Story story = storyService.getStoryById(storyId);
        	
        	// Extract email from token
            String tokenEmail = jwtUtil.getEmailFromToken(token);

            // Validate email
            if (!story.getEmail().equals(tokenEmail)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Email does not match token");
            }
            storyService.deleteStory(storyId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting story: " + e.getMessage());
        }
    }

    // Add a Comment to a Story
    @PostMapping("/{storyId}/comment")
    public ResponseEntity<?> addCommentToStory(@RequestParam String token, @PathVariable String storyId, @RequestBody Comment comment) {
        try {
        	// Extract email from token
            String tokenEmail = jwtUtil.getEmailFromToken(token);

            // Validate email
            if (!comment.getCommenterEmail().equals(tokenEmail)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Email does not match token");
            }
            Story updatedStory = storyService.addCommentToStory(storyId, comment);
            return ResponseEntity.ok(updatedStory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding comment: " + e.getMessage());
        }
    }

    // Delete a Comment from a Story using the full Comment object
    @DeleteMapping("/{storyId}/comment")
    public ResponseEntity<?> deleteCommentFromStory(@RequestParam String token, @PathVariable String storyId, @RequestBody Comment comment) {
        try {
        	Story story = storyService.getStoryById(storyId);
        	// Extract email from token
            String tokenEmail = jwtUtil.getEmailFromToken(token);

            // Validate email
            if (!comment.getCommenterEmail().equals(tokenEmail) && !story.getEmail().equals(tokenEmail)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Email does not match token");
            }
            Story updatedStory = storyService.deleteCommentFromStory(storyId, comment);
            return ResponseEntity.ok(updatedStory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting comment: " + e.getMessage());
        }
    }

}
