package com.javafest.DiffDeptStormers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.javafest.DiffDeptStormers.service.GeminiService;

@RestController
public class GeminiController {
	
	@Autowired
	GeminiService geminiService;
	// Request body class
    public static class PromptRequest {
        private String prompt;
        private String geminiKey;

        public String getPrompt() {
            return prompt;
        }

        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }

        public String getGeminiKey() {
            return geminiKey;
        }

        public void setGeminiKey(String geminiKey) {
            this.geminiKey = geminiKey;
        }
    }

    @PostMapping("/prompt")
    public String getResponse(@RequestBody PromptRequest request) {
        return geminiService.callApi(request.getPrompt(), request.getGeminiKey());
    }
	
}
