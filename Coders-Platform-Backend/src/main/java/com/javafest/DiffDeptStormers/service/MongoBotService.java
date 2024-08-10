package com.javafest.DiffDeptStormers.service;

import com.javafest.DiffDeptStormers.model.AiChat;
import com.javafest.DiffDeptStormers.model.BotResponse;
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
import static com.mongodb.client.model.Updates.set;

@Service
public class MongoBotService {

    @Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getAiChatCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("AiChats");
    }

    private MongoCollection<Document> getBotResponseCollection() {
        MongoDatabase database = mongoClient.getDatabase("CodersPlatformDatabase");
        return database.getCollection("BotResponses");
    }

    public AiChat createAiChat(AiChat aiChat) {
        aiChat.setCreatedAt(new Date());
        Document doc = new Document()
                .append("chatName", aiChat.getChatName())
                .append("ownerEmail", aiChat.getOwnerEmail())
                .append("isFavourite", aiChat.isFavourite())
                .append("createdAt", aiChat.getCreatedAt());

        MongoCollection<Document> aiChatCollection = getAiChatCollection();
        aiChatCollection.insertOne(doc);
        aiChat.setId(doc.getObjectId("_id").toString());
        return aiChat;
    }

    public void deleteAiChat(String chatId) {
        MongoCollection<Document> aiChatCollection = getAiChatCollection();
        MongoCollection<Document> botResponseCollection = getBotResponseCollection();
        aiChatCollection.deleteOne(eq("_id", new ObjectId(chatId)));
        botResponseCollection.deleteMany(eq("chatId", chatId));
    }

    public List<AiChat> getAllAiChats(String ownerEmail) {
        MongoCollection<Document> aiChatCollection = getAiChatCollection();
        List<AiChat> aiChats = new ArrayList<>();
        for (Document doc : aiChatCollection.find(eq("ownerEmail", ownerEmail))) {
            aiChats.add(convertDocumentToAiChat(doc));
        }
        return aiChats;
    }

    public List<AiChat> getAllFavouriteAiChats(String ownerEmail) {
        MongoCollection<Document> aiChatCollection = getAiChatCollection();
        List<AiChat> aiChats = new ArrayList<>();
        for (Document doc : aiChatCollection.find(eq("ownerEmail", ownerEmail)).filter(eq("isFavourite", true))) {
            aiChats.add(convertDocumentToAiChat(doc));
        }
        return aiChats;
    }

    public AiChat updateAiChat(String chatId, String chatName, Boolean isFavourite) {
        MongoCollection<Document> aiChatCollection = getAiChatCollection();
        Document updateDoc = new Document();
        if (chatName != null) {
            updateDoc.append("chatName", chatName);
        }
        if (isFavourite != null) {
            updateDoc.append("isFavourite", isFavourite);
        }
        aiChatCollection.updateOne(eq("_id", new ObjectId(chatId)), new Document("$set", updateDoc));
        return getAiChatById(chatId);
    }

    public AiChat getAiChatById(String chatId) {
        MongoCollection<Document> aiChatCollection = getAiChatCollection();
        Document doc = aiChatCollection.find(eq("_id", new ObjectId(chatId))).first();
        return convertDocumentToAiChat(doc);
    }

    public BotResponse createBotResponse(BotResponse botResponse) {
        botResponse.setTime(new Date());
        Document doc = new Document()
                .append("chatId", botResponse.getChatId())
                .append("from", botResponse.getFrom())
                .append("to", botResponse.getTo())
                .append("message", botResponse.getMessage())
                .append("time", botResponse.getTime())
                .append("isPinned", botResponse.isPinned());

        MongoCollection<Document> botResponseCollection = getBotResponseCollection();
        botResponseCollection.insertOne(doc);
        botResponse.setId(doc.getObjectId("_id").toString());
        return botResponse;
    }

    public List<BotResponse> getAllBotResponses(String chatId) {
        MongoCollection<Document> botResponseCollection = getBotResponseCollection();
        List<BotResponse> botResponses = new ArrayList<>();
        for (Document doc : botResponseCollection.find(eq("chatId", chatId))) {
            botResponses.add(convertDocumentToBotResponse(doc));
        }
        return botResponses;
    }

    public List<BotResponse> getAllPinnedBotResponses(String chatId) {
        MongoCollection<Document> botResponseCollection = getBotResponseCollection();
        List<BotResponse> botResponses = new ArrayList<>();
        for (Document doc : botResponseCollection.find(eq("chatId", chatId)).filter(eq("isPinned", true))) {
            botResponses.add(convertDocumentToBotResponse(doc));
        }
        return botResponses;
    }

    public void deleteBotResponse(String messageId) {
        MongoCollection<Document> botResponseCollection = getBotResponseCollection();
        botResponseCollection.deleteOne(eq("_id", new ObjectId(messageId)));
    }

    public BotResponse pinOrUnpinBotResponse(String messageId, boolean isPinned) {
        MongoCollection<Document> botResponseCollection = getBotResponseCollection();
        botResponseCollection.updateOne(eq("_id", new ObjectId(messageId)), set("isPinned", isPinned));
        return getBotResponseById(messageId);
    }

    public BotResponse getBotResponseById(String messageId) {
        MongoCollection<Document> botResponseCollection = getBotResponseCollection();
        Document doc = botResponseCollection.find(eq("_id", new ObjectId(messageId))).first();
        return convertDocumentToBotResponse(doc);
    }

    private AiChat convertDocumentToAiChat(Document doc) {
        if (doc == null) {
            return null;
        }
        AiChat aiChat = new AiChat();
        aiChat.setId(doc.getObjectId("_id").toString());
        aiChat.setChatName(doc.getString("chatName"));
        aiChat.setOwnerEmail(doc.getString("ownerEmail"));
        aiChat.setFavourite(doc.getBoolean("isFavourite"));
        aiChat.setCreatedAt(doc.getDate("createdAt"));
        return aiChat;
    }

    private BotResponse convertDocumentToBotResponse(Document doc) {
        if (doc == null) {
            return null;
        }
        BotResponse botResponse = new BotResponse();
        botResponse.setId(doc.getObjectId("_id").toString());
        botResponse.setChatId(doc.getString("chatId"));
        botResponse.setFrom(doc.getString("from"));
        botResponse.setTo(doc.getString("to"));
        botResponse.setMessage(doc.getString("message"));
        botResponse.setTime(doc.getDate("time"));
        botResponse.setPinned(doc.getBoolean("isPinned"));
        return botResponse;
    }
}
