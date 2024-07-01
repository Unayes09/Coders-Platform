package com.javafest.DiffDeptStormers.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.javafest.DiffDeptStormers.model.User;
import com.javafest.DiffDeptStormers.repository.UserRepository;

import javax.mail.MessagingException;

import java.util.Date;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private EmailService emailService;
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User saveUser(User user) {
        // Hash the password before saving
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        // Generate confirmation token
        String confirmationToken = generateConfirmationToken();
        user.setConfirmationToken(confirmationToken);
        user.setCreatedAt(new Date());

        User savedUser = userRepository.save(user);

        // Send confirmation email
        String confirmationUrl = "http://your-frontend-app.com/confirm?token=" + confirmationToken;
        try {
            emailService.sendConfirmationEmail(savedUser, confirmationUrl);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        return savedUser;
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return bCryptPasswordEncoder.matches(rawPassword, encodedPassword);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    private String generateConfirmationToken() {
        return UUID.randomUUID().toString();
    }
}