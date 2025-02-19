package com.cambyze.banking.services;

import java.util.List;
import com.cambyze.banking.persistence.model.Account;
import com.cambyze.banking.persistence.model.Constants;

/**
 * Java bean as a reponse of the services createDeposit
 */
public class MonthlyBankStatement {

  private String bankAccountNumber;
  private String accountType;
  private double balanceAmount;
  private double overdraftAmount;
  private List<MonthlyBankStatementOperation> operations;



  public MonthlyBankStatement(Account ba, List<MonthlyBankStatementOperation> operations) {
    super();
    this.bankAccountNumber = ba.getBankAccountNumber();
    if (ba.getAccountType() == Constants.ACCOUNT_TYPE_BANK) {
      this.accountType = "Regular bank account";
    } else {
      this.accountType = "Savings account";
    }
    this.balanceAmount = ba.getBalanceAmount().doubleValue();
    this.overdraftAmount = ba.getOverdraftAmount().doubleValue();
    this.operations = operations;
  }



  // Overriding toString() method for a better description
  @Override
  public String toString() {
    String desc = "Statement for the BAN: " + this.bankAccountNumber + " + type: "
        + this.accountType + " + balance" + this.balanceAmount + " + overdraft : "
        + this.overdraftAmount + " + operations: " + this.operations;
    return desc;
  }



  public String getBankAccountNumber() {
    return bankAccountNumber;
  }

  public String getAccountType() {
    return accountType;
  }


  public double getBalanceAmount() {
    return balanceAmount;
  }

  public double getOverdraftAmount() {
    return overdraftAmount;
  }


  public List<MonthlyBankStatementOperation> getOperations() {
    return operations;
  }

}
