package com.javafest.DiffDeptStormers.service;

import com.javafest.DiffDeptStormers.model.SkillQuestions;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillQuestionService {

    @Autowired
    private MongoClient mongoClient;
    
    // Get Users Collection
    private MongoCollection<Document> getUserCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Users");
    }

    // Get Repositories Collection
    private MongoCollection<Document> getRepositoryCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Repositories");
    }
    
    private MongoCollection<Document> getQuesCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("SkillQuestions");
    }
    
    private MongoCollection<Document> getCertificateCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Certificates");
    }

    public void insertSkillQuestions(List<SkillQuestions> skillQuestions) {
        MongoCollection<Document> skillCollection = getQuesCollection();
        List<Document> documents = skillQuestions.stream().map(skillQuestion -> new Document()
                .append("topic", skillQuestion.getTopic())
                .append("type", skillQuestion.getType())
                .append("question", skillQuestion.getQuestion())
        ).collect(Collectors.toList());

        skillCollection.insertMany(documents);
    }

    // New method to get random questions based on topic
 // New method to get random questions based on topic
    public Map<String, List<Map<String, String>>> getRandomQuestionsByTopic(String topic) {
        MongoCollection<Document> skillCollection = getQuesCollection();

        // Fetch all questions for the given topic
        List<SkillQuestions> allQuestions = skillCollection.find(new Document("topic", topic))
                .into(new ArrayList<>())
                .stream()
                .map(doc -> {
                    SkillQuestions question = new SkillQuestions();
                    question.setId(doc.getObjectId("_id").toString());
                    question.setTopic(doc.getString("topic"));
                    question.setType(doc.getString("type"));
                    question.setQuestion(doc.getString("question"));
                    return question;
                })
                .collect(Collectors.toList());

        // Define the types of questions
        List<String> questionTypes = Arrays.asList("One-word Answer", "One-line Answer", "Coding Challenge", "Debugging Exercise", "Output Prediction");

        // Prepare a list to hold one random question per type
        List<Map<String, String>> questionsList = new ArrayList<>();
        Random random = new Random();

        for (String type : questionTypes) {
            // Filter questions by type
            List<SkillQuestions> questionsOfType = allQuestions.stream()
                    .filter(q -> q.getType().equals(type))
                    .collect(Collectors.toList());

            // Pick a random question if available
            if (!questionsOfType.isEmpty()) {
                SkillQuestions randomQuestion = questionsOfType.get(random.nextInt(questionsOfType.size()));
                Map<String, String> questionData = new HashMap<>();
                questionData.put("type", randomQuestion.getType());
                questionData.put("question", randomQuestion.getQuestion());
                questionsList.add(questionData);
            }
        }

        // Return the questions in the desired format
        Map<String, List<Map<String, String>>> response = new HashMap<>();
        response.put("questions", questionsList);
        return response;
    }
    
 // Method to insert a certificate
    public String addCertificate(String userEmail, String type, String secretCode) {
        // Check if the secret code is valid
        if (!"amar_sonar_bangla".equals(secretCode)) {
            return "Invalid secret code.";
        }

        // Check if the certificate type already exists for the user
        MongoCollection<Document> certificateCollection = getCertificateCollection();
        Document existingCertificate = certificateCollection.find(new Document("userEmail", userEmail)
                .append("type", type)).first();
        
        if (existingCertificate != null) {
            return "Certificate of this type already exists for the user.";
        }

        // Insert the certificate if it doesn't exist
        Document certificateDoc = new Document()
                .append("userEmail", userEmail)
                .append("type", type)
                .append("link", ""); // Add logic for link if needed
        certificateCollection.insertOne(certificateDoc);
        return "Certificate added successfully!";
    }

    // Method to get certificate types for a given userEmail
    public List<String> getCertificateTypes(String userEmail) {
        MongoCollection<Document> certificateCollection = getCertificateCollection();
        
        // Fetch all documents with the matching userEmail
        List<Document> certificates = certificateCollection.find(new Document("userEmail", userEmail)).into(new ArrayList<>());
        
        // Extract and return the certificate types
        return certificates.stream()
                .map(cert -> cert.getString("type"))
                .collect(Collectors.toList());
    }
    
 // Method to get user's interests, skills, public repo topic tags, and certificate types
    public Map<String, Object> getUserDataByEmail(String email) {
        // Fetch the user by email
        MongoCollection<Document> userCollection = getUserCollection();
        Document userDoc = userCollection.find(new Document("email", email)).first();

        Map<String, Object> responseData = new HashMap<>();

        if (userDoc != null) {
            // Fetch interests and skills
            List<String> interests = userDoc.getList("interests", String.class, new ArrayList<>());
            List<String> skills = userDoc.getList("skills", String.class, new ArrayList<>());

            // Combine interests and skills into one array
            List<String> interestAndSkills = new ArrayList<>();
            interestAndSkills.addAll(interests);
            interestAndSkills.addAll(skills);

            // Put the combined interests and skills into the response
            responseData.put("interestAndSkills", interestAndSkills);

            // Fetch public repository topic tags
            MongoCollection<Document> repoCollection = getRepositoryCollection();
            List<Document> publicRepos = repoCollection.find(new Document("email", email).append("isPublic", true)).into(new ArrayList<>());

            List<String> publicRepoTags = publicRepos.stream()
                    .flatMap(repo -> repo.getList("repoTopicTags", String.class, new ArrayList<>()).stream())
                    .collect(Collectors.toList());

            // Fetch certificate types
            MongoCollection<Document> certificateCollection = getCertificateCollection();
            List<Document> certificates = certificateCollection.find(new Document("userEmail", email)).into(new ArrayList<>());

            List<String> certificateTypes = certificates.stream()
                    .map(cert -> cert.getString("type"))
                    .collect(Collectors.toList());

            // Combine public repo tags and certificate types into one array
            List<String> repoAndCerts = new ArrayList<>();
            repoAndCerts.addAll(publicRepoTags);
            repoAndCerts.addAll(certificateTypes);

            // Put the combined repo topic tags and certificate types into the response
            responseData.put("repoAndCerts", repoAndCerts);

            return responseData;
        }

        // Return empty map if no user found
        return responseData;
    }


}
