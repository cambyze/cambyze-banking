package com.cambyze.banking.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.cambyze.banking.persistence.model.BankAccount;


/**
 * Services to manage bank accounts
 */
public class BankingServices {

  private static final Logger LOGGER = LoggerFactory.getLogger(BankingServices.class);


  /**
   * Create a new bank account
   * 
   * @return its BAN
   */
  public static String createNewBankAccount() {
    BankAccount ba = new BankAccount();
    LOGGER.debug("New Bank account created; ");
    return "";
  }

}
