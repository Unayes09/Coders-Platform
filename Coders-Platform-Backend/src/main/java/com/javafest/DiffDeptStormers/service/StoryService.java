package com.javafest.DiffDeptStormers.service;

import com.javafest.DiffDeptStormers.model.stories.Comment;
import com.javafest.DiffDeptStormers.model.stories.Story;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

@Service
public class StoryService {

    @Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getStoryCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("stories");
    }

    // Create a new Story
    public Story createStory(Story story) {
        story.setCreatedAt(new Date());
        Document doc = new Document()
                .append("name", story.getName())
                .append("userPictureLink", story.getUserPictureLink())
                .append("createdAt", story.getCreatedAt())
                .append("email", story.getEmail())
                .append("description", story.getDescription())
                .append("imageLinks", story.getImageLinks())
                .append("comments", new ArrayList<>()); // Empty comment list at creation

        MongoCollection<Document> storyCollection = getStoryCollection();
        storyCollection.insertOne(doc);
        story.setId(doc.getObjectId("_id").toString());
        return story;
    }

    // Delete a Story by its ID
    public void deleteStory(String storyId) {
        MongoCollection<Document> storyCollection = getStoryCollection();
        storyCollection.deleteOne(eq("_id", new ObjectId(storyId)));
    }

    // Get all Stories by a specific email
    public List<Story> getAllStoriesByEmail(String email) {
        MongoCollection<Document> storyCollection = getStoryCollection();
        List<Story> stories = new ArrayList<>();
        for (Document doc : storyCollection.find(eq("email", email))) {
            stories.add(convertDocumentToStory(doc));
        }
        return stories;
    }

    // Update an existing Story
    public Story updateStory(String storyId, String name, String description, List<String> imageLinks) {
        MongoCollection<Document> storyCollection = getStoryCollection();
        Document updateDoc = new Document();
        if (name != null) {
            updateDoc.append("name", name);
        }
        if (description != null) {
            updateDoc.append("description", description);
        }
        if (imageLinks != null) {
            updateDoc.append("imageLinks", imageLinks);
        }
        storyCollection.updateOne(eq("_id", new ObjectId(storyId)), new Document("$set", updateDoc));
        return getStoryById(storyId);
    }

    // Get a Story by its ID
    public Story getStoryById(String storyId) {
        MongoCollection<Document> storyCollection = getStoryCollection();
        Document doc = storyCollection.find(eq("_id", new ObjectId(storyId))).first();
        return convertDocumentToStory(doc);
    }

    // Add a comment to a Story
    public Story addCommentToStory(String storyId, Comment comment) {
        MongoCollection<Document> storyCollection = getStoryCollection();
        comment.setCreatedAt(new Date());
        Document commentDoc = new Document()
                .append("commentText", comment.getCommentText())
                .append("commenterName", comment.getCommenterName())
                .append("commenterEmail", comment.getCommenterEmail())
                .append("createdAt", comment.getCreatedAt());

        storyCollection.updateOne(eq("_id", new ObjectId(storyId)), new Document("$push", new Document("comments", commentDoc)));
        return getStoryById(storyId);
    }

    // Remove a comment from a Story using the full Comment object
    public Story deleteCommentFromStory(String storyId, Comment comment) {
        MongoCollection<Document> storyCollection = getStoryCollection();

        // Convert Comment object into a Document for matching
        Document commentDoc = new Document()
                .append("commentText", comment.getCommentText())
                .append("commenterName", comment.getCommenterName())
                .append("commenterEmail", comment.getCommenterEmail())
                .append("createdAt", comment.getCreatedAt());

        // Update the story to pull the comment that matches the full object
        storyCollection.updateOne(
                eq("_id", new ObjectId(storyId)),
                new Document("$pull", new Document("comments", commentDoc))
        );

        // Fetch and return the updated story
        return getStoryById(storyId);
    }

    
    public List<Story> getAllStories() {
        List<Story> stories = new ArrayList<>();
        MongoCollection<Document> storyCollection = getStoryCollection();

        for (Document doc : storyCollection.find()) {
            stories.add(convertDocumentToStory(doc));
        }

        return stories;
    }

    // Convert MongoDB document to Story object
    private Story convertDocumentToStory(Document doc) {
        if (doc == null) {
            return null;
        }
        Story story = new Story();
        story.setId(doc.getObjectId("_id").toString());
        story.setName(doc.getString("name"));
        story.setUserPictureLink(doc.getString("userPictureLink"));
        story.setCreatedAt(doc.getDate("createdAt"));
        story.setEmail(doc.getString("email"));
        story.setDescription(doc.getString("description"));
        story.setImageLinks((List<String>) doc.get("imageLinks"));

        List<Comment> comments = new ArrayList<>();
        List<Document> commentDocs = (List<Document>) doc.get("comments");
        if (commentDocs != null) {
            for (Document commentDoc : commentDocs) {
                comments.add(convertDocumentToComment(commentDoc));
            }
        }
        story.setComments(comments);
        return story;
    }

    // Convert MongoDB document to Comment object
    private Comment convertDocumentToComment(Document doc) {
        if (doc == null) {
            return null;
        }
        Comment comment = new Comment();
        comment.setCommentText(doc.getString("commentText"));
        comment.setCommenterName(doc.getString("commenterName"));
        comment.setCommenterEmail(doc.getString("commenterEmail"));
        comment.setCreatedAt(doc.getDate("createdAt"));
        return comment;
    }
}
