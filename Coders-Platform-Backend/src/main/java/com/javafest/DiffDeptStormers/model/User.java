package com.javafest.DiffDeptStormers.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Document(collection = "Users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String image;

    private String address;

    private String phone;

    private Role role;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date premiumPackBuyDate;

    private List<String> interests;

    private List<String> skills;

    @CreatedDate
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date createdAt;

    @LastModifiedDate
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date updatedAt;

    private String confirmationToken;

    @Override
    public String toString() {
        return "User {" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", image='" + image + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", role=" + role +
                ", premiumPackBuyDate=" + premiumPackBuyDate +
                ", interests=" + interests +
                ", skills=" + skills +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", confirmationToken='" + confirmationToken + '\'' +
                '}';
    }
    
    // Getters and setters...

    public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Date getPremiumPackBuyDate() {
		return premiumPackBuyDate;
	}

	public void setPremiumPackBuyDate(Date premiumPackBuyDate) {
		this.premiumPackBuyDate = premiumPackBuyDate;
	}

	public List<String> getInterests() {
		return interests;
	}

	public void setInterests(List<String> interests) {
		this.interests = interests;
	}

	public List<String> getSkills() {
		return skills;
	}

	public void setSkills(List<String> skills) {
		this.skills = skills;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getConfirmationToken() {
		return confirmationToken;
	}

	public void setConfirmationToken(String confirmationToken) {
		this.confirmationToken = confirmationToken;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) &&
                Objects.equals(username, user.username) &&
                Objects.equals(fullName, user.fullName) &&
                Objects.equals(email, user.email) &&
                Objects.equals(password, user.password) &&
                Objects.equals(image, user.image) &&
                Objects.equals(address, user.address) &&
                Objects.equals(phone, user.phone) &&
                role == user.role &&
                Objects.equals(premiumPackBuyDate, user.premiumPackBuyDate) &&
                Objects.equals(interests, user.interests) &&
                Objects.equals(skills, user.skills) &&
                Objects.equals(createdAt, user.createdAt) &&
                Objects.equals(updatedAt, user.updatedAt) &&
                Objects.equals(confirmationToken, user.confirmationToken);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, fullName, email, password, image, address, phone, role, premiumPackBuyDate, interests, skills, createdAt, updatedAt, confirmationToken);
    }

    public enum Role {
        NORMAL_USER,
        ADMIN,
        RECRUITER,
        PREMIUM_USER
    }
}