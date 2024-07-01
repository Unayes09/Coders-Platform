package com.javafest.DiffDeptStormers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.javafest.DiffDeptStormers.model.User;
import com.javafest.DiffDeptStormers.repository.UserRepository;
import com.javafest.DiffDeptStormers.service.UserService;
import com.javafest.DiffDeptStormers.util.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

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

    
    @Autowired
    private JwtUtil jwtUtil;
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        User user = userService.findByEmail(loginRequest.getEmail());
        if (user != null && userService.checkPassword(loginRequest.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + token)
                    .body("{\"message\": \"Login successful\"}");
        } else {
            return ResponseEntity.status(401).body("{\"message\": \"Invalid email or password\"}");
        }
    }
}