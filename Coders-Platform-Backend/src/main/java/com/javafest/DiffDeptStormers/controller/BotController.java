package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.AiChat;
import com.javafest.DiffDeptStormers.model.BotResponse;
import com.javafest.DiffDeptStormers.model.User;
import com.javafest.DiffDeptStormers.service.MongoBotService;
import com.javafest.DiffDeptStormers.service.MongoUserService;
import com.javafest.DiffDeptStormers.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/bot")
public class BotController {

    @Autowired
    private MongoBotService mongoBotService;

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

    // Create a new AI Chat
    @PostMapping("/chats")
    public ResponseEntity<?> createAiChat(@RequestBody AiChat aiChat, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            if (!isAuthorized(token, aiChat.getOwnerEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            AiChat createdAiChat = mongoBotService.createAiChat(aiChat);
            return ResponseEntity.ok(createdAiChat);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Delete an AI Chat by ID
    @DeleteMapping("/chats/{chatId}")
    public ResponseEntity<?> deleteAiChat(@PathVariable String chatId, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            AiChat aiChat = mongoBotService.getAiChatById(chatId);
            if (aiChat == null || !isAuthorized(token, aiChat.getOwnerEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            mongoBotService.deleteAiChat(chatId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Get all AI Chats for a specific owner
    @GetMapping("/chats")
    public ResponseEntity<?> getAllAiChats(@RequestParam String ownerEmail, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            if (!isAuthorized(token, ownerEmail)) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            List<AiChat> aiChats = mongoBotService.getAllAiChats(ownerEmail);
            return ResponseEntity.ok(aiChats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Get all favourite AI Chats for a specific owner
    @GetMapping("/chats/favourites")
    public ResponseEntity<?> getAllFavouriteAiChats(@RequestParam String ownerEmail, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            if (!isAuthorized(token, ownerEmail)) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            List<AiChat> favouriteAiChats = mongoBotService.getAllFavouriteAiChats(ownerEmail);
            return ResponseEntity.ok(favouriteAiChats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Update AI Chat details
    @PutMapping("/chats/{chatId}")
    public ResponseEntity<?> updateAiChat(@PathVariable String chatId, @RequestBody AiChat aiChat, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;
            AiChat existingAiChat = mongoBotService.getAiChatById(chatId);
            //System.out.println(existingAiChat);
            if (existingAiChat == null || !isAuthorized(token, existingAiChat.getOwnerEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }
            //System.out.println(existingAiChat);
            AiChat updatedAiChat = mongoBotService.updateAiChat(chatId, aiChat.getChatName(), aiChat.isFavourite());
            //System.out.println(updatedAiChat);
            return ResponseEntity.ok(updatedAiChat);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Create a new Bot Response
    @PostMapping("/responses")
    public ResponseEntity<?> createBotResponse(@RequestBody BotResponse botResponse, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            AiChat aiChat = mongoBotService.getAiChatById(botResponse.getChatId());
            if (aiChat == null || !isAuthorized(token, aiChat.getOwnerEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            BotResponse createdBotResponse = mongoBotService.createBotResponse(botResponse);
            return ResponseEntity.ok(createdBotResponse);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Get all Bot Responses for a specific AI Chat
    @GetMapping("/responses")
    public ResponseEntity<?> getAllBotResponses(@RequestParam String chatId, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            AiChat aiChat = mongoBotService.getAiChatById(chatId);
            if (aiChat == null || !isAuthorized(token, aiChat.getOwnerEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            List<BotResponse> botResponses = mongoBotService.getAllBotResponses(chatId);
            return ResponseEntity.ok(botResponses);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Get all pinned Bot Responses for a specific AI Chat
    @GetMapping("/responses/pinned")
    public ResponseEntity<?> getAllPinnedBotResponses(@RequestParam String chatId, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            AiChat aiChat = mongoBotService.getAiChatById(chatId);
            if (aiChat == null || !isAuthorized(token, aiChat.getOwnerEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            List<BotResponse> pinnedBotResponses = mongoBotService.getAllPinnedBotResponses(chatId);
            return ResponseEntity.ok(pinnedBotResponses);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Delete a Bot Response by ID
    @DeleteMapping("/responses/{messageId}")
    public ResponseEntity<?> deleteBotResponse(@PathVariable String messageId, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            BotResponse botResponse = mongoBotService.getBotResponseById(messageId);
            if (botResponse == null) {
                return ResponseEntity.status(404).body("{\"message\": \"Bot Response not found\"}");
            }

            AiChat aiChat = mongoBotService.getAiChatById(botResponse.getChatId());
            if (aiChat == null || !isAuthorized(token, aiChat.getOwnerEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            mongoBotService.deleteBotResponse(messageId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Pin or unpin a Bot Response by ID
    @PutMapping("/responses/{messageId}/pin")
    public ResponseEntity<?> pinOrUnpinBotResponse(@PathVariable String messageId, @RequestParam boolean isPinned, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) return validationResponse;

            BotResponse botResponse = mongoBotService.getBotResponseById(messageId);
            if (botResponse == null) {
                return ResponseEntity.status(404).body("{\"message\": \"Bot Response not found\"}");
            }

            AiChat aiChat = mongoBotService.getAiChatById(botResponse.getChatId());
            if (aiChat == null || !isAuthorized(token, aiChat.getOwnerEmail())) {
                return ResponseEntity.status(401).body("{\"message\": \"Unauthorized\"}");
            }

            BotResponse updatedBotResponse = mongoBotService.pinOrUnpinBotResponse(messageId, isPinned);
            return ResponseEntity.ok(updatedBotResponse);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error\"}");
        }
    }
}
