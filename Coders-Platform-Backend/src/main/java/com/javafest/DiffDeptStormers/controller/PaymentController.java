package com.javafest.DiffDeptStormers.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${payment.gateway.url}")
    private String paymentGatewayUrl;

    @PostMapping("/process")
    public ResponseEntity<String> processPayment(@RequestBody Map<String, Object> paymentDetails) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(paymentDetails, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                paymentGatewayUrl,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}
