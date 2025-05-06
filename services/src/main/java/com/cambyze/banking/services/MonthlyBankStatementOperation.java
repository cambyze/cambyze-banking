package com.cambyze.banking.services;

import com.cambyze.banking.persistence.model.Constants;
import com.cambyze.banking.persistence.model.Operation;

/**
 * Java bean as a bean for the operations of the bank statement
 */
public class MonthlyBankStatementOperation {

  private String operationDate;
  private String operationType;
  private double amount;


  public MonthlyBankStatementOperation(Operation op) {
    super();
    this.operationDate = op.getOperationDate().toString();
    if (Constants.OPERATION_TYPE_DEPOSIT.equals(op.getOperationType())) {
      this.operationType = "Deposit";
      this.amount = op.getAmount().doubleValue();
    } else {
      this.operationType = "Withdraw";
      this.amount = op.getAmount().doubleValue() * -1.0;
    }

  }


  // Overriding toString() method for a better description
  @Override
  public String toString() {
    return "Operation date: " + this.operationDate + " + type: " + this.operationType
        + " + amount: " + this.amount;
  }


  public String getOperationDate() {
    return operationDate;
  }

  public String getOperationType() {
    return operationType;
  }

  public double getAmount() {
    return amount;
  }

}
