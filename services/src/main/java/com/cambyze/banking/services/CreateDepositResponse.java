package com.cambyze.banking.services;

import java.math.BigDecimal;

/**
 * Java bean as a reponse of the services createDeposit
 */
public class CreateDepositResponse {

  private BigDecimal newBalance;
  private String returnCode;

  public CreateDepositResponse(BigDecimal newBalance, String savingsLimitReached) {
    super();
    this.newBalance = newBalance;
    this.returnCode = savingsLimitReached;
  }

  public BigDecimal getNewBalance() {
    return newBalance;
  }

  public String getReturnCode() {
    return returnCode;
  }

}
