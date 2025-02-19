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

    // Ask for savings account
    ban = bankingServices.createNewSavingsAccount();
    oldBalance = 0.0;
    LOGGER.debug("=========== New savings account BAN : " + ban);
    assertTrue(ban.startsWith("CAMBYZEBANK"));

    // Deposit of 525.25
    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(525.25));
    LOGGER.debug(
        "New balance after the deposit : " + createDepositResponse.getNewBalance().doubleValue());
    assertTrue(createDepositResponse.getNewBalance().doubleValue() == (oldBalance + 525.25));
    oldBalance += 525.25;

    // Ask for overdraft => forbidden
    overdraftAmountResp = bankingServices.askOverdraft(ban);
    LOGGER.debug("Ask Overdraft forbidden for savings then the response: "
        + overdraftAmountResp.getReturnCode() + " for BAN " + ban);
    assertTrue(overdraftAmountResp.getReturnCode() == Constants.OVERDRAFT_FORBID_SAVINGS_ACC);

    // Deposit of 4500.0 => forbidden over the limit
    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(4500.0));
    LOGGER.debug("Limit reached then return code : " + createDepositResponse.getReturnCode());
    assertTrue(createDepositResponse.getReturnCode() == Constants.SAVINGS_LIMIT_REACHED);


    // new Regular Bank Account
    ban = bankingServices.createNewBankAccount();
    oldBalance = 0.0;
    LOGGER.debug("New BAN : " + ban);
    assertTrue(ban.startsWith("CAMBYZEBANK"));

    // Deposit of 525.25
    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(525.25));
    LOGGER.debug(
        "New balance after the deposit : " + createDepositResponse.getNewBalance().doubleValue());
    assertTrue(createDepositResponse.getNewBalance().doubleValue() == (oldBalance + 525.25));
    oldBalance += 525.25;

    // Withdraw of 300.25
    CreateWithdrawResponse createWithdrawResponse =
        bankingServices.createWithdraw(ban, BigDecimal.valueOf(300.25));
    LOGGER.debug(
        "New balance after the withdraw : " + createWithdrawResponse.getNewBalance().doubleValue());
    assertTrue(createWithdrawResponse.getNewBalance().doubleValue() == (oldBalance - 300.25));
    oldBalance -= 300.25;

    // Withdraw of 250.0 => Error
    createWithdrawResponse = bankingServices.createWithdraw(ban, BigDecimal.valueOf(250.0));
    LOGGER.debug("Withdraw forbidden: " + createWithdrawResponse.getReturnCode());
    assertTrue(createWithdrawResponse.getReturnCode() == Constants.INSUFFICIENT_BALANCE);

    MonthlyBankStatement bk = bankingServices.createMonthlyBankStatement(ban);
    LOGGER.debug("Number of operations of the bank statement for savings account : "
        + bk.getOperations().size());
    assertTrue(bk.getOperations().size() == 2);


    // new Bank Account
    ban = bankingServices.createNewBankAccount();
    oldBalance = 0.0;
    LOGGER.debug("New BAN : " + ban);
    assertTrue(ban.startsWith("CAMBYZEBANK"));

    // Deposit of 500.0
    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(500.0));
    LOGGER.debug(
        "New balance after the deposit : " + createDepositResponse.getNewBalance().doubleValue());
    assertTrue(createDepositResponse.getNewBalance().doubleValue() == (oldBalance + 500.0));
    oldBalance += 500.0;

    // Ask for overdraft
    overdraftAmountResp = bankingServices.askOverdraft(ban);
    LOGGER.debug("Ask Overdraft response: " + overdraftAmountResp + " for BAN " + ban);
    assertTrue(overdraftAmountResp.getOverdraftAmount().longValue() > 0);

    // Withdraw of 1800.0 authorized because of the 1500 overdraft amount => New balance = - 1300.00
    createWithdrawResponse = bankingServices.createWithdraw(ban, BigDecimal.valueOf(1800.0));
    LOGGER.debug(
        "New balance after the withdraw : " + createWithdrawResponse.getNewBalance().doubleValue());
    assertTrue(createWithdrawResponse.getNewBalance().doubleValue() == (oldBalance - 1800.0));
    oldBalance -= 1800.0;

    bk = bankingServices.createMonthlyBankStatement(ban);
    LOGGER.debug("Number of operations of the bank statement for regukar bank account : "
        + bk.getOperations().size());
    assertTrue(bk.getOperations().size() == 2);


    // Test a long term account
    ban = bankingServices.createNewBankAccount();
    CreateDepositResponse cdr = bankingServices.createSampleOperations(ban);
    LOGGER.debug("Return code after creation of a sample of operations :" + cdr.getReturnCode());
    assertTrue(cdr.getReturnCode() == Constants.SERVICE_OK);

    // The bank statement should eliminates 5 operation on the 11 because they are too old
    bk = bankingServices.createMonthlyBankStatement(ban);
    LOGGER.debug(
        "Number of operations of the bank statement for regular bank account with 11 operations but with : "
            + bk.getOperations().size() + " recents");
    assertTrue(bk.getOperations().size() == 6);

  }
}
