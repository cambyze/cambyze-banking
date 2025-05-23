package com.cambyze.banking.services;

import java.math.BigDecimal;

/**
 * Java bean as a reponse of the services createDeposit
 */
public class AskOverdraftResponse {

  private BigDecimal overdraftAmount;
  private String returnCode;

  public AskOverdraftResponse(BigDecimal overdraftAmount, String overdraftForbidSavingsAcc) {
    super();
    this.overdraftAmount = overdraftAmount;
    this.returnCode = overdraftForbidSavingsAcc;
  }

  // Overriding toString() method for a better description
  @Override
  public String toString() {
    return "Overdraft amount+ " + this.overdraftAmount + " + return code: " + this.returnCode;
  }

  public BigDecimal getOverdraftAmount() {
    return overdraftAmount;
  }

  public String getReturnCode() {
    return returnCode;
  }



}
