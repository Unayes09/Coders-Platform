package com.javafest.DiffDeptStormers.service;

import com.javafest.DiffDeptStormers.model.File;
import com.javafest.DiffDeptStormers.model.Repository;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.mongodb.client.model.Filters.eq;

@Service
public class MongoRepoService {

    @Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getRepoCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Repositories");
    }

    private MongoCollection<Document> getFileCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Files");
    }

    private Document convertRepositoryToDocument(Repository repository) {
        return new Document()
                .append("userId", repository.getUserId())
                .append("repoName", repository.getRepoName())
                .append("repoDescription", repository.getRepoDescription())
                .append("repoTopicTags", repository.getRepoTopicTags())
                .append("isPublic", repository.isPublic())
                .append("email", repository.getEmail());
    }

    private Document convertFileToDocument(File file) {
        return new Document()
                .append("repoId", file.getRepoId())
                .append("fileName", file.getFileName())
                .append("fileContent", file.getFileContent())
                .append("email", file.getEmail());
    }

    public Repository saveRepository(Repository repository, String email) {
    	repository.setEmail(email);
        Document repoDoc = convertRepositoryToDocument(repository);
        MongoCollection<Document> repoCollection = getRepoCollection();
        repoCollection.insertOne(repoDoc);
        repository.setId(repoDoc.getObjectId("_id").toString());

        return repository;
    }

    public File saveFile(File file, String email) {
    	file.setEmail(email);
        Document fileDoc = convertFileToDocument(file);
        MongoCollection<Document> fileCollection = getFileCollection();
        fileCollection.insertOne(fileDoc);
        file.setId(fileDoc.getObjectId("_id").toString());
        return file;
    }

    public void deleteFile(String fileId, String email) {
        MongoCollection<Document> fileCollection = getFileCollection();
        Document fileDoc = fileCollection.find(eq("_id", new ObjectId(fileId))).first();
        if (fileDoc != null) {
            if (!fileDoc.getString("email").equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
            fileCollection.deleteOne(eq("_id", new ObjectId(fileId)));
        } else {
            throw new RuntimeException("File not found");
        }
    }

    public Repository updateRepository(String repoId, Repository updatedRepository, String email) {
        MongoCollection<Document> repoCollection = getRepoCollection();
        Document repoDoc = repoCollection.find(eq("_id", new ObjectId(repoId))).first();
        if (repoDoc != null) {
            if (!repoDoc.getString("email").equals(email)) {
                throw new RuntimeException("Unauthorized");
            }

            Document updateDoc = new Document()
                    .append("repoName", updatedRepository.getRepoName())
                    .append("repoDescription", updatedRepository.getRepoDescription())
                    .append("repoTopicTags", updatedRepository.getRepoTopicTags())
                    .append("isPublic", updatedRepository.isPublic());

            repoCollection.updateOne(eq("_id", new ObjectId(repoId)), new Document("$set", updateDoc));
            updatedRepository.setId(repoId);
            return updatedRepository;
        } else {
            throw new RuntimeException("Repository not found");
        }
    }

    public List<Repository> getAllPublicRepositories() {
        MongoCollection<Document> repoCollection = getRepoCollection();
        List<Repository> repositories = new ArrayList<>();

        for (Document doc : repoCollection.find(eq("isPublic", true))) {
            repositories.add(convertDocumentToRepository(doc));
        }

        return repositories;
    }

    public List<Repository> searchPublicRepositories(String query) {
        MongoCollection<Document> repoCollection = getRepoCollection();
        List<Repository> repositories = new ArrayList<>();

        for (Document doc : repoCollection.find(new Document("$or", List.of(
                new Document("repoTopicTags", new Document("$regex", query).append("$options", "i")),
                new Document("repoName", new Document("$regex", query).append("$options", "i"))
        )).append("isPublic", true))) {
            repositories.add(convertDocumentToRepository(doc));
        }

        return repositories;
    }

    public Optional<Repository> findRepositoryById(String repoId) {
        MongoCollection<Document> repoCollection = getRepoCollection();
        Document doc = repoCollection.find(eq("_id", new ObjectId(repoId))).first();

        if (doc != null) {
            return Optional.ofNullable(convertDocumentToRepository(doc));
        } else {
            return Optional.empty();
        }
    }

    public void deleteRepositoryById(String repoId, String email) {
        MongoCollection<Document> repoCollection = getRepoCollection();
        Document repoDoc = repoCollection.find(eq("_id", new ObjectId(repoId))).first();
        if (repoDoc != null) {
            if (!repoDoc.getString("email").equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
            repoCollection.deleteOne(eq("_id", new ObjectId(repoId)));
        } else {
            throw new RuntimeException("Repository not found");
        }
    }
    
    public List<File> getAllFilesOfRepository(String repoId) {
        MongoCollection<Document> fileCollection = getFileCollection();
        List<File> files = new ArrayList<>();
        for (Document doc : fileCollection.find(eq("repoId", repoId))) {
            files.add(convertDocumentToFile(doc));
        }
        return files;
    }

    public List<Repository> getAllRepositoriesOfUser(String userId) {
        MongoCollection<Document> repoCollection = getRepoCollection();
        List<Repository> repositories = new ArrayList<>();
        for (Document doc : repoCollection.find(eq("userId", userId))) {
            repositories.add(convertDocumentToRepository(doc));
        }
        return repositories;
    }
    
    private File convertDocumentToFile(Document doc) {
        File file = new File();
        file.setId(doc.getObjectId("_id").toString());
        file.setFileName(doc.getString("fileName"));
        file.setFileContent(doc.getString("fileContent"));
        file.setRepoId(doc.getString("repoId"));
        file.setEmail(doc.getString("email"));
        return file;
    }


    private Repository convertDocumentToRepository(Document doc) {
        Repository repository = new Repository();
        repository.setId(doc.getObjectId("_id").toString());
        repository.setUserId(doc.getString("userId")); // Set the userId
        repository.setRepoName(doc.getString("repoName"));
        repository.setRepoDescription(doc.getString("repoDescription"));
        repository.setRepoTopicTags(doc.getList("repoTopicTags", String.class));
        repository.setPublic(doc.getBoolean("isPublic"));
        repository.setEmail(doc.getString("email"));
        return repository;
    }
}
