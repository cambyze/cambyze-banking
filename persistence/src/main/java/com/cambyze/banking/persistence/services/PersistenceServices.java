package com.cambyze.banking.persistence.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cambyze.banking.persistence.dao.BankAccountRepository;
import com.cambyze.banking.persistence.dao.BankingOperationRepository;
import com.cambyze.banking.persistence.model.Account;
import com.cambyze.banking.persistence.model.Constants;
import com.cambyze.banking.persistence.model.Operation;

/**
 * Services to expose for the business services
 */
@Service
public class PersistenceServices {

  private static final Logger LOGGER = LoggerFactory.getLogger(PersistenceServices.class);

  @Autowired
  private BankAccountRepository bankAccountRepository;
  @Autowired
  private BankingOperationRepository bankingOperationRepository;
  @Autowired
  private SequenceGeneratorService sequenceGeneratorService;

  /**
   * Create a new bank account
   * 
   * @return its BAN
   */
  public String createNewBankAccount() {
    Account ba = new Account();
    long seq = sequenceGeneratorService.getNextSequence("bank_account_number");
    String externalRef = String.format("CAMBYZEBANK-%08d", seq);
    ba.setBankAccountNumber(externalRef);
    bankAccountRepository.save(ba);
    return ba.getBankAccountNumber();
  }

  /**
   * <p>
   * Find a bank account by its bank account number
   * </p>
   * <p>
   * It is a lazy mode service then the list of operations is empty
   * </p>
   * 
   * @param ban Bank Account Number
   * @return the bank account as entity Account or null if not exists
   */
  public Account findBankAccountByBAN(String ban) {
    // Lazy mode
    Account ba = bankAccountRepository.findByBankAccountNumberIgnoreCase(ban);
    if (ba != null) {
      LOGGER.debug("Retrieve account: " + ba.toString());
      return ba;
    } else {
      LOGGER.debug("No account for the ban: " + ban);
      return null;
    }

  }

  /**
   * Create a new banking operation
   * 
   * @param ba Bank Account of the operation to create
   * @param opDate Date of the operation
   * @param opType Type of operation, must be Constants.OPERATION_TYPE_DEPOSIT or
   *        Constants.OPERATION_TYPE_WITHDRAW
   * @param opAmount
   * @return its internal id or negative integer in case of error:
   *         <p>
   *         - Constants.INVALID_BANK_ACCOUNT
   *         </p>
   */
  public String createNewBankingOperation(Account ba, LocalDate opDate, String opType,
      BigDecimal opAmount) {
    if (ba != null && ba.getId() != null && ba.getBankAccountNumber() != null
        && ba.getBankAccountNumber().startsWith("CAMBYZEBANK")) {
      if (opDate != null && !opDate.isBefore(Constants.MIN_OPERATION_DATE)
          && !opDate.isAfter(Constants.MAX_OPERATION_DATE)) {
        if (opType == Constants.OPERATION_TYPE_DEPOSIT
            || opType == Constants.OPERATION_TYPE_WITHDRAW) {
          if (opAmount != null && opAmount.longValue() > 0.0) {
            Operation op = new Operation(ba.getAccountId(), opDate, opType, opAmount);
            if (opType == Constants.OPERATION_TYPE_DEPOSIT) {
              ba.setBalanceAmount(ba.getBalanceAmount().add(opAmount));
            } else {
              opAmount = opAmount.negate();
              ba.setBalanceAmount(ba.getBalanceAmount().add(opAmount));
            }
            bankingOperationRepository.save(op);
            bankAccountRepository.save(ba);

            LOGGER.debug("New situation of the bank account: " + ba);

            if (op.getId() != null && op.getId().length() > 0) {
              LOGGER.debug("Operation created: " + op);
              return op.getId();
            } else {
              LOGGER.error("Operation not created: " + op);
              return Constants.TECHNICAL_ERROR;
            } // condition op.getID
          } else {
            LOGGER.error("Operation not created because the amount is invalid");
            return Constants.INVALID_AMOUNT;
          } // condition opAmount

        } else {
          LOGGER.error("Operation not created because the operation type is wrong: " + opType);
          return Constants.INVALID_OPERATION_TYPE;
        } // condition opType
      } else {
        LOGGER.error("Operation not created because the date is invalid: {}", opDate);
        return Constants.INVALID_DATE;
      } // condition opDate
    } else {
      LOGGER.error("Operation not created because the bank account is invalid");
      return Constants.INVALID_BANK_ACCOUNT;
    } // condition bank account
  }

  /**
   * 
   * Returns the list of operations for a bank account
   * 
   * @param ban the Bank Account Number
   * @return the list of operations else null
   */
  public List<Operation> findBankingOperationsOfBankAccount(String ban) {
    // Lazy mode
    Account lazyBa = findBankAccountByBAN(ban);
    if (lazyBa != null && lazyBa.getAccountId() != null) {
      LOGGER.debug("[findBankingOperationsOfBankAccount] Found account with the id; "
          + lazyBa.getAccountId());
      List<Operation> operations =
          bankingOperationRepository.findByAccountId(lazyBa.getAccountId());
      if (operations != null && !operations.isEmpty()) {
        LOGGER.debug("[findBankingOperationsOfBankAccount] Nb of operations for the account " + ban
            + " = " + operations.size());
        return operations;
      }
    }
    LOGGER
        .debug("[findBankingOperationsOfBankAccount] List of operations is empty for the account + "
            + ban);
    return Collections.emptyList();
  }


  public void createOverdraft(Account ba, BigDecimal overDraftAmount) {
    ba.setOverdraftAmount(overDraftAmount);
    bankAccountRepository.save(ba);
    LOGGER.debug("New overdraft amount :" + ba.getOverdraftAmount() + " for the BAN: "
        + ba.getBankAccountNumber());
  }

  public String createSavingsAccount() {
    Account ba = new Account();
    long seq = sequenceGeneratorService.getNextSequence("bank_account_number");
    String externalRef = String.format("CAMBYZEBANK-%08d", seq);
    ba.setBankAccountNumber(externalRef);
    ba.setAccountType(Constants.ACCOUNT_TYPE_SAVINGS);
    bankAccountRepository.save(ba);
    LOGGER.debug("New savings account :" + ba.getAccountType() + " for the BAN: "
        + ba.getBankAccountNumber());
    return ba.getBankAccountNumber();
  }

}
