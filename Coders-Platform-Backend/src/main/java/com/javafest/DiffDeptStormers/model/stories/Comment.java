package com.javafest.DiffDeptStormers.model.stories;
import java.util.Date;

public class Comment {
    private String commentText;
    private String commenterName;
    private String commenterEmail;
    private Date createdAt;

    // Constructors, getters, and setters
    public Comment() {
    }

    public Comment(String commentText, String commenterName, String commenterEmail, Date createdAt) {
        this.commentText = commentText;
        this.commenterName = commenterName;
        this.commenterEmail = commenterEmail;
        this.createdAt = createdAt;
    }

	public String getCommentText() {
		return commentText;
	}

	public void setCommentText(String commentText) {
		this.commentText = commentText;
	}

	public String getCommenterName() {
		return commenterName;
	}

	public void setCommenterName(String commenterName) {
		this.commenterName = commenterName;
	}

	public String getCommenterEmail() {
		return commenterEmail;
	}

	public void setCommenterEmail(String commenterEmail) {
		this.commenterEmail = commenterEmail;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

    // Add getters and setters
    
}
