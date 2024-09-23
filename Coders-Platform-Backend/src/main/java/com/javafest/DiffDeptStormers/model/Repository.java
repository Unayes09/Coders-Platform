package com.javafest.DiffDeptStormers.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Repositories")
public class Repository {

    @Id
    private String id;
    private String userId;
    private String repoName;
    private String repoDescription;
    private List<String> repoTopicTags;
    private boolean isPublic;
    private String email;

    // Getters and setters
    
    public String getId() {
        return id;
    }

    public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
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
        return this.isPublic;
    }

    public void setPublic(boolean aPublic) {
        this.isPublic = aPublic;
    }

}
