package com.cambyze.banking.persistence.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
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
 * DAO services to expose for the business services
 */
@Service
// @ComponentScan
public class PersistenceServices {

  private static final Logger LOGGER = LoggerFactory.getLogger(PersistenceServices.class);

  @Autowired
  private BankAccountRepository bankAccountRepository;
  @Autowired
  private BankingOperationRepository bankingOperationRepository;

  /**
   * Create a new bank account
   * 
   * @return its BAN
   */
  public String createNewBankAccount() {
    Account ba = new Account();
    String externalRef = "CAMBYZEBANK-BANK0005";
    ba.setBankAccountNumber(externalRef);
    bankAccountRepository.save(ba);
    return ba.getBankAccountNumber();
  }

  /**
   * Find a bank account by its bank account number
   * 
   * @param ban bank account number
   * @return the bank account as entity Account or null if not exists
   */
  public Account findBankAccountByBAN(String ban) {
    // Account ba = bankAccountRepository.findAll().stream().findFirst().orElse(null);
    Account ba = bankAccountRepository.findAll().stream()
        .filter(findOp -> findOp.getBankAccountNumber().equals(ban)).findFirst().orElse(null);
    if (ba != null) {
      return ba;
    } else {
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
      if (opDate != null && !opDate.isBefore(LocalDate.ofYearDay(1990, 1))
          && !opDate.isAfter(LocalDate.ofYearDay(2500, 1))) {
        if (opType == Constants.OPERATION_TYPE_DEPOSIT
            || opType == Constants.OPERATION_TYPE_WITHDRAW) {
          if (opAmount != null && opAmount.longValue() > 0.0) {
            Operation op = new Operation(ba, opDate, opType, opAmount);
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
        LOGGER.error("Operation not created because the date is invalid: ");
        return Constants.INVALID_DATE;
      } // condition opDate
    } else {
      LOGGER.error("Operation not created because the bank account is invalid");
      return Constants.INVALID_BANK_ACCOUNT;
    } // condition bank account
  }

  // TODO: Check if the following code is correct and replace the current one if OK
  // public long createNewBankingOperation(Account ba, LocalDate opDate, int opType, BigDecimal
  // opAmount) {
  // if (!isValidBankAccount(ba)) {
  // LOGGER.error("Operation not created because the bank account is invalid");
  // return Constants.INVALID_BANK_ACCOUNT;
  // }
  //
  // if (!isValidDate(opDate)) {
  // LOGGER.error("Operation not created because the date is invalid: " + opDate);
  // return Constants.INVALID_DATE;
  // }
  //
  // if (!isValidOperationType(opType)) {
  // LOGGER.error("Operation not created because the operation type is wrong: " + opType);
  // return Constants.INVALID_OPERATION_TYPE;
  // }
  //
  // if (!isValidAmount(opAmount)) {
  // LOGGER.error("Operation not created because the amount is invalid");
  // return Constants.INVALID_AMOUNT;
  // }
  //
  // Operation op = new Operation(ba, opDate, opType, opAmount);
  //
  // if (opType == Constants.OPERATION_TYPE_WITHDRAW) {
  // opAmount = opAmount.negate();
  // }
  //
  // ba.setBalanceAmount(ba.getBalanceAmount().add(opAmount));
  // bankingOperationRepository.save(op);
  // bankAccountRepository.save(ba);
  //
  // LOGGER.debug("New situation of the bank account: " + ba);
  //
  // if (op.getId() != null && op.getId() > 0) {
  // LOGGER.debug("Operation created: " + op);
  // return op.getId();
  // } else {
  // LOGGER.error("Operation not created: " + op);
  // return Constants.TECHNICAL_ERROR;
  // }
  // }
  //
  // private boolean isValidBankAccount(Account ba) {
  // return ba != null && ba.getId() != null
  // && ba.getBankAccountNumber() != null
  // && ba.getBankAccountNumber().startsWith("CAMBYZEBANK");
  // }
  //
  // private boolean isValidDate(LocalDate date) {
  // return date != null
  // && !date.isBefore(LocalDate.ofYearDay(1990, 1))
  // && !date.isAfter(LocalDate.ofYearDay(2500, 1));
  // }
  //
  // private boolean isValidOperationType(int opType) {
  // return opType == Constants.OPERATION_TYPE_DEPOSIT || opType ==
  // Constants.OPERATION_TYPE_WITHDRAW;
  // }
  //
  // private boolean isValidAmount(BigDecimal amount) {
  // return amount != null && amount.longValue() > 0;
  // }
  //
  /**
   * Find banking operation with its id
   * 
   * @param id operation id
   * @return the banking operation as an entity Operation else return null
   */
  public Operation findBankingOperationById(String id) {
    LOGGER.debug("Try to find an operation by its id: " + id);
    Optional<Operation> optOperation = bankingOperationRepository.findById(id);
    LOGGER.debug("Found operation ?: " + optOperation.isPresent());
    if (optOperation.isPresent()) {
      LOGGER.debug("Founding operation ?: " + optOperation.get().toString());
      return optOperation.get();
    } else {
      return null;
    }
  }



  /**
   * 
   * Returns the list of operations for a bank account
   * 
   * @param ban the Bank Account Number
   * @return the list of operations else null
   */
  public List<Operation> findBankingOperationsOfBankAccount(String ban) {
    LOGGER.debug("-----------findBankingOperationsOfBankAccount: [" + ban + "]------------------");
    // Account ba = bankAccountRepository.findByBankAccountNumber(ban);
    Account ba = bankAccountRepository.findAll().stream()
        .filter(findOp -> findOp.getBankAccountNumber().equals(ban)).findFirst().orElse(null);

    LOGGER.debug("------| Test : " + bankAccountRepository.findAll().stream()
        .filter(findOp -> findOp.getBankAccountNumber().equals(ban)).findFirst().orElse(null));


    LOGGER.debug("=== Try to find operations by BAN: [" + ba + "]");
    List<Operation> operations = ba.getBankingOperations();
    LOGGER.debug("FIND BA bankAccoutRepository find with graph 22: {}", operations);
    if (operations != null && !operations.isEmpty()) {
      LOGGER.debug("List of operations for the BAN " + ban + " => " + operations);
      return operations;
    } else {
      LOGGER.debug("List of operations is empty");
      return null;
    }
  }

  public void createOverdraft(Account ba, BigDecimal overDraftAmount) {
    ba.setOverdraftAmount(overDraftAmount);
    bankAccountRepository.save(ba);
    LOGGER.debug("New overdraft amount :" + ba.getOverdraftAmount() + " for the BAN: "
        + ba.getBankAccountNumber());
  }

  public String createSavingsAccount() {
    Account ba = new Account();
    ba.setAccountType(Constants.ACCOUNT_TYPE_SAVINGS);
    // long seq = sequenceService.getNextSequence("bankAccountNumber");
    // String externalRef = String.format("BANK-%08d", seq);
    String externalRef = "CAMBYZEBANK-BANK0005";
    ba.setBankAccountNumber(externalRef);
    ba.setAccountType(Constants.ACCOUNT_TYPE_SAVINGS);
    bankAccountRepository.save(ba);
    LOGGER.debug("New BAN:" + ba.getBankAccountNumber());
    LOGGER.debug("New BA full content:" + ba.toString());
    bankAccountRepository.save(ba);
    LOGGER.debug(
        "New account type :" + ba.getAccountType() + " for the BAN: " + ba.getBankAccountNumber());
    return ba.getBankAccountNumber();
  }


}
