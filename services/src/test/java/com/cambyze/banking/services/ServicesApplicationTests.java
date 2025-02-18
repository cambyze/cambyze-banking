package com.cambyze.banking.services;

import static org.junit.jupiter.api.Assertions.assertTrue;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.cambyze.banking.persistence.model.Constants;

@SpringBootTest
class ServicesApplicationTests {

  private static final Logger LOGGER = LoggerFactory.getLogger(ServicesApplicationTests.class);

  @Autowired
  private BankingServices bankingServices;

  @Test
  void testServices() {
    LOGGER.debug("Test services");
    String ban = bankingServices.createNewBankAccount();
    LOGGER.debug("New BAN : " + ban);
    assertTrue(ban.startsWith("CAMBYZEBANK"));

    CreateDepositResponse createDepositResponse =
        bankingServices.createDeposit(ban, BigDecimal.valueOf(1520.25));
    LOGGER.debug(
        "New balance after the deposit : " + createDepositResponse.getNewBalance().doubleValue());
    assertTrue(createDepositResponse.getNewBalance().doubleValue() > 0.0);

    double oldBalance = createDepositResponse.getNewBalance().doubleValue();

    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(100.0));
    LOGGER.debug(
        "New balance after the deposit : " + createDepositResponse.getNewBalance().doubleValue());
    assertTrue(createDepositResponse.getNewBalance().doubleValue() == (oldBalance + 100.0));

    // Ask for overdraft
    AskOverdraftResponse overdraftAmountResp = bankingServices.askOverdraft(ban);
    LOGGER.debug("Ask Overdraft response: " + overdraftAmountResp + " for BAN " + ban);
    assertTrue(overdraftAmountResp.getOverdraftAmount().longValue() > 0);

    // Ask for savings account - forbidden because there is an overdraft amount
    int returnCode = bankingServices.AskSavingsAccount(ban);
    LOGGER.debug("Transformation forbidden: " + returnCode);
    assertTrue(returnCode == Constants.OVERDRAFT_FORBID_SAVINGS_ACC);

    // new Bank Account
    ban = bankingServices.createNewBankAccount();
    LOGGER.debug("New BAN : " + ban);
    assertTrue(ban.startsWith("CAMBYZEBANK"));
    // Ask for savings account - forbidden because there is an overdraft amount
    returnCode = bankingServices.AskSavingsAccount(ban);
    LOGGER.debug("Transformation OK " + returnCode);
    assertTrue(returnCode == Constants.SERVICE_OK);


  }
}
