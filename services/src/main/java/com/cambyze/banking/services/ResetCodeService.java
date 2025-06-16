package com.cambyze.banking.services;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import com.cambyze.banking.services.api.MailService;

@Service
public class ResetCodeService {

  private final Map<String, ResetCodeData> codes = new ConcurrentHashMap<>();
  private final MailService mailService;

  public ResetCodeService(MailService mailService) {
    this.mailService = mailService;
  }

  public void generateAndSendCode(String email, String SenderMail) {
    String code = String.valueOf((int) (Math.random() * 900000) + 100000); // 6 chiffres
    codes.put(email, new ResetCodeData(code, LocalDateTime.now().plusMinutes(10)));
    String BodyMail = "Code" + code;
    // Envoi de mail (factice ou JavaMail)
    /// mailService.sendResetCodeEmail(email, code);
    mailService.sendSupportMail(email, SenderMail, code);
    System.out.println("Code envoyé à " + email + " : " + code);

  }

  public boolean verifyCode(String email, String code) {
    ResetCodeData data = codes.get(email);
    if (data == null || data.expiresAt.isBefore(LocalDateTime.now()))
      return false;
    return data.code.equals(code);
  }

  public void clearCode(String email) {
    codes.remove(email);
  }

  private static class ResetCodeData {
    String code;
    LocalDateTime expiresAt;

    ResetCodeData(String code, LocalDateTime expiresAt) {
      this.code = code;
      this.expiresAt = expiresAt;
    }
  }


}
