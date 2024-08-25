package com.javafest.DiffDeptStormers.service;

import com.javafest.DiffDeptStormers.model.cv.*;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;

@Service
public class MongoCvService {

	@Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getAchievementCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Achievements");
    }
    private MongoCollection<Document> getPersonalCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("CVPersonal");
    }
    private MongoCollection<Document> getExperienceCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Experiences");
    }
    private MongoCollection<Document> getProjectCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Projects");
    }
    private MongoCollection<Document> getTechnologyCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Technologies");
    }
    
    public CVPersonal createPersonal(CVPersonal personal) {
        Document doc = new Document()
                .append("name", personal.getName())
                .append("picture", personal.getPicture())
                .append("dob", personal.getDob())
                .append("portfolio", personal.getPortfolio())
		        .append("github", personal.getGithub())
		        .append("linkedin", personal.getLinkedin())
		        .append("hobbies", personal.getHobbies())
		        .append("about", personal.getAbout())
		        .append("email", personal.getEmail());

        MongoCollection<Document> personalCollection = getPersonalCollection();
        personalCollection.insertOne(doc);
        personal.setId(doc.getObjectId("_id").toString());
        return personal;
    }
    
    public ProjectSkill createProject(ProjectSkill project) {
        Document doc = new Document()
                .append("userEmail", project.getUserEmail())
                .append("startEndDate", project.getStartEndDate())
                .append("title", project.getTitle())
                .append("details", project.getDetails())
		        .append("link", project.getLink())
		        .append("tech", project.getTech());

        MongoCollection<Document> projectCollection = getProjectCollection();
        projectCollection.insertOne(doc);
        project.setId(doc.getObjectId("_id").toString());
        return project;
    }
    
    public TechnologySkill createTechnology(TechnologySkill techSkill) {
        Document doc = new Document()
                .append("userEmail", techSkill.getUserEmail())
                .append("tech", techSkill.getTech())
                .append("skillLevel", techSkill.getSkillLevel());

        MongoCollection<Document> techSkillCollection = getTechnologyCollection();
        techSkillCollection.insertOne(doc);
        techSkill.setId(doc.getObjectId("_id").toString());
        return techSkill;
    }
    
    public AchievementSkill createAchievement(AchievementSkill achievement) {
        Document doc = new Document()
                .append("userEmail", achievement.getUserEmail())
                .append("title", achievement.getTitle())
                .append("org", achievement.getOrg())
                .append("credential", achievement.getCredential());

        MongoCollection<Document> achievementCollection = getAchievementCollection();
        achievementCollection.insertOne(doc);
        achievement.setId(doc.getObjectId("_id").toString());
        return achievement;
    }
    
    public ExperienceSkill createExperience(ExperienceSkill experience) {
        Document doc = new Document()
                .append("userEmail", experience.getUserEmail())
                .append("title", experience.getTitle())
                .append("org", experience.getOrg())
                .append("startEndDate", experience.getStartEndDate());

        MongoCollection<Document> experienceCollection = getExperienceCollection();
        experienceCollection.insertOne(doc);
        experience.setId(doc.getObjectId("_id").toString());
        return experience;
    }
    
    public void deleteProject(String projectId) {
        MongoCollection<Document> aiChatCollection = getProjectCollection();
        aiChatCollection.deleteOne(eq("_id", new ObjectId(projectId)));
    }
    
    public void deleteExperience(String experienceId) {
        MongoCollection<Document> experienceCollection = getExperienceCollection();
        experienceCollection.deleteOne(eq("_id", new ObjectId(experienceId)));
    }
    
    public void deleteAchievement(String achievementId) {
        MongoCollection<Document> achievementCollection = getAchievementCollection();
        achievementCollection.deleteOne(eq("_id", new ObjectId(achievementId)));
    }
    
    public void deleteTechnology(String techSkillId) {
        MongoCollection<Document> techSkillCollection = getTechnologyCollection();
        techSkillCollection.deleteOne(eq("_id", new ObjectId(techSkillId)));
    }
    
    public CVPersonal updatePersonal(String email, CVPersonal personal) {
        Document updatedDoc = new Document()
                .append("name", personal.getName())
                .append("picture", personal.getPicture())
                .append("dob", personal.getDob())
                .append("portfolio", personal.getPortfolio())
                .append("github", personal.getGithub())
                .append("linkedin", personal.getLinkedin())
                .append("hobbies", personal.getHobbies())
                .append("about", personal.getAbout())
                .append("email", personal.getEmail());

        MongoCollection<Document> personalCollection = getPersonalCollection();
        personalCollection.updateOne(eq("email", email), new Document("$set", updatedDoc));
        return personal;
    }
    
    public ProjectSkill updateProject(String projectId, ProjectSkill project) {
        Document updatedDoc = new Document()
                .append("userEmail", project.getUserEmail())
                .append("startEndDate", project.getStartEndDate())
                .append("title", project.getTitle())
                .append("details", project.getDetails())
                .append("link", project.getLink())
                .append("tech", project.getTech());

        MongoCollection<Document> projectCollection = getProjectCollection();
        projectCollection.updateOne(eq("_id", new ObjectId(projectId)), new Document("$set", updatedDoc));
        return project;
    }
    
    public TechnologySkill updateTechnologySkill(String techSkillId, TechnologySkill techSkill) {
        Document updatedDoc = new Document()
                .append("userEmail", techSkill.getUserEmail())
                .append("tech", techSkill.getTech())
                .append("skillLevel", techSkill.getSkillLevel());

        MongoCollection<Document> techSkillCollection = getTechnologyCollection();
        techSkillCollection.updateOne(eq("_id", new ObjectId(techSkillId)), new Document("$set", updatedDoc));
        return techSkill;
    }
    
    public AchievementSkill updateAchievementSkill(String achievementId, AchievementSkill achievement) {
        Document updatedDoc = new Document()
                .append("userEmail", achievement.getUserEmail())
                .append("title", achievement.getTitle())
                .append("org", achievement.getOrg())
                .append("credential", achievement.getCredential());

        MongoCollection<Document> achievementCollection = getAchievementCollection();
        achievementCollection.updateOne(eq("_id", new ObjectId(achievementId)), new Document("$set", updatedDoc));
        return achievement;
    }
    
    public ExperienceSkill updateExperienceSkill(String experienceId, ExperienceSkill experience) {
        Document updatedDoc = new Document()
                .append("userEmail", experience.getUserEmail())
                .append("title", experience.getTitle())
                .append("org", experience.getOrg())
                .append("startEndDate", experience.getStartEndDate());

        MongoCollection<Document> experienceCollection = getExperienceCollection();
        experienceCollection.updateOne(eq("_id", new ObjectId(experienceId)), new Document("$set", updatedDoc));
        return experience;
    }
    
    
    //main get list
    public List<List<Object>> getAllDataByEmail(String email) {
        List<List<Object>> allData = new ArrayList<>();

        // Fetch and add CVPersonal data
        List<CVPersonal> personalList = getPersonalDataByEmail(email);
        allData.add(new ArrayList<>(personalList));

        // Fetch and add ProjectSkill data
        List<ProjectSkill> projectList = getProjectDataByEmail(email);
        allData.add(new ArrayList<>(projectList));

        // Fetch and add TechnologySkill data
        List<TechnologySkill> techList = getTechnologyDataByEmail(email);
        allData.add(new ArrayList<>(techList));

        // Fetch and add AchievementSkill data
        List<AchievementSkill> achievementList = getAchievementDataByEmail(email);
        allData.add(new ArrayList<>(achievementList));

        // Fetch and add ExperienceSkill data
        List<ExperienceSkill> experienceList = getExperienceDataByEmail(email);
        allData.add(new ArrayList<>(experienceList));

        return allData;
    }

    // Helper method to fetch CVPersonal data by email
    private List<CVPersonal> getPersonalDataByEmail(String email) {
        MongoCollection<Document> personalCollection = getPersonalCollection();
        List<CVPersonal> personalList = new ArrayList<>();
        personalCollection.find(eq("email", email)).forEach(doc -> {
            CVPersonal personal = new CVPersonal();
            personal.setId(doc.getObjectId("_id").toString());
            personal.setName(doc.getString("name"));
            personal.setPicture(doc.getString("picture"));
            personal.setDob(doc.getString("dob"));
            personal.setPortfolio(doc.getString("portfolio"));
            personal.setGithub(doc.getString("github"));
            personal.setLinkedin(doc.getString("linkedin"));
            personal.setHobbies(doc.getString("hobbies"));
            personal.setAbout(doc.getString("about"));
            personal.setEmail(doc.getString("email"));
            personalList.add(personal);
        });
        return personalList;
    }

    // Helper method to fetch ProjectSkill data by email
    private List<ProjectSkill> getProjectDataByEmail(String email) {
        MongoCollection<Document> projectCollection = getProjectCollection();
        List<ProjectSkill> projectList = new ArrayList<>();
        projectCollection.find(eq("userEmail", email)).forEach(doc -> {
            ProjectSkill project = new ProjectSkill();
            project.setId(doc.getObjectId("_id").toString());
            project.setUserEmail(doc.getString("userEmail"));
            project.setStartEndDate(doc.getString("startEndDate"));
            project.setTitle(doc.getString("title"));
            project.setDetails(doc.getString("details"));
            project.setLink(doc.getString("link"));
            project.setTech(doc.getString("tech"));
            projectList.add(project);
        });
        return projectList;
    }

    // Helper method to fetch TechnologySkill data by email
    private List<TechnologySkill> getTechnologyDataByEmail(String email) {
        MongoCollection<Document> techSkillCollection = getTechnologyCollection();
        List<TechnologySkill> techList = new ArrayList<>();
        techSkillCollection.find(eq("userEmail", email)).forEach(doc -> {
            TechnologySkill techSkill = new TechnologySkill();
            techSkill.setId(doc.getObjectId("_id").toString());
            techSkill.setUserEmail(doc.getString("userEmail"));
            techSkill.setTech(doc.getString("tech"));
            techSkill.setSkillLevel(doc.getString("skillLevel"));
            techList.add(techSkill);
        });
        return techList;
    }

    // Helper method to fetch AchievementSkill data by email
    private List<AchievementSkill> getAchievementDataByEmail(String email) {
        MongoCollection<Document> achievementCollection = getAchievementCollection();
        List<AchievementSkill> achievementList = new ArrayList<>();
        achievementCollection.find(eq("userEmail", email)).forEach(doc -> {
            AchievementSkill achievement = new AchievementSkill();
            achievement.setId(doc.getObjectId("_id").toString());
            achievement.setUserEmail(doc.getString("userEmail"));
            achievement.setTitle(doc.getString("title"));
            achievement.setOrg(doc.getString("org"));
            achievement.setCredential(doc.getString("credential"));
            achievementList.add(achievement);
        });
        return achievementList;
    }

    // Helper method to fetch ExperienceSkill data by email
    private List<ExperienceSkill> getExperienceDataByEmail(String email) {
        MongoCollection<Document> experienceCollection = getExperienceCollection();
        List<ExperienceSkill> experienceList = new ArrayList<>();
        experienceCollection.find(eq("userEmail", email)).forEach(doc -> {
            ExperienceSkill experience = new ExperienceSkill();
            experience.setId(doc.getObjectId("_id").toString());
            experience.setUserEmail(doc.getString("userEmail"));
            experience.setTitle(doc.getString("title"));
            experience.setOrg(doc.getString("org"));
            experience.setStartEndDate(doc.getString("startEndDate"));
            experienceList.add(experience);
        });
        return experienceList;
    }
    
 // Helper method to fetch ProjectSkill data by id
    public ProjectSkill getProjectById(String id) {
        MongoCollection<Document> projectCollection = getProjectCollection();
        Document doc = projectCollection.find(eq("_id", new ObjectId(id))).first();
        if (doc == null) {
            return null; // Return null if no document is found
        }
        ProjectSkill project = new ProjectSkill();
        project.setId(doc.getObjectId("_id").toString());
        project.setUserEmail(doc.getString("userEmail"));
        project.setStartEndDate(doc.getString("startEndDate"));
        project.setTitle(doc.getString("title"));
        project.setDetails(doc.getString("details"));
        project.setLink(doc.getString("link"));
        project.setTech(doc.getString("tech"));
        return project;
    }

    // Helper method to fetch TechnologySkill data by id
    public TechnologySkill getTechnologyById(String id) {
        MongoCollection<Document> techSkillCollection = getTechnologyCollection();
        Document doc = techSkillCollection.find(eq("_id", new ObjectId(id))).first();
        if (doc == null) {
            return null; // Return null if no document is found
        }
        TechnologySkill techSkill = new TechnologySkill();
        techSkill.setId(doc.getObjectId("_id").toString());
        techSkill.setUserEmail(doc.getString("userEmail"));
        techSkill.setTech(doc.getString("tech"));
        techSkill.setSkillLevel(doc.getString("skillLevel"));
        return techSkill;
    }

    // Helper method to fetch AchievementSkill data by id
    public AchievementSkill getAchievementById(String id) {
        MongoCollection<Document> achievementCollection = getAchievementCollection();
        Document doc = achievementCollection.find(eq("_id", new ObjectId(id))).first();
        if (doc == null) {
            return null; // Return null if no document is found
        }
        AchievementSkill achievement = new AchievementSkill();
        achievement.setId(doc.getObjectId("_id").toString());
        achievement.setUserEmail(doc.getString("userEmail"));
        achievement.setTitle(doc.getString("title"));
        achievement.setOrg(doc.getString("org"));
        achievement.setCredential(doc.getString("credential"));
        return achievement;
    }

    // Helper method to fetch ExperienceSkill data by id
    public ExperienceSkill getExperienceById(String id) {
        MongoCollection<Document> experienceCollection = getExperienceCollection();
        Document doc = experienceCollection.find(eq("_id", new ObjectId(id))).first();
        if (doc == null) {
            return null; // Return null if no document is found
        }
        ExperienceSkill experience = new ExperienceSkill();
        experience.setId(doc.getObjectId("_id").toString());
        experience.setUserEmail(doc.getString("userEmail"));
        experience.setTitle(doc.getString("title"));
        experience.setOrg(doc.getString("org"));
        experience.setStartEndDate(doc.getString("startEndDate"));
        return experience;
    }

}
