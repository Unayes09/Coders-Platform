package com.javafest.DiffDeptStormers.model.cv;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Technologies")
public class TechnologySkill {
	@Id
	private String id;
	private String userEmail;
	private String tech;
	private String skillLevel;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public String getTech() {
		return tech;
	}
	public void setTech(String tech) {
		this.tech = tech;
	}
	public String getSkillLevel() {
		return skillLevel;
	}
	public void setSkillLevel(String skillLevel) {
		this.skillLevel = skillLevel;
	}
	
	
}
