package com.cambyze.banking.persistence;

import static org.junit.jupiter.api.Assertions.assertTrue;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.cambyze.banking.persistence.dao.BankAccountRepository;
import com.cambyze.banking.persistence.model.BankAccount;
import com.cambyze.banking.persistence.model.Constants;

@SpringBootTest
class PersistenceApplicationTests {

  private static final Logger LOGGER = LoggerFactory.getLogger(PersistenceApplicationTests.class);

  @Autowired
  private BankAccountRepository bankAccountRepository;

  @Test
  void contextLoads() {
    LOGGER.debug("contextLoads");
  }


  @Test
  void testDao() {
    LOGGER.debug("Test DAO");

    LOGGER.debug("Find a non existing BAN");
    BankAccount ba = bankAccountRepository.findByBankAccountNumber("DOES NOT EXIST");
    if (ba == null) {
      LOGGER.debug("The BAN does not exist, it's OK");
    } else {
      LOGGER.debug("The BAN exists !!!" + ba.getId());
    }
    assertTrue(ba == null);

    ba = new BankAccount();
    bankAccountRepository.save(ba);
    LOGGER.debug("New BAN:" + ba.getBankAccountNumber());
    LOGGER.debug("New BA full content:" + ba.toString());
    // the creation of the BAN is done post insertion to have the id generated by Hibernate then we
    // have to save it twice - no time to find a better solution
    // TODO : find a better solution
    bankAccountRepository.save(ba);

    // id > 0 & balance = 0 & no overdraft & every day bank account
    assertTrue(ba.getId() > 0);
    assertTrue(ba.getBankAccountNumber().equals("CAMBYZEBANK-" + ba.getId()));
    assertTrue(ba.getBalanceAmount().equals(BigDecimal.valueOf(0.0)));
    assertTrue(ba.getOverdraftAmount().equals(BigDecimal.valueOf(0.0)));
    assertTrue(ba.getAccountType() == Constants.ACCOUNT_TYPE_BANK);


    // Test the findByBankAccountNumber method
    BankAccount ba2 = bankAccountRepository.findByBankAccountNumber(ba.getBankAccountNumber());
    LOGGER.debug("Verify the found BA full content:" + ba2.toString());
    // Both objects must be equal
    assertTrue(ba2.getId().equals(ba.getId()));
    assertTrue(ba2.getBankAccountNumber().equals(ba.getBankAccountNumber()));
    assertTrue(ba2.getAccountType() == ba.getAccountType());
  }


}
