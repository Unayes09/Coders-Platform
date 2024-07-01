package com.javafest.DiffDeptStormers.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.javafest.DiffDeptStormers.model.User;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    public void sendConfirmationEmail(User user, String confirmationUrl) throws MessagingException {
        jakarta.mail.internet.MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        Context context = new Context();
        context.setVariable("user", user);
        context.setVariable("url", confirmationUrl);

        String htmlContent = templateEngine.process("confirmation-email", context);
        try {
        	
			helper.setText(htmlContent, true);
			helper.setTo(user.getEmail());
	        helper.setSubject("Confirm Your Registration");
	        helper.setFrom("coders-platform@javafest.com");
	        
		} catch (jakarta.mail.MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        javaMailSender.send(mimeMessage);
    }
}