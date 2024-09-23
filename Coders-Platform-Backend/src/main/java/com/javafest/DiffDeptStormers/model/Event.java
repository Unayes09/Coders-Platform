package com.javafest.DiffDeptStormers.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Events")
public class Event {
	
	@Id
    private String id;
	
	private String email;
	private String eventTitle;
    private String description;
    private String imageLink;
    private Number interestedCount;
    private List<String> interestedPeople;

    private Date createdAt;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getEventTitle() {
		return eventTitle;
	}

	public void setEventTitle(String eventTitle) {
		this.eventTitle = eventTitle;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImageLink() {
		return imageLink;
	}

	public void setImageLink(String imageLink) {
		this.imageLink = imageLink;
	}

	public Number getInterestedCount() {
		return interestedCount;
	}

	public void setInterestedCount(Number interestedCount) {
		this.interestedCount = interestedCount;
	}

	public List<String> getInterestedPeople() {
		return interestedPeople;
	}

	public void setInterestedPeople(List<String> interestedPeople) {
		this.interestedPeople = interestedPeople;
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
    
    

}
