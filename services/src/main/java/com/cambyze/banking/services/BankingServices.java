package com.cambyze.banking.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.cambyze.banking.persistence.model.Account;
import com.cambyze.banking.persistence.model.Constants;
import com.cambyze.banking.persistence.model.Operation;
import com.cambyze.banking.persistence.model.Person;
import com.cambyze.banking.persistence.services.PersistenceServices;
import com.cambyze.banking.services.tools.MathTools;



/**
 * Services to manage bank accounts
 */
@Service
public class BankingServices {

  private static final Logger LOGGER = LoggerFactory.getLogger(BankingServices.class);

  private PersistenceServices persistenceServices;

  public BankingServices(PersistenceServices persistenceServices) {
    this.persistenceServices = persistenceServices;
  }

  /**
   * Create a new bank account
   * 
   * @return its BAN
   */
  public String createNewBankAccount(String personId) {
    String ban = persistenceServices.createNewBankAccount(personId);
    LOGGER.debug("New BAN: {}", ban);
    return ban;
  }

  /**
   * Create a deposit on a bank account for operation date = today
   * 
   * @param ban the Bank Account Number
   * @param amount the amount of the deposit
   * @return the new balance else null and the return code
   *         <p>
   *         - CreateDepositResponse.newBalance
   *         </p>
   *         <p>
   *         - CreateDepositResponse.returnCode
   *         </p>
   */
  public CreateDepositResponse createDeposit(String ban, BigDecimal amount) {
    Account ba = persistenceServices.findBankAccountByBAN(ban);
    LOGGER.debug(" ban : {}, amount: {}", ban, amount);
    if (ba != null && !ba.getBankAccountNumber().isEmpty()) {
      // Round to two decimals
      amount = BigDecimal.valueOf(MathTools.roundWithDecimals(amount.doubleValue(), 2));
      double oldBalance = ba.getBalanceAmount().doubleValue();
      double newBalance = oldBalance + amount.doubleValue();
      LOGGER.debug("amount: {}, old: {}, newBalance: {}", amount, oldBalance, newBalance);
      if (ba.getAccountType().equals(Constants.ACCOUNT_TYPE_SAVINGS)
          && newBalance > Constants.SAVINGS_ACCOUNT_LIMIT) {
        LOGGER.error("The limit of the savings account is reached for the BAN: {}", ban);
        return new CreateDepositResponse(null, Constants.SAVINGS_LIMIT_REACHED);

      }
      String opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now(),
          Constants.OPERATION_TYPE_DEPOSIT, amount);
      LOGGER.debug("createNewBankingOperation opId/returnCode: {}", opId);
      if (!opId.startsWith("-")) {
        LOGGER.debug("The deposit is ok for the BAN: {} and the new balance is {}", ban,
            ba.getBalanceAmount());
        ba = persistenceServices.findBankAccountByBAN(ban);
        return new CreateDepositResponse(ba.getBalanceAmount(), Constants.SERVICE_OK);
      } else {
        return new CreateDepositResponse(null, opId);
      } // condition on opid
    } else {
      LOGGER.error(Constants.ACCOUNT_NOT_EXIST, ban);
      return new CreateDepositResponse(null, Constants.BANK_ACCOUNT_NOT_EXISTS);
    } // condition on ba
  }


  /**
   * Request for an overdraft
   * 
   * @param ban the Bank Account Number
   * @return the authorized overdraft amount else null and the return code within the object
   *         AskOverdraftResponse
   */
  public AskOverdraftResponse askOverdraft(String ban) {
    Account ba = persistenceServices.findBankAccountByBAN(ban);
    if (ba != null && !ba.getBankAccountNumber().isEmpty()) {
      if (ba.getAccountType().equals(Constants.ACCOUNT_TYPE_SAVINGS)) {
        LOGGER.error("Overdraft forbidden for saving accounts");
        return new AskOverdraftResponse(null, Constants.OVERDRAFT_FORBID_SAVINGS_ACC);
      }

      persistenceServices.createOverdraft(ba, BigDecimal.valueOf(Constants.OVERDRAFT_AMOUNT));
      LOGGER.debug("Overdraft OK: {}", ba.getOverdraftAmount());
      return new AskOverdraftResponse(ba.getOverdraftAmount(), Constants.SERVICE_OK);

    } else {
      LOGGER.error(Constants.ACCOUNT_NOT_EXIST, ban);
      return new AskOverdraftResponse(null, Constants.BANK_ACCOUNT_NOT_EXISTS);
    } // condition on ba
  }

  /**
   * Request for savings account
   * 
   * @param ban the Bank Account Number
   * @return the return code
   */
  public String createNewSavingsAccount(String personId) {
    String ban = persistenceServices.createSavingsAccount(personId);
    LOGGER.debug("New BAN for the savings account: {}", ban);
    return ban;
  }

  public CreateWithdrawResponse createWithdraw(String ban, BigDecimal amount) {
    Account ba = persistenceServices.findBankAccountByBAN(ban);
    if (ba != null && !ba.getBankAccountNumber().isEmpty() && ba.getBalanceAmount() != null
        && ba.getOverdraftAmount() != null) {
      // Round to two decimals
      amount = BigDecimal.valueOf(MathTools.roundWithDecimals(amount.doubleValue(), 2));
      double newCalculatedBalance = ba.getBalanceAmount().doubleValue()
          + ba.getOverdraftAmount().doubleValue() - amount.doubleValue();
      if (newCalculatedBalance < 0.0) {
        LOGGER.error("Not enough money available for the withdraw for the BAN: {}", ban);
        return new CreateWithdrawResponse(null, Constants.INSUFFICIENT_BALANCE);

      } else {
        String opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now(),
            Constants.OPERATION_TYPE_WITHDRAW, amount);

        if (!opId.isEmpty()) {
          LOGGER.debug("The withdraw is ok for the BAN: {} and the new balance is {}", ban,
              ba.getBalanceAmount());
          ba = persistenceServices.findBankAccountByBAN(ban);
          return new CreateWithdrawResponse(ba.getBalanceAmount(), Constants.SERVICE_OK);
        } else {
          return new CreateWithdrawResponse(null, opId);
        } // condition on opid
      } // condition on newCalculatedBalance
    } else {
      LOGGER.error(Constants.ACCOUNT_NOT_EXIST, ban);
      return new CreateWithdrawResponse(null, Constants.BANK_ACCOUNT_NOT_EXISTS);
    } // condition on ba
  }


  public MonthlyBankStatement createMonthlyBankStatement(String ban) {

    // Add all the operations between now and one month before
    LocalDate limDate = LocalDate.now().minusMonths(1);
    List<MonthlyBankStatementOperation> bkops = new ArrayList<>();
    List<Operation> ops = persistenceServices.findBankingOperationsOfBankAccount(ban);
    if (ops != null) {
      LOGGER.debug("Number of operations before: {}", ops.size());
      for (Operation op : ops) {
        if (op.getOperationDate().isAfter(limDate)) {
          bkops.add(new MonthlyBankStatementOperation(op));
        }
      }
      LOGGER.debug("Number of operations after: {}", bkops.size());
    }

    // Sort the list by date
    Comparator<MonthlyBankStatementOperation> reverseComparator =
        (m1, m2) -> m2.getOperationDate().compareTo(m1.getOperationDate());
    Collections.sort(bkops, reverseComparator);

    LOGGER.debug("List of bank statement operations: {}", bkops);

    // Find information about the bank account
    Account ba = persistenceServices.findBankAccountByBAN(ban);
    if (ba != null && !ba.getBankAccountNumber().isEmpty()) {
      MonthlyBankStatement bk = new MonthlyBankStatement(ba, bkops);
      LOGGER.debug("Generated bank statement : {}", bk);
      return bk;
    } else {
      LOGGER.error("Error when searching the BAN: {}", ban);
      return null;
    }
  }

  /**
   * Create deposits and withdraw on a bank account for several dates as a sample
   * 
   * @param ban the Bank Account Number
   * @return the new balance else null and the return code
   *         <p>
   *         - CreateDepositResponse.newBalance
   *         </p>
   *         <p>
   *         - CreateDepositResponse.returnCode
   *         </p>
   */
  public CreateDepositResponse createSampleOperations(String ban) {
    Account ba = persistenceServices.findBankAccountByBAN(ban);
    if (ba != null && !ba.getBankAccountNumber().isEmpty()) {

      // Create several operations for Junit Test of the bank statement


      persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusYears(1),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(150.25));

      persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusMonths(10),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(2500.50));

      persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusMonths(9),
          Constants.OPERATION_TYPE_WITHDRAW, BigDecimal.valueOf(18.25));

      persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusMonths(4),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(1505.0));

      persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(40),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(100.0));

      persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(25),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(1510.42));

      persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(10),
          Constants.OPERATION_TYPE_WITHDRAW, BigDecimal.valueOf(100.25));

      persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(10),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(150.25));

      persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(5),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(45.0));

      persistenceServices.createNewBankingOperation(ba, LocalDate.now(),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(352.14));

      String opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now(),
          Constants.OPERATION_TYPE_WITHDRAW, BigDecimal.valueOf(1150.25));

      if (!opId.isEmpty()) {
        LOGGER.debug("The deposit is ok for the BAN: {} and the new balance is {}", ban,
            ba.getBalanceAmount());
        ba = persistenceServices.findBankAccountByBAN(ban);
        return new CreateDepositResponse(ba.getBalanceAmount(), Constants.SERVICE_OK);
      } else {
        return new CreateDepositResponse(null, opId);
      } // condition on opid
    } else {
      LOGGER.error("The bank account does not exist for the BAN: {}", ban);
      return new CreateDepositResponse(null, Constants.BANK_ACCOUNT_NOT_EXISTS);
    } // condition on ba
  }


  /**
   * check if string is a mail
   * 
   * @param email
   * @return boolean
   */
  public static boolean isValidEmail(String email) {
    String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    return Pattern.matches(emailRegex, email);
  }

  /**
   * Create a new user (person)
   * 
   * @param name
   * @param firstName
   * @param email
   * @return
   */

  public String createPerson(String name, String firstName, String email) {
    if (name == null && firstName == null && email == null) {
      LOGGER.debug("all fields must be completed, and email valdid");
      return null;
    }
    if (!isValidEmail(email)) {
      LOGGER.debug("EMAIL IS NOT VALIDE");
      return null;
    }
    List<Person> pers = persistenceServices.findPersonByMail(email);
    if (pers != null && !pers.isEmpty()) {
      LOGGER.debug("this mail is already in use: {}  {}  {}", email, name, firstName);
      return null;
    }
    String per = persistenceServices.createNewPerson(name, firstName, email);
    LOGGER.debug("new Person id : ({})", per);
    String ban = this.createNewBankAccount(per);
    LOGGER.debug("new bank account created ban: {}", ban);
    return per;
  }


  /**
   * function for return a string to create a better display
   * 
   * @param ba
   * @return String
   */
  public String accountToString(Account ba) {
    Person per = persistenceServices.findPersonByid(ba.getPersonId());
    if (per != null && per.getPersonId() != null) {
      return "Client: " + per.getPersonId() + " BAN: " + ba.getBankAccountNumber() + " / "
          + ba.getAccountType() + " / " + ba.getBalanceAmount() + " / " + ba.getOverdraftAmount();
    }
    return "****** ERROR ********** : " + ba.getPersonId();
  }


  /**
   * return a list of accounts for a person
   * 
   * @param the user id
   * @return list of Account
   * 
   */
  public List<Account> findBanByPerson(String personId) {
    if (personId == null || personId.isEmpty()) {
      LOGGER.debug("LIST ACCOUNT IS EMPTY");
      return Collections.emptyList();
    }
    List<Account> lAccount = persistenceServices.findBankAccountsByPerson(personId);
    if (lAccount.isEmpty()) {
      LOGGER.debug("Find Account List is empty");
      return Collections.emptyList();
    }
    if (LOGGER.isDebugEnabled()) {
      StringBuilder accountDetails = new StringBuilder();
      for (Account account : lAccount) {
        accountDetails.append("\n  - ").append(accountToString(account));
      }
      LOGGER.debug("List accounts for person ({}): ({})", personId, accountDetails);
    }
    return lAccount;
  }


  /**
   * check if the mail in parameter exist
   * 
   * @param mail
   * @return Boolean
   */

  public boolean login(String mail) {
    if (mail == null) {
      LOGGER.error("connection fails, no mail, enter your mail to connect");
      return false;
    }
    List<Person> pers = persistenceServices.findPersonByMail(mail);
    if (pers == null || pers.size() < 1) {
      LOGGER.error("connection error mail is invalid 1: {} per: {}", mail, pers);
      return false;
    }
    LOGGER.debug("boolean ::: [{}] [{}]", pers, pers.get(0).getEmail());
    if (!pers.get(0).getEmail().equals(mail)) {
      LOGGER.error("connection error mail is invalid 2: {} != {}", mail, pers.get(0).getEmail());
      return false;
    }
    LOGGER.debug("Connected");
    return true;
  }

}

