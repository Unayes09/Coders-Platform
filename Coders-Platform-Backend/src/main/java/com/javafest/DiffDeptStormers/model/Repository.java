package com.javafest.DiffDeptStormers.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Repositories")
public class Repository {

    @Id
    private String id;
    private String repoName;
    private String repoDescription;
    private List<String> repoTopicTags;
    private boolean isPublic;
    private List<File> files;

    public static class File {
        private String fileName;
        private String fileContent;

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

        @Override
        public String toString() {
            return "File{" +
                    "fileName='" + fileName + '\'' +
                    ", fileContent='" + fileContent + '\'' +
                    '}';
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRepoName() {
        return repoName;
    }

    public void setRepoName(String repoName) {
        this.repoName = repoName;
    }

    public String getRepoDescription() {
        return repoDescription;
    }

    public void setRepoDescription(String repoDescription) {
        this.repoDescription = repoDescription;
    }

    public List<String> getRepoTopicTags() {
        return repoTopicTags;
    }

    public void setRepoTopicTags(List<String> repoTopicTags) {
        this.repoTopicTags = repoTopicTags;
    }

    public boolean isPublic() {
    	System.out.println("get "+this.isPublic);
        return this.isPublic;
    }

    public void setPublic(boolean aPublic) {
    	System.out.println("in "+aPublic);
        this.isPublic = aPublic;
    }

    public List<File> getFiles() {
        return files;
    }

    public void setFiles(List<File> files) {
        this.files = files;
    }

    @Override
    public String toString() {
        return "Repository{" +
                "id='" + id + '\'' +
                ", repoName='" + repoName + '\'' +
                ", repoDescription='" + repoDescription + '\'' +
                ", repoTopicTags=" + repoTopicTags +
                ", isPublic=" + isPublic +
                ", files=" + files +
                '}';
    }
}
