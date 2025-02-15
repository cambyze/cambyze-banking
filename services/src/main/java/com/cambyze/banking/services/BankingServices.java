package com.cambyze.banking.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cambyze.banking.persistence.services.PersistenceServices;


/**
 * Services to manage bank accounts
 */
@Service
public class BankingServices {

  private static final Logger LOGGER = LoggerFactory.getLogger(BankingServices.class);

  @Autowired
  private PersistenceServices persistenceServices;



  /**
   * Create a new bank account
   * 
   * @return its BAN
   */
  public String createNewBankAccount() {
    String ban = persistenceServices.createNewBankAccount();
    LOGGER.debug("New BAN: " + ban);
    return ban;
  }

}
