package com.javafest.DiffDeptStormers.service;

import static com.mongodb.client.model.Updates.set;
import com.javafest.DiffDeptStormers.model.Event;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.inc;
import static com.mongodb.client.model.Updates.push;

@Service
public class EventService {

    @Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getEventCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Events");
    }

    public Event createEvent(Event event) {
    	
        event.setInterestedCount(0); // Initially 0
        event.setInterestedPeople(new ArrayList<>()); // Empty list

        Document doc = new Document()
        		.append("email",event.getEmail())
                .append("eventTitle", event.getEventTitle())
                .append("description", event.getDescription())
                .append("imageLink", event.getImageLink())
                .append("interestedCount", event.getInterestedCount())
                .append("interestedPeople", event.getInterestedPeople())
                .append("createdAt", event.getCreatedAt());

        MongoCollection<Document> eventCollection = getEventCollection();
        eventCollection.insertOne(doc);
        event.setId(doc.getObjectId("_id").toString());
        return event;
    }

    public List<Event> getAllEvents() {
        MongoCollection<Document> eventCollection = getEventCollection();
        List<Event> events = new ArrayList<>();
        for (Document doc : eventCollection.find()) {
            events.add(convertDocumentToEvent(doc));
        }
        return events;
    }

    public Event markInterested(String eventId, String email) {
        MongoCollection<Document> eventCollection = getEventCollection();

        // Check if the user is already interested
        Document eventDoc = eventCollection.find(eq("_id", new ObjectId(eventId))).first();

        if (eventDoc != null) {
            List<String> interestedPeople = (List<String>) eventDoc.get("interestedPeople");

            if (interestedPeople != null && interestedPeople.contains(email)) {
                // User is already interested, return the event without modifying it
                return getEventById(eventId);
            }
        }

        // If not already interested, add the email and increment the count
        eventCollection.updateOne(eq("_id", new ObjectId(eventId)), push("interestedPeople", email));
        eventCollection.updateOne(eq("_id", new ObjectId(eventId)), inc("interestedCount", 1));

        return getEventById(eventId);
    }

    public Event unmarkInterested(String eventId, String email) {
        MongoCollection<Document> eventCollection = getEventCollection();

        // Find the event by its ID
        Document eventDoc = eventCollection.find(eq("_id", new ObjectId(eventId))).first();
        if (eventDoc != null) {
            List<String> interestedPeople = (List<String>) eventDoc.get("interestedPeople");

            if (interestedPeople != null && interestedPeople.contains(email)) {
                // Remove the email from the interestedPeople list
                interestedPeople.remove(email);

                // Update the event with the new interestedPeople list
                eventCollection.updateOne(eq("_id", new ObjectId(eventId)), set("interestedPeople", interestedPeople));

                // Decrement the interestedCount
                eventCollection.updateOne(eq("_id", new ObjectId(eventId)), inc("interestedCount", -1));
            }
        }

        // Return the updated event
        return getEventById(eventId);
    }


    public Event getEventById(String eventId) {
        MongoCollection<Document> eventCollection = getEventCollection();
        Document doc = eventCollection.find(eq("_id", new ObjectId(eventId))).first();
        return convertDocumentToEvent(doc);
    }

    private Event convertDocumentToEvent(Document doc) {
        if (doc == null) {
            return null;
        }
        Event event = new Event();
        event.setId(doc.getObjectId("_id").toString());
        event.setEmail(doc.getString("email"));
        event.setEventTitle(doc.getString("eventTitle"));
        event.setDescription(doc.getString("description"));
        event.setImageLink(doc.getString("imageLink"));
        event.setInterestedCount(doc.getInteger("interestedCount"));
        event.setInterestedPeople((List<String>) doc.get("interestedPeople"));
        event.setCreatedAt(doc.getDate("createdAt"));
        return event;
    }
    
 // Delete an event by ID
    public void deleteEvent(String eventId) {
    	//System.out.println("service");
        MongoCollection<Document> eventCollection = getEventCollection();
        eventCollection.deleteOne(eq("_id", new ObjectId(eventId)));
    }

    // Get all events created by a specific user by email
    public List<Event> getAllEventsByUser(String email) {
        MongoCollection<Document> eventCollection = getEventCollection();
        List<Event> events = new ArrayList<>();

        for (Document doc : eventCollection.find(eq("email", email))) {
            events.add(convertDocumentToEvent(doc));
        }
        return events;
    }

}
