package com.cambyze.banking.services;

import java.math.BigDecimal;

/**
 * Java bean as a reponse of the services createDeposit
 */
public class AskOverdraftResponse {

  private BigDecimal overdraftAmount;
  private int returnCode;

  public AskOverdraftResponse(BigDecimal overdraftAmount, int returnCode) {
    super();
    this.overdraftAmount = overdraftAmount;
    this.returnCode = returnCode;
  }

  // Overriding toString() method for a better description
  @Override
  public String toString() {
    String desc =
        "Overdraft amount+ " + this.overdraftAmount + " + return code: " + this.returnCode;
    return desc;
  }

  public BigDecimal getOverdraftAmount() {
    return overdraftAmount;
  }

  public int getReturnCode() {
    return returnCode;
  }



}
