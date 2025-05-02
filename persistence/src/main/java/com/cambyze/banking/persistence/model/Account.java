package com.cambyze.banking.persistence.model;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Entity for the bank account
 */


@Document(collection = "accounts")
public class Account {
  @Id
  private String accountId;
  private String bankAccountNumber;
  private String accountType;
  private BigDecimal balanceAmount;
  private BigDecimal overdraftAmount;

  @DBRef
  private List<Operation> operations;

  /**
   * Create a new bank account as a everyday bank account
   */

  public Account() {
    super();
    this.accountType = Constants.ACCOUNT_TYPE_BANK;
    // The BAN "bankAccountNumber" is calculated by the service
    // PersistenceServices.createNewBankAccount
    this.balanceAmount = BigDecimal.valueOf(0.0);
    this.overdraftAmount = BigDecimal.valueOf(0.0);
    this.operations = null;
  }

  // Overriding toString() method for a better description
  @Override
  public String toString() {
    return this.accountId + " : " + this.bankAccountNumber + " + " + this.accountType + " + "
        + this.balanceAmount + " + " + this.overdraftAmount;
  }


  public String getId() {
    return accountId;
  }


  public String getAccountId() {
    return accountId;
  }


  public void setAccountId(String accountId) {
    this.accountId = accountId;
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


  public List<Operation> getOperations() {
    return operations;
  }


  public void setOperations(List<Operation> operations) {
    this.operations = operations;
  }

  public List<Operation> getBankingOperations() {
    return this.operations;
  }

}
