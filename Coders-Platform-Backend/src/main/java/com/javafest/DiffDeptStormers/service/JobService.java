package com.javafest.DiffDeptStormers.service;

import com.javafest.DiffDeptStormers.model.Job;
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

@Service
public class JobService {

    @Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getJobCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Jobs");
    }

    // Create a new job
    public Job createJob(Job job) {
        job.setCreatedAt(new Date());
        Document doc = new Document()
                .append("name", job.getName())
                .append("email", job.getEmail())
                .append("type", job.getType())
                .append("tags", job.getTags())
                .append("title", job.getTitle())
                .append("time", job.getTime())
                .append("salary", job.getSalary())
                .append("description", job.getDescription())
                .append("createdAt", job.getCreatedAt());

        MongoCollection<Document> jobCollection = getJobCollection();
        jobCollection.insertOne(doc);
        job.setId(doc.getObjectId("_id").toString());
        return job;
    }

    // Get all jobs
    public List<Job> getAllJobs() {
        MongoCollection<Document> jobCollection = getJobCollection();
        List<Job> jobs = new ArrayList<>();
        for (Document doc : jobCollection.find()) {
            jobs.add(convertDocumentToJob(doc));
        }
        return jobs;
    }

    // Get job by ID
    public Job getJobById(String id) {
        MongoCollection<Document> jobCollection = getJobCollection();
        Document doc = jobCollection.find(eq("_id", new ObjectId(id))).first();
        if (doc != null) {
            return convertDocumentToJob(doc);
        }
        return null;
    }

    // Delete a job by ID
    public void deleteJob(String jobId) {
        MongoCollection<Document> jobCollection = getJobCollection();
        jobCollection.deleteOne(eq("_id", new ObjectId(jobId)));
    }
    
    //Search Job
    public List<Job> searchJobs(String searchTerm) {
        MongoCollection<Document> jobCollection = getJobCollection();
        List<Job> jobs = new ArrayList<>();

        // Search for jobs by title, tags, or name (case insensitive)
        Document regexFilter = new Document("$regex", searchTerm).append("$options", "i");  // 'i' for case insensitive
        Document query = new Document("$or", List.of(
                new Document("title", regexFilter),
                new Document("tags", regexFilter),
                new Document("name", regexFilter)
        ));

        for (Document doc : jobCollection.find(query)) {
            jobs.add(convertDocumentToJob(doc));
        }

        return jobs;
    }


    // Convert MongoDB document to Job object
    private Job convertDocumentToJob(Document doc) {
        Job job = new Job();
        job.setId(doc.getObjectId("_id").toString());
        job.setName(doc.getString("name"));
        job.setEmail(doc.getString("email"));
        job.setType(doc.getString("type"));
        job.setTags(doc.getList("tags", String.class));
        job.setTitle(doc.getString("title"));
        job.setTime(doc.getString("time"));
        job.setSalary(doc.getString("salary"));
        job.setDescription(doc.getString("description"));
        job.setCreatedAt(doc.getDate("createdAt"));
        return job;
    }
}
