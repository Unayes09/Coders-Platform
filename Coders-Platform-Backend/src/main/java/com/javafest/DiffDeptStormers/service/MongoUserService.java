package com.javafest.DiffDeptStormers.service;

import static com.mongodb.client.model.Updates.set;
import com.javafest.DiffDeptStormers.model.User;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.mongodb.client.model.Filters.eq;

@Service
public class MongoUserService {

    @Autowired
    private MongoClient mongoClient;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private MongoCollection<Document> getUserCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Users");
    }

    public boolean existsByUsername(String username) {
        MongoCollection<Document> userCollection = getUserCollection();
        return userCollection.find(eq("username", username)).first() != null;
    }

    public boolean existsByEmail(String email) {
        MongoCollection<Document> userCollection = getUserCollection();
        return userCollection.find(eq("email", email)).first() != null;
    }
    
    public Optional<User> findByConfirmationToken(String confirmationToken) {
        Document document = getUserCollection().find(eq("confirmationToken", confirmationToken)).first();
        return Optional.ofNullable(document).map(this::convertDocumentToUser);
    }

    public void confirmUser(String confirmationToken) {
        getUserCollection().updateOne(eq("confirmationToken", confirmationToken), set("confirmationToken", "confirmed"));
    }

    public boolean isUserConfirmed(String email) {
        MongoCollection<Document> userCollection = getUserCollection();
        
        // Find the user with the given confirmation token
        Document userDoc = userCollection.find(eq("email", email)).first();
    
        // If no user found or confirmationToken is not "confirmed", return false
        if (userDoc == null || !"confirmed".equals(userDoc.getString("confirmationToken"))) {
            return false;
        }
        
        // If confirmationToken is "confirmed", return true
        return true;
    }
    
    public List<User> getAllUsers() {
        MongoCollection<Document> userCollection = getUserCollection();
        List<User> usersList = new ArrayList<>();
    
        // Specify the projection to include only _id, fullName, username, and email
        for (Document doc : userCollection.find().projection(new Document("_id", 1)
                .append("fullName", 1)
                .append("username", 1)
                .append("email", 1)
                .append("image", 1))) {
            
            User user = new User();
            user.setId(doc.getObjectId("_id").toString());
            user.setFullName(doc.getString("fullName"));
            user.setUsername(doc.getString("username"));
            user.setEmail(doc.getString("email"));
            user.setImage(doc.getString("image"));
    
            usersList.add(user);
        }
        return usersList;
    }
    

    public User saveUser(User user) {
        // Hash the password before saving
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        // Generate confirmation token
        String confirmationToken = UUID.randomUUID().toString();
        user.setConfirmationToken(confirmationToken);
        user.setCreatedAt(new Date());

        Document doc = new Document()
                .append("username", user.getUsername())
                .append("fullName", user.getFullName())
                .append("email", user.getEmail())
                .append("password", user.getPassword())
                .append("image", user.getImage())
                .append("address", user.getAddress())
                .append("phone", user.getPhone())
                .append("role", user.getRole())
                .append("premiumPackBuyDate", user.getPremiumPackBuyDate())
                .append("interests", user.getInterests())
                .append("skills", user.getSkills())
                .append("createdAt", user.getCreatedAt())
                .append("updatedAt", user.getUpdatedAt())
                .append("confirmationToken", user.getConfirmationToken());

        MongoCollection<Document> userCollection = getUserCollection();
        userCollection.insertOne(doc);
        user.setId(doc.getObjectId("_id").toString());

        // Send confirmation email
        String confirmationUrl = "http://localhost:5173/auth/confirm?token=" + confirmationToken;
        try {
            emailService.sendConfirmationEmail(user, confirmationUrl);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        return user;
    }
    
    
    public User updateUser(User user) {
        
        // Update only the repos field
        Document updateDoc = new Document()
                .append("updatedAt", new Date());  // Update the updatedAt field as well

        MongoCollection<Document> userCollection = getUserCollection();
        userCollection.updateOne(eq("_id", new ObjectId(user.getId())), new Document("$set", updateDoc));
        return user;
    }
    
    public User updatePremiumUser(User user) {
        Document updateDoc = new Document()
                .append("premiumPackBuyDate", new Date())
                .append("updatedAt", new Date());

        MongoCollection<Document> userCollection = getUserCollection();
        userCollection.updateOne(eq("email", user.getEmail()), new Document("$set", updateDoc));
        return user;
    }

    
    public User findByEmail(String email) {
        MongoCollection<Document> userCollection = getUserCollection();
        Document doc = userCollection.find(eq("email", email)).first();
        if (doc != null) {
            return convertDocumentToUser(doc);
        }
        return null;
    }

    public User findById(String userId) {
        MongoCollection<Document> userCollection = getUserCollection();
        Document doc = userCollection.find(eq("_id", new ObjectId(userId))).first();
        if (doc != null) {
            return convertDocumentToUser(doc);
        }
        return null;
    }
    
    public List<User> searchUsersBySkills(String skill) {
        MongoCollection<Document> userCollection = getUserCollection();
        List<User> users = new ArrayList<>();

        // Search for users by skills (case insensitive)
        Document regexFilter = new Document("$regex", skill).append("$options", "i");
        Document query = new Document("skills", regexFilter);

        for (Document doc : userCollection.find(query)) {
            users.add(convertDocumentToUser(doc));
        }

        return users;
    }


    private User convertDocumentToUser(Document doc) {
        User user = new User();
        user.setId(doc.getObjectId("_id").toString());
        user.setUsername(doc.getString("username"));
        user.setFullName(doc.getString("fullName"));
        user.setEmail(doc.getString("email"));
        user.setPassword(doc.getString("password"));
        user.setImage(doc.getString("image"));
        user.setAddress(doc.getString("address"));
        user.setPhone(doc.getString("phone"));
        user.setRole(User.Role.valueOf(doc.getString("role")));
        user.setPremiumPackBuyDate(doc.getDate("premiumPackBuyDate"));
        user.setInterests(doc.getList("interests", String.class));
        user.setSkills(doc.getList("skills", String.class));
        user.setCreatedAt(doc.getDate("createdAt"));
        user.setUpdatedAt(doc.getDate("updatedAt"));
        user.setConfirmationToken(doc.getString("confirmationToken"));
        return user;
    }

    public boolean checkPassword(String plainPassword, String hashedPassword) {
        return bCryptPasswordEncoder.matches(plainPassword, hashedPassword);
    }
}
