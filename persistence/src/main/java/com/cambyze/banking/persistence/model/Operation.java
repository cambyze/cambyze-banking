package com.cambyze.banking.persistence.model;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.util.Locale;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


/**
 * Entity for the banking operations
 */
@Document(collection = "operations")
public class Operation {
  @Id
  private String operationId;
  // foreign key to Account
  private String accountId;
  private LocalDate operationDate;
  private String operationType;
  private BigDecimal amount;

  private static final Locale LOCALE = new Locale("en", "US");
  private static final NumberFormat CURRENCY_FORMATTER = NumberFormat.getCurrencyInstance(LOCALE);


  // Overriding toString() method for a better description
  @Override
  public String toString() {
    return this.operationId + " : " + this.accountId + " / " + this.operationType + " / "
        + this.operationDate + " / " + CURRENCY_FORMATTER.format(this.amount);
  }

  public Operation(String accountId, LocalDate operationDate, String operationType,
      BigDecimal amount) {
    super();
    this.accountId = accountId;
    this.operationDate = operationDate;
    this.operationType = operationType;
    this.amount = amount;
  }

  public String getId() {

    return operationId;
  }

  public void setOperationId(String operationId) {
    this.operationId = operationId;
  }

  public LocalDate getOperationDate() {
    return operationDate;
  }

  public void setOperationDate(LocalDate operationDate) {
    this.operationDate = operationDate;
  }

  public String getOperationType() {
    return operationType;
  }

  public void setOperationType(String operationType) {
    this.operationType = operationType;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public String getAccountId() {
    return accountId;
  }

  public void setAccountId(String accountId) {
    this.accountId = accountId;
  }


}
