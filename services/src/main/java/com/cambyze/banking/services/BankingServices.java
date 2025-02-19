package com.cambyze.banking.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cambyze.banking.persistence.model.Account;
import com.cambyze.banking.persistence.model.Constants;
import com.cambyze.banking.persistence.model.Operation;
import com.cambyze.banking.persistence.services.PersistenceServices;
import com.cambyze.banking.services.tools.MathTools;



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
    if (ba != null && !ba.getBankAccountNumber().isEmpty()) {
      // Round to two decimals
      amount = BigDecimal.valueOf(MathTools.roundWithDecimals(amount.doubleValue(), 2));
      double oldBalance = ba.getBalanceAmount().doubleValue();
      double newBalance = oldBalance + amount.doubleValue();
      if (ba.getAccountType() == Constants.ACCOUNT_TYPE_SAVINGS
          && newBalance > Constants.SAVINGS_ACCOUNT_LIMIT) {
        LOGGER.error("The limit of the savings account is reached for the BAN: " + ban);
        return new CreateDepositResponse(null, Constants.SAVINGS_LIMIT_REACHED);

      }
      long opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now(),
          Constants.OPERATION_TYPE_DEPOSIT, amount);
      if (opId > 0) {
        LOGGER.debug("The deposit is ok for the BAN: " + ban + " and the new balance is "
            + ba.getBalanceAmount());
        ba = persistenceServices.findBankAccountByBAN(ban);
        return new CreateDepositResponse(ba.getBalanceAmount(), Constants.SERVICE_OK);
      } else {
        int intOpId = (int) opId;
        return new CreateDepositResponse(null, intOpId);
      } // condition on opid
    } else {
      LOGGER.error("The bank account does not exist for the BAN: " + ban);
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
      if (ba.getAccountType() == Constants.ACCOUNT_TYPE_SAVINGS) {
        LOGGER.error("Overdraft forbidden for saving accounts");
        return new AskOverdraftResponse(null, Constants.OVERDRAFT_FORBID_SAVINGS_ACC);
      }

      persistenceServices.createOverdraft(ba, BigDecimal.valueOf(Constants.OVERDRAFT_AMOUNT));
      LOGGER.debug("Overdraft OK: " + ba.getOverdraftAmount());
      return new AskOverdraftResponse(ba.getOverdraftAmount(), Constants.SERVICE_OK);

    } else {
      LOGGER.error("The bank account does not exist for the BAN: " + ban);
      return new AskOverdraftResponse(null, Constants.BANK_ACCOUNT_NOT_EXISTS);
    } // condition on ba
  }

  /**
   * Request for savings account
   * 
   * @param ban the Bank Account Number
   * @return the return code
   */
  public String createNewSavingsAccount() {
    String ban = persistenceServices.createSavingsAccount();
    LOGGER.debug("New BAN for the savings account: " + ban);
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
        LOGGER.error("Not enough money available for the withdraw for the BAN: " + ban);
        return new CreateWithdrawResponse(null, Constants.INSUFFICIENT_BALANCE);

      } else {
        long opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now(),
            Constants.OPERATION_TYPE_WITHDRAW, amount);

        if (opId > 0) {
          LOGGER.debug("The withdraw is ok for the BAN: " + ban + " and the new balance is "
              + ba.getBalanceAmount());
          ba = persistenceServices.findBankAccountByBAN(ban);
          return new CreateWithdrawResponse(ba.getBalanceAmount(), Constants.SERVICE_OK);
        } else {
          int intOpId = (int) opId;
          return new CreateWithdrawResponse(null, intOpId);
        } // condition on opid
      } // condition on newCalculatedBalance
    } else {
      LOGGER.error("The bank account does not exist for the BAN: " + ban);
      return new CreateWithdrawResponse(null, Constants.BANK_ACCOUNT_NOT_EXISTS);
    } // condition on ba
  }


  public MonthlyBankStatement createMonthlyBankStatement(String ban) {

    // Add all the operations between now and one month before
    LocalDate limDate = LocalDate.now().minusMonths(1);
    List<MonthlyBankStatementOperation> bkops = new ArrayList<MonthlyBankStatementOperation>();
    Set<Operation> ops = persistenceServices.findBankingOperationsOfBankAccount(ban);
    if (ops != null) {
      LOGGER.debug("Number of operations before :" + ops.size());
      for (Operation op : ops) {
        if (op.getOperationDate().isAfter(limDate)) {
          bkops.add(new MonthlyBankStatementOperation(op));
        }
      }
      LOGGER.debug("Number of operations after :" + bkops.size());
    }

    // Sort the list by date
    Comparator<MonthlyBankStatementOperation> reverseComparator = (m1, m2) -> {
      return m2.getOperationDate().compareTo(m1.getOperationDate());
    };
    Collections.sort(bkops, reverseComparator);

    LOGGER.debug("List of bank statement operations : " + bkops);

    // Find information about the bank account
    Account ba = persistenceServices.findBankAccountByBAN(ban);
    if (ba != null && !ba.getBankAccountNumber().isEmpty()) {
      MonthlyBankStatement bk = new MonthlyBankStatement(ba, bkops);
      LOGGER.debug("Generated bank statement : " + bk);
      return bk;
    } else {
      LOGGER.error("Error when searching the BAN : " + ban);
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

      long opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusYears(1),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(150.25));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusMonths(10),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(2500.50));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusMonths(9),
          Constants.OPERATION_TYPE_WITHDRAW, BigDecimal.valueOf(18.25));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusMonths(4),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(1505.0));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(40),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(100.0));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(25),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(1510.42));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(10),
          Constants.OPERATION_TYPE_WITHDRAW, BigDecimal.valueOf(100.25));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(10),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(150.25));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now().minusDays(5),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(45.0));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now(),
          Constants.OPERATION_TYPE_DEPOSIT, BigDecimal.valueOf(352.14));

      opId = persistenceServices.createNewBankingOperation(ba, LocalDate.now(),
          Constants.OPERATION_TYPE_WITHDRAW, BigDecimal.valueOf(1150.25));

      if (opId > 0) {
        LOGGER.debug("The deposit is ok for the BAN: " + ban + " and the new balance is "
            + ba.getBalanceAmount());
        ba = persistenceServices.findBankAccountByBAN(ban);
        return new CreateDepositResponse(ba.getBalanceAmount(), Constants.SERVICE_OK);
      } else {
        int intOpId = (int) opId;
        return new CreateDepositResponse(null, intOpId);
      } // condition on opid
    } else {
      LOGGER.error("The bank account does not exist for the BAN: " + ban);
      return new CreateDepositResponse(null, Constants.BANK_ACCOUNT_NOT_EXISTS);
    } // condition on ba
  }


}
