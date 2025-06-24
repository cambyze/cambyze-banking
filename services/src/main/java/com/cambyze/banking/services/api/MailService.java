// package com.cambyze.banking.services.api;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;

// @Service
// public class MailService {

//   @Autowired
//   private JavaMailSender mailSender;
  

//   public void sendSupportMail(String fromName, String fromEmail, String messageBody) {
//     SimpleMailMessage message = new SimpleMailMessage();
//     message.setTo(fromEmail);
//     message.setSubject("New message from Cambyze contact form");
//     message.setText("From: " + fromName + " <" + fromEmail + ">\n\n" + messageBody);

//     mailSender.send(message);
//   }

//   public void sendResetCodeEmail(String toEmail, String resetCode) {
//     SimpleMailMessage message = new SimpleMailMessage();
//     message.setTo(toEmail);
//     message.setSubject("Votre code de réinitialisation");
//     message.setText("code : " + resetCode);

//     mailSender.send(message);
//   }

//   public void MailSender(String name, String email, String msg) {
//     System.out.println("Received contact form from " + name + " (" + email + "): " + msg);

//     SimpleMailMessage mail = new SimpleMailMessage();
//     mail.setTo("mailtestdev11@gmail.com");
//     mail.setSubject("New Contact Form Submission");
//     mail.setText("From: " + name + " <" + email + ">\n\n" + msg);
//     mail.setFrom("mailtestdev11@gmail.com");
//     try {
//       mailSender.send(mail);
//       System.out.println("Email sent successfully");
//     } catch (Exception e) {
//       System.err.println("Failed to send email: " + e.getMessage());
//       e.printStackTrace();
//     }

//     // return "Message sent";
//   }


// }
