package com.javafest.DiffDeptStormers.model.stories;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "stories")
public class Story {
    @Id
    private String id;
    private String name;
    private String userPictureLink;
    private Date createdAt;
    private String email;
    private String description;
    private List<String> imageLinks;
    private List<Comment> comments;

    // Constructors, getters, and setters
    public Story() {
    }

    public Story(String name, String userPictureLink, Date createdAt, String email, String description, List<String> imageLinks, List<Comment> comments) {
        this.name = name;
        this.userPictureLink = userPictureLink;
        this.createdAt = createdAt;
        this.email = email;
        this.description = description;
        this.imageLinks = imageLinks;
        this.comments = comments;
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUserPictureLink() {
		return userPictureLink;
	}

	public void setUserPictureLink(String userPictureLink) {
		this.userPictureLink = userPictureLink;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getImageLinks() {
		return imageLinks;
	}

	public void setImageLinks(List<String> imageLinks) {
		this.imageLinks = imageLinks;
	}

	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}

    // Add all getters and setters
    
    
}
