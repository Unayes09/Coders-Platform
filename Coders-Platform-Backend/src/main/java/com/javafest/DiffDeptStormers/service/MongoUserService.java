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

import java.util.Date;
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
        String confirmationUrl = "http://your-frontend-app.com/confirm?token=" + confirmationToken;
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
