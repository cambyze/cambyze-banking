package com.cambyze.banking.services;

import java.math.BigDecimal;

/**
 * Java bean as a reponse of the services createWithdraw
 */
public class CreateWithdrawResponse {

  private BigDecimal newBalance;
  private String returnCode;

  public CreateWithdrawResponse(BigDecimal newBalance, String opId) {
    super();
    this.newBalance = newBalance;
    this.returnCode = opId;
  }

  public BigDecimal getNewBalance() {
    return newBalance;
  }

  public String getReturnCode() {
    return returnCode;
  }

}
