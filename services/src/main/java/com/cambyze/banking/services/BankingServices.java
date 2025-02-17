package com.cambyze.banking.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cambyze.banking.persistence.model.Account;
import com.cambyze.banking.persistence.model.Constants;
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

  /**
   * Create a deposit on a bank account for operation date = today
   * 
   * @param ban the Bank Account Number
   * @param amount the amount of the deposit
   * @return the new balance else null
   */
  public BigDecimal createDeposit(String ban, BigDecimal amount) {
    Account ba = persistenceServices.findBankAccountByBAN(ban);
    if (ba != null && !ba.getBankAccountNumber().isEmpty()) {
      persistenceServices.createNewBankingOperation(ba, LocalDate.now(),
          Constants.OPERATION_TYPE_DEPOSIT, amount);
      LOGGER.debug("The deposit is ok for the BAN: " + ban + " and the new balance is "
          + ba.getBalanceAmount());
      ba = persistenceServices.findBankAccountByBAN(ban);
      return ba.getBalanceAmount();
    } else {
      LOGGER.error("The bank account does not exist for the BAN: " + ban);
      return null;
    }
  }

}
