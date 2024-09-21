package com.javafest.DiffDeptStormers.service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.javafest.DiffDeptStormers.model.Feedback;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FeedbackService {

    private final MongoCollection<Document> feedbackCollection;

    @Autowired
    public FeedbackService(MongoClient mongoClient) {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        this.feedbackCollection = database.getCollection("feedbacks");
    }

    // Send Feedback
    public void sendFeedback(Feedback feedback) {
        Document doc = new Document("name", feedback.getName())
                .append("email", feedback.getEmail())
                .append("description", feedback.getDescription());
        feedbackCollection.insertOne(doc);
    }

    // Get All Feedback
    public List<Feedback> getAllFeedback() {
        List<Feedback> feedbackList = new ArrayList<>();
        for (Document doc : feedbackCollection.find()) {
            Feedback feedback = new Feedback(
                doc.getString("name"),
                doc.getString("email"),
                doc.getString("description")
            );
            feedback.setId(doc.getObjectId("_id").toString());
            feedbackList.add(feedback);
        }
        return feedbackList;
    }
}
