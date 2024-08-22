package com.javafest.DiffDeptStormers.service;

import com.javafest.DiffDeptStormers.model.Answers;
import com.javafest.DiffDeptStormers.model.Questions;
import com.javafest.DiffDeptStormers.model.Repository;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;

@Service
public class MongoQnAService {

    @Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getQuestionCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Questions");
    }

    private MongoCollection<Document> getAnswerCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("Answers");
    }
    
    public List<Questions> searchQuestions(String query) {
        MongoCollection<Document> questionCollection = getQuestionCollection();
        List<Questions> questions = new ArrayList<>();

        for (Document doc : questionCollection.find(new Document("$or", List.of(
                new Document("topicTags", new Document("$regex", query).append("$options", "i")),
                new Document("name", new Document("$regex", query).append("$options", "i")),
                new Document("question", new Document("$regex", query).append("$options", "i"))
        )))) {
            questions.add(convertDocumentToQuestion(doc));
        }

        return questions;
    }

    public Questions createQuestion(Questions question) {
        question.setCreatedAt(new Date());
        Document doc = new Document()
                .append("name", question.getName())
                .append("email", question.getEmail())
                .append("picture", question.getPicture())
                .append("topicTags", question.getTopicTags())
                .append("question", question.getQuestion())
                .append("createdAt", question.getCreatedAt());

        MongoCollection<Document> questionCollection = getQuestionCollection();
        questionCollection.insertOne(doc);
        question.setId(doc.getObjectId("_id").toString());
        return question;
    }

    public void deleteQuestion(String questionId) {
        MongoCollection<Document> questionCollection = getQuestionCollection();
        MongoCollection<Document> answerCollection = getAnswerCollection();
        questionCollection.deleteOne(eq("_id", new ObjectId(questionId)));
        answerCollection.deleteMany(eq("questionId", questionId));
    }

    public List<Questions> getAllQuestions() {
        MongoCollection<Document> questionCollection = getQuestionCollection();
        List<Questions> questionsList = new ArrayList<>();

        for (Document doc : questionCollection.find()) {
            Questions question = convertDocumentToQuestion(doc);
            questionsList.add(question);
        }
        return questionsList;
    }

    public Answers createAnswer(Answers answer) {
        answer.setCreatedAt(new Date());
        Document doc = new Document()
                .append("name", answer.getName())
                .append("email", answer.getEmail())
                .append("picture", answer.getPicture())
                .append("questionId", answer.getQuestionId())
                .append("answer", answer.getAnswer())
                .append("createdAt", answer.getCreatedAt());

        MongoCollection<Document> answerCollection = getAnswerCollection();
        answerCollection.insertOne(doc);
        answer.setId(doc.getObjectId("_id").toString());
        return answer;
    }

    public List<Answers> getAnswersByQuestionId(String questionId) {
        MongoCollection<Document> answerCollection = getAnswerCollection();
        List<Answers> answersList = new ArrayList<>();

        for (Document doc : answerCollection.find(eq("questionId", questionId))) {
            Answers answer = new Answers();
            answer.setId(doc.getObjectId("_id").toString());
            answer.setName(doc.getString("name"));
            answer.setEmail(doc.getString("email"));
            answer.setPicture(doc.getString("picture"));
            answer.setQuestionId(doc.getString("questionId"));
            answer.setAnswer(doc.getString("answer"));
            answer.setCreatedAt(doc.getDate("createdAt"));
            answersList.add(answer);
        }
        return answersList;
    }
    
 // Convert a MongoDB Document to a Questions object
    private Questions convertDocumentToQuestion(Document doc) {
        Questions question = new Questions();
        question.setId(doc.getString("id"));
        question.setName(doc.getString("name"));
        question.setEmail(doc.getString("email"));
        question.setPicture(doc.getString("picture"));
        question.setTopicTags(doc.getList("topicTags", String.class));
        question.setQuestion(doc.getString("question"));
        question.setCreatedAt(doc.getDate("createdAt"));
        return question;
    }
}
