package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.AiChat;
import com.javafest.DiffDeptStormers.model.Answers;
import com.javafest.DiffDeptStormers.model.Questions;
import com.javafest.DiffDeptStormers.model.User;
import com.javafest.DiffDeptStormers.service.MongoUserService;
import com.javafest.DiffDeptStormers.service.MongoQnAService;
import com.javafest.DiffDeptStormers.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/qna")
public class QnAController {

    @Autowired
    private MongoQnAService qnaService;
    
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

    private boolean isAuthorized(String token, String ownerEmail) {
        String email = getEmailFromToken(token);
        User user = userService.findByEmail(email);
        return user != null && user.getEmail().equals(ownerEmail);
    }

    @PostMapping("/question")
    public ResponseEntity<?> createQuestion(@RequestBody Questions question, @RequestParam String token) {
    	try {
    		ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            if (!isAuthorized(token, question.getEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }
            Questions createdQuestion = qnaService.createQuestion(question);
            return ResponseEntity.ok(createdQuestion);
    	}catch(Exception e) {
    		return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
    	}
    }

    @DeleteMapping("/question/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable String id, @RequestParam String email, @RequestParam String token) {
    	try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            if (!isAuthorized(token, email)) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            qnaService.deleteQuestion(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
        
    }

    @GetMapping("/questions")
    public ResponseEntity<?> getAllQuestions() {
    	try {
            
            List<Questions> questions = qnaService.getAllQuestions();
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
        
    }
    
    @GetMapping("/questions/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable String id) {
        try {
        	List<Questions> questions = qnaService.getQuestionById(id);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }
    
    @GetMapping("/questions-search")
    public ResponseEntity<?> getAllSearchQuestions(@RequestParam String query) {
    	try {
            
            List<Questions> questions = qnaService.searchQuestions(query);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
        
    }

    @PostMapping("/answer")
    public ResponseEntity<?> createAnswer(@RequestBody Answers answer, @RequestParam String token) {
    	try {
    		ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            if (!isAuthorized(token, answer.getEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }
            Answers createdAnswer = qnaService.createAnswer(answer);
            return ResponseEntity.ok(createdAnswer);
    	}catch(Exception e) {
    		return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
    	}
    }

    @GetMapping("/answers/{questionId}")
    public ResponseEntity<?> getAnswersByQuestionId(@PathVariable String questionId) {
    	try {
            List<Answers> answers = qnaService.getAnswersByQuestionId(questionId);
            return ResponseEntity.ok(answers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }
}
