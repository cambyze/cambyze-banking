package com.cambyze.banking.services;

import java.math.BigDecimal;

/**
 * Java bean as a reponse of the services createWithdraw
 */
public class CreateWithdrawResponse {

  private BigDecimal newBalance;
  private int returnCode;

  public CreateWithdrawResponse(BigDecimal newBalance, int error) {
    super();
    this.newBalance = newBalance;
    this.returnCode = error;
  }

  public BigDecimal getNewBalance() {
    return newBalance;
  }

  public int getReturnCode() {
    return returnCode;
  }

}
