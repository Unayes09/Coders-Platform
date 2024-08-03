package com.javafest.DiffDeptStormers.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "Files")
public class File {

    @Id
    private String id;
    private String repoId;
    private String fileName;
    private String fileContent;
    private String email;
    private Date timestamp;
    private String language; // New field for language

    // Constructors, getters, and setters
    public File() {
    }

    public File(String fileName, String fileContent, String language) {
        this.fileName = fileName;
        this.fileContent = fileContent;
        this.timestamp = new Date(); // Set the timestamp to the current date and time
        this.language = language;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRepoId() {
        return repoId;
    }

    public void setRepoId(String repoId) {
        this.repoId = repoId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileContent() {
        return fileContent;
    }

    public void setFileContent(String fileContent) {
        this.fileContent = fileContent;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    @Override
    public String toString() {
        return "File{" +
                "id='" + id + '\'' +
                ", repoId='" + repoId + '\'' +
                ", fileName='" + fileName + '\'' +
                ", fileContent='" + fileContent + '\'' +
                ", email='" + email + '\'' +
                ", timestamp=" + timestamp +
                ", language='" + language + '\'' +
                '}';
    }
}
