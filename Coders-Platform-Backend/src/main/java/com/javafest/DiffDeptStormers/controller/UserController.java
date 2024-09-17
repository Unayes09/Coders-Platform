package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.User;
import com.javafest.DiffDeptStormers.service.MongoUserService;
import com.javafest.DiffDeptStormers.util.JwtUtil;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;
import java.io.OutputStream;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@CrossOrigin(origins="*")
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
        System.out.println(user);
        HttpURLConnection con = null;
        try {
            // Create POST request
            URL url = new URL("https://api.chatengine.io/users");
            con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            // Set headers
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("Accept", "application/json");
            con.setRequestProperty("Private-Key", "5d633895-77af-4e14-8888-e3611aba8cea");
            // Add request body
            con.setDoOutput(true);
            Map<String, String> body = new HashMap<String, String>();
            body.put("username", user.getUsername());
            body.put("secret", "secret");
            body.put("email", user.getEmail());
            body.put("first_name", user.getFullName());
            body.put("last_name", "*");
            String jsonInputString = new JSONObject(body).toString();
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            // Generate response String
            StringBuilder responseStr = new StringBuilder();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(con.getInputStream(), "utf-8"))) {
                String responseLine = null;
                while ((responseLine = br.readLine()) != null) {
                    responseStr.append(responseLine.trim());
                }
            }
            // Jsonify + return response
            Map<String, Object> response = new Gson().fromJson(
                    responseStr.toString(), new TypeToken<HashMap<String, Object>>() {
                    }.getType());
            //return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } finally {
            if (con != null) {
                con.disconnect();
            }
        }

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        User user = userService.findByEmail(loginRequest.getEmail());
        if (user != null && userService.checkPassword(loginRequest.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            HttpURLConnection con = null;
            try {
                // Create GET request
                URL url = new URL("https://api.chatengine.io/users/me");
                con = (HttpURLConnection) url.openConnection();
                con.setRequestMethod("GET");
                // Set headers
                con.setRequestProperty("Content-Type", "application/json");
                con.setRequestProperty("Accept", "application/json");
                con.setRequestProperty("Project-ID", "0e16047b-9510-4874-89dd-1cbce8ada1d7");
                con.setRequestProperty("User-Name", loginRequest.getUsername());
                con.setRequestProperty("User-Secret", "secret");
                // Generate response String
                StringBuilder responseStr = new StringBuilder();
                try (BufferedReader br = new BufferedReader(
                        new InputStreamReader(con.getInputStream(), "utf-8"))) {
                    String responseLine = null;
                    while ((responseLine = br.readLine()) != null) {
                        responseStr.append(responseLine.trim());
                    }
                }
                // Jsonify + return response
                Map<String, Object> response = new Gson().fromJson(
                        responseStr.toString(), new TypeToken<HashMap<String, Object>>() {
                        }.getType());
                //return new ResponseEntity<>(response, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            } finally {
                if (con != null) {
                    con.disconnect();
                }
            }
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

    @PostMapping("/confirm-payment")
    public ModelAndView confirmPayment(@RequestParam String token) {
        ModelAndView modelAndView = new ModelAndView();
        try {
            String email = jwtUtil.getEmailFromToken(token);
            if (email != null) {
                User user = userService.findByEmail(email);
                if (user != null) {
                    userService.updatePremiumUser(user);
                    modelAndView.setViewName("success");
                    modelAndView.setStatus(HttpStatus.OK);
                } else {
                    modelAndView.setViewName("failed");
                    modelAndView.setStatus(HttpStatus.NOT_FOUND);
                }
            } else {
                modelAndView.setViewName("failed");
                modelAndView.setStatus(HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            modelAndView.setViewName("failed");
            modelAndView.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return modelAndView;
    }
    
    @PostMapping("/failed-payment")
    public ModelAndView failedPayment() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("failed");
        modelAndView.setStatus(HttpStatus.OK);
        return modelAndView;
    }

    @GetMapping("/isPremium")
    public ResponseEntity<?> isPremium(@RequestParam String token) {
        try {
            String email = jwtUtil.getEmailFromToken(token);
            if (email != null) {
                User user = userService.findByEmail(email);
                if (user != null) {
                    boolean isPremium = false;
                    if (user.getPremiumPackBuyDate() != null) {
                        LocalDate premiumDate = user.getPremiumPackBuyDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                        LocalDate currentDate = LocalDate.now();
                        if (!premiumDate.isBefore(currentDate.minusMonths(3))) {
                            isPremium = true;
                        }
                    }
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
