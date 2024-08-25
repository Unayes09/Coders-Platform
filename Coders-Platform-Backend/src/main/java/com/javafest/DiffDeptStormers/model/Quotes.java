package com.javafest.DiffDeptStormers.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Quotes")
public class Quotes {
	
	@Id
	private String id;
	private String qNumber;
    private String quote;
    
    // Getter and Setter
    
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getqNumber() {
		return qNumber;
	}
	public void setqNumber(String qNumber) {
		this.qNumber = qNumber;
	}
	public String getQuote() {
		return quote;
	}
	public void setQuote(String quote) {
		this.quote = quote;
	}

}
