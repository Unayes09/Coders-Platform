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
                .append("isPublic", repository.isPublic());
    }

    private Document convertFileToDocument(File file) {
        return new Document()
                .append("repoId", file.getRepoId())
                .append("fileName", file.getFileName())
                .append("fileContent", file.getFileContent());
    }

    public Repository saveRepository(Repository repository) {
        Document repoDoc = convertRepositoryToDocument(repository);
        MongoCollection<Document> repoCollection = getRepoCollection();
        repoCollection.insertOne(repoDoc);
        repository.setId(repoDoc.getObjectId("_id").toString());

        for (File file : repository.getFiles()) {
            file.setRepoId(repository.getId());
            saveFile(file);
        }

        return repository;
    }

    public File saveFile(File file) {
        Document fileDoc = convertFileToDocument(file);
        MongoCollection<Document> fileCollection = getFileCollection();
        fileCollection.insertOne(fileDoc);
        file.setId(fileDoc.getObjectId("_id").toString());
        return file;
    }

    public void deleteFile(String fileId) {
        MongoCollection<Document> fileCollection = getFileCollection();
        fileCollection.deleteOne(eq("_id", new ObjectId(fileId)));
    }

    public Repository updateRepository(String repoId, Repository updatedRepository) {
        
        Document updateDoc = new Document()
                .append("repoName", updatedRepository.getRepoName())
                .append("repoDescription", updatedRepository.getRepoDescription())
                .append("repoTopicTags", updatedRepository.getRepoTopicTags())
                .append("isPublic", updatedRepository.isPublic());

        MongoCollection<Document> repoCollection = getRepoCollection();
        repoCollection.updateOne(eq("_id", new ObjectId(repoId)), new Document("$set", updateDoc));
        updatedRepository.setId(repoId);
        return updatedRepository;
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

    public void deleteRepositoryById(String repoId) {
        MongoCollection<Document> repoCollection = getRepoCollection();
        repoCollection.deleteOne(eq("_id", new ObjectId(repoId)));
    }

    private Repository convertDocumentToRepository(Document doc) {
        Repository repository = new Repository();
        repository.setId(doc.getObjectId("_id").toString());
        repository.setUserId(doc.getString("userId")); // Set the userId
        repository.setRepoName(doc.getString("repoName"));
        repository.setRepoDescription(doc.getString("repoDescription"));
        repository.setRepoTopicTags(doc.getList("repoTopicTags", String.class));
        repository.setPublic(doc.getBoolean("isPublic"));

        List<File> files = new ArrayList<>();
        if (doc.get("files") != null) {
            for (Document fileDoc : (List<Document>) doc.get("files")) {
                File file = new File();
                file.setId(fileDoc.getObjectId("_id").toString());
                file.setRepoId(fileDoc.getString("repoId")); // Set the repoId
                file.setFileName(fileDoc.getString("fileName"));
                file.setFileContent(fileDoc.getString("fileContent"));
                files.add(file);
            }
        }
        repository.setFiles(files);

        return repository;
    }
}
