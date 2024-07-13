package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.User;
import com.javafest.DiffDeptStormers.service.MongoUserService;
import com.javafest.DiffDeptStormers.util.JwtUtil;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private MongoUserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(409).body("{\"message\": \"Username is already taken\"}");
        }

        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(409).body("{\"message\": \"Email is already taken\"}");
        }

        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        User user = userService.findByEmail(loginRequest.getEmail());
        if (user != null && userService.checkPassword(loginRequest.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok()
            		.body("{\"message\": \"Login successful\", \"token\": \"" + token + "\"}");
        } else {
            return ResponseEntity.status(401).body("{\"message\": \"Invalid email or password\"}");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam(name = "token") String token) {
        try {
            String email = jwtUtil.getEmailFromToken(token);
            if (email != null) {
                User user = userService.findByEmail(email);
                if (user != null) {
                    user.setPassword(null); // Remove password from response
                    return ResponseEntity.ok(user);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"User not found\"}");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid token\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Internal Server Error\"}");
        }
    }
    
    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getUserProfileById(@PathVariable String userId) {
        try {
            User user = userService.findById(userId);
            if (user != null) {
                user.setPassword(null); // Remove password from response
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"User not found\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Internal Server Error\"}");
        }
    }
    
    @GetMapping("/confirm/{token}")
    public ResponseEntity<?> confirmUser(@PathVariable String token) {
        try {
            Optional<User> userOptional = userService.findByConfirmationToken(token);
            if (userOptional.isPresent()) {
                userService.confirmUser(token);
                return ResponseEntity.ok("{\"message\": \"User confirmed successfully\"}");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"Invalid token\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    @GetMapping("/confirm-payment")
    public ResponseEntity<?> confirmPayment(@RequestParam String token) {
        try {
            String email = jwtUtil.getEmailFromToken(token);
            if (email != null) {
                User user = userService.findByEmail(email);
                if (user != null) {
                    userService.updatePremiumUser(user);
                    return ResponseEntity.ok("{\"message\": \"Payment confirmed and premium pack activated\"}");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"User not found\"}");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid token\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    @GetMapping("/isPremium")
    public ResponseEntity<?> isPremium(@RequestParam String token) {
        try {
            String email = jwtUtil.getEmailFromToken(token);
            if (email != null) {
                User user = userService.findByEmail(email);
                if (user != null) {
                    boolean isPremium = user.getPremiumPackBuyDate() != null;
                    return ResponseEntity.ok("{\"isPremium\": " + isPremium + "}");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"User not found\"}");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid token\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Internal Server Error\"}");
        }
    }
}
