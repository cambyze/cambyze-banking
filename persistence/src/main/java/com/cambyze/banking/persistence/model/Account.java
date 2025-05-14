package com.cambyze.banking.persistence.model;

import java.math.BigDecimal;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Entity for the bank account
 */

@Document(collection = "accounts")
public class Account {
  @Id
  private String accountId;
  // foreign key to Person
  private String personId;
  private String bankAccountNumber;
  private String accountType;
  private BigDecimal balanceAmount;
  private BigDecimal overdraftAmount;

  /**
   * Create a new bank account as a everyday bank account
   */

  public Account(String personId) {
    super();
    this.accountType = Constants.ACCOUNT_TYPE_BANK;
    // The BAN "bankAccountNumber" is calculated by the service
    // PersistenceServices.createNewBankAccount
    this.balanceAmount = BigDecimal.valueOf(0.0);
    this.overdraftAmount = BigDecimal.valueOf(0.0);
    this.personId = personId;
  }

  public String getAccountId() {
    return accountId;
  }

  public void setAccountId(String accountId) {
    this.accountId = accountId;
  }

  public String getId() {
    return this.getAccountId();
  }

  public void setId(String id) {
    this.setAccountId(id);
  }

  public String getPersonId() {
    return personId;
  }

  public void setPersonId(String personId) {
    this.personId = personId;
  }

  public String getBankAccountNumber() {
    return bankAccountNumber;
  }

  public void setBankAccountNumber(String bankAccountNumber) {
    this.bankAccountNumber = bankAccountNumber;
  }

  public String getAccountType() {
    return accountType;
  }

  public void setAccountType(String accountType) {
    this.accountType = accountType;
  }

  public BigDecimal getBalanceAmount() {
    return balanceAmount;
  }

  public void setBalanceAmount(BigDecimal balanceAmount) {
    this.balanceAmount = balanceAmount;
  }

  public BigDecimal getOverdraftAmount() {
    return overdraftAmount;
  }

  public void setOverdraftAmount(BigDecimal overdraftAmount) {
    this.overdraftAmount = overdraftAmount;
  }

}
