package com.cambyze.banking.persistence.model;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.util.Locale;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * JPA entity for the banking operations
 */
@Entity
@Table(name = "operation")
public class Operation {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long operationId;
  @ManyToOne
  @JoinColumn(name = "account_id", nullable = false)
  private Account account;
  private LocalDate operationDate;
  private int operationType;
  private BigDecimal amount;


  private static final Locale LOCALE = new Locale("en", "US");
  private static final NumberFormat CURRENCY_FORMATTER = NumberFormat.getCurrencyInstance(LOCALE);


  // Overriding toString() method for a better description
  @Override
  public String toString() {
    return this.operationId + " : " + this.account.getBankAccountNumber() + " / "
        + this.operationType + " / " + this.operationDate + " / "
        + CURRENCY_FORMATTER.format(this.amount);
  }

  public Operation() {
    super();
  }

  public Operation(Account bankAccount, LocalDate operationDate, int operationType,
      BigDecimal amount) {
    super();
    this.account = bankAccount;
    this.operationDate = operationDate;
    this.operationType = operationType;
    this.amount = amount;
  }

  public Long getId() {
    return operationId;
  }

  public Long getBankingOperationId() {
    return operationId;
  }


  public Account getBankAccount() {
    return account;
  }

  public LocalDate getOperationDate() {
    return operationDate;
  }

  public int getOperationType() {
    return operationType;
  }

  public BigDecimal getAmount() {
    return amount;
  }

}
