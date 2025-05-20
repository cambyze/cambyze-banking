package com.cambyze.banking.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.cambyze.banking.persistence.model.Account;
import com.cambyze.banking.persistence.model.Constants;

@SpringBootTest
class ServicesApplicationTests {

  private static final Logger LOGGER = LoggerFactory.getLogger(ServicesApplicationTests.class);

  @Autowired
  private BankingServices bankingServices;

  @Test
  void testServices() {
    LOGGER.debug("Test services");


    boolean isOk = bankingServices.isValidEmail("testmail.com");
    LOGGER.debug("mail is ok : {}", isOk);
    assertTrue(!isOk);

    String perId = bankingServices.createPerson("christof", "colomb", "ccolomb");
    assertTrue(perId == null);
    LOGGER.debug("Test value not ok: ({})", perId);


    perId = bankingServices.createPerson("christof", "colomb", "ccolomb@mail.com");
    LOGGER.debug("NEW Person Created : {}", perId);
    assertTrue(perId != null);

    String perId2;

    perId2 = bankingServices.createPerson("christ", "Jesus", "ccolomb@mail.com");
    LOGGER.debug("Mails allready use TEST: {}", perId2);
    assertTrue(perId2 == null);

    perId2 = bankingServices.createPerson("Marie", "Curie", "Mcurie@mail.com");
    LOGGER.debug("Mails Test2: {}", perId2);
    assertTrue(perId != null);

    LOGGER.debug("test mail {} is valid : {}", "ccolomb@mail.com",
        bankingServices.login("ccolomb@mail.com"));

    LOGGER.debug("TEST LOGIN");
    boolean log = bankingServices.login("ccolomb@mail.com");
    LOGGER.debug("mail exist {} : {}", "ccolomb@mail.com");
    assertTrue(log == true);

    log = bankingServices.login("test@mail.com");
    LOGGER.debug("mail d'ont exist {} : {}", "test@mail.com", log);
    assertTrue(log == false);

    String ban = bankingServices.createNewBankAccount(perId);
    LOGGER.debug("New BAN : {}", ban);
    assertTrue(ban.startsWith("CAMBYZEBANK"));

    // try to see all account for an user
    List<Account> la = bankingServices.findBanByPerson(perId);
    if (LOGGER.isDebugEnabled()) {
      StringBuilder accountDetails = new StringBuilder();
      for (Account account : la) {
        accountDetails.append("\n  - ").append(bankingServices.accountToString(account));
      }
      LOGGER.debug("Test List accounts for person ({}): ({})", perId, accountDetails);
    }
    assertTrue(la != null);
    assertTrue(la.size() > 1);

    // String ban = bankingServices.createNewBankAccount(perId);
    // LOGGER.debug("New BAN : {}", ban);
    // assertTrue(ban.startsWith("CAMBYZEBANK"));

    CreateDepositResponse createDepositResponse =
        bankingServices.createDeposit(ban, BigDecimal.valueOf(1520.25));
    LOGGER.debug("New balance after the deposit : {}",
        createDepositResponse.getNewBalance().doubleValue());
    assertTrue(createDepositResponse.getNewBalance().doubleValue() > 0.0);

    double oldBalance = createDepositResponse.getNewBalance().doubleValue();

    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(100.0));
    LOGGER.debug("New balance after the deposit : {}",
        createDepositResponse.getNewBalance().doubleValue());
    assertEquals(createDepositResponse.getNewBalance().doubleValue(), (oldBalance + 100.0));

    // Ask for overdraft
    AskOverdraftResponse overdraftAmountResp = bankingServices.askOverdraft(ban);
    LOGGER.debug("Ask Overdraft response: {} for BAN {}", overdraftAmountResp, ban);
    assertTrue(overdraftAmountResp.getOverdraftAmount().longValue() > 0);

    // Ask for savings account
    ban = bankingServices.createNewSavingsAccount(perId);
    oldBalance = 0.0;
    LOGGER.debug("New savings account BAN : {}", ban);
    assertTrue(ban.startsWith("CAMBYZEBANK"));

    // Deposit of 525.25
    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(525.25));
    LOGGER.debug("New balance after the deposit : {}",
        createDepositResponse.getNewBalance().doubleValue());
    assertEquals(createDepositResponse.getNewBalance().doubleValue(), (oldBalance + 525.25));

    // Ask for overdraft => forbidden
    overdraftAmountResp = bankingServices.askOverdraft(ban);
    LOGGER.debug("Ask Overdraft forbidden for savings then the response: {} for BAN {}",
        overdraftAmountResp.getReturnCode(), ban);
    assertEquals(Constants.OVERDRAFT_FORBID_SAVINGS_ACC, overdraftAmountResp.getReturnCode());

    // Deposit of 4500.0 => forbidden over the limit
    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(4500.0));
    LOGGER.debug("Limit reached then return code : {}", createDepositResponse.getReturnCode());
    assertEquals(Constants.SAVINGS_LIMIT_REACHED, createDepositResponse.getReturnCode());


    // new Regular Bank Account
    ban = bankingServices.createNewBankAccount(perId);
    oldBalance = 0.0;
    LOGGER.debug("New BAN : {}", ban);
    assertTrue(ban.startsWith("CAMBYZEBANK"));

    // Deposit of 525.25
    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(525.25));
    LOGGER.debug("New balance after the deposit : {}",
        createDepositResponse.getNewBalance().doubleValue());
    assertEquals(createDepositResponse.getNewBalance().doubleValue(), (oldBalance + 525.25));
    oldBalance += 525.25;

    // Withdraw of 300.25
    CreateWithdrawResponse createWithdrawResponse =
        bankingServices.createWithdraw(ban, BigDecimal.valueOf(300.25));
    LOGGER.debug("New balance after the withdraw : {}",
        createWithdrawResponse.getNewBalance().doubleValue());
    assertEquals(createWithdrawResponse.getNewBalance().doubleValue(), (oldBalance - 300.25));

    // Withdraw of 250.0 => Error
    createWithdrawResponse = bankingServices.createWithdraw(ban, BigDecimal.valueOf(250.0));
    LOGGER.debug("Withdraw forbidden: {}", createWithdrawResponse.getReturnCode());
    assertEquals(Constants.INSUFFICIENT_BALANCE, createWithdrawResponse.getReturnCode());

    MonthlyBankStatement bk = bankingServices.createMonthlyBankStatement(ban);
    LOGGER.debug("Number of operations of the bank statement for savings account : {}",
        bk.getOperations().size());
    assertEquals(2, bk.getOperations().size());


    // new Bank Account
    ban = bankingServices.createNewBankAccount(perId);
    oldBalance = 0.0;
    LOGGER.debug("New BAN : {}", ban);
    assertTrue(ban.startsWith("CAMBYZEBANK"));

    // Deposit of 500.0
    createDepositResponse = bankingServices.createDeposit(ban, BigDecimal.valueOf(500.0));
    LOGGER.debug("New balance after the deposit : {}",
        createDepositResponse.getNewBalance().doubleValue());
    assertEquals(createDepositResponse.getNewBalance().doubleValue(), (oldBalance + 500.0));
    oldBalance += 500.0;

    // Ask for overdraft
    overdraftAmountResp = bankingServices.askOverdraft(ban);
    LOGGER.debug("Ask Overdraft response: {} for BAN {}", overdraftAmountResp, ban);
    assertTrue(overdraftAmountResp.getOverdraftAmount().longValue() > 0);

    // Withdraw of 1800.0 authorized because of the 1500 overdraft amount => New balance = - 1300.00
    createWithdrawResponse = bankingServices.createWithdraw(ban, BigDecimal.valueOf(1800.0));
    LOGGER.debug("New balance after the withdraw : {}",
        createWithdrawResponse.getNewBalance().doubleValue());
    assertEquals(createWithdrawResponse.getNewBalance().doubleValue(), (oldBalance - 1800.0));

    bk = bankingServices.createMonthlyBankStatement(ban);
    LOGGER.debug("Number of operations of the bank statement for regukar bank account : {}",
        bk.getOperations().size());
    assertEquals(2, bk.getOperations().size());


    // Test a long term account
    ban = bankingServices.createNewBankAccount(perId);
    CreateDepositResponse cdr = bankingServices.createSampleOperations(ban);
    LOGGER.debug("Return code after creation of a sample of operations : {}", cdr.getReturnCode());
    assertEquals(Constants.SERVICE_OK, cdr.getReturnCode());

    // The bank statement should eliminates 5 operation on the 11 because they are too old
    bk = bankingServices.createMonthlyBankStatement(ban);
    LOGGER.debug(
        "Number of operations of the bank statement for regular bank account with 11 operations but with : {} recents",
        bk.getOperations().size());
    assertEquals(6, bk.getOperations().size());

  }
}
