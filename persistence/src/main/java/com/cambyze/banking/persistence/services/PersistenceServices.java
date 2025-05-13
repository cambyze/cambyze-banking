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
import com.cambyze.banking.persistence.dao.PersonAccountRepository;
import com.cambyze.banking.persistence.dao.PersonRepository;
import com.cambyze.banking.persistence.model.Account;
import com.cambyze.banking.persistence.model.Constants;
import com.cambyze.banking.persistence.model.Operation;
import com.cambyze.banking.persistence.model.Person;

/**
 * Services to expose for the business services
 */
@Service
public class PersistenceServices {

  private static final Logger LOGGER = LoggerFactory.getLogger(PersistenceServices.class);


  private BankAccountRepository bankAccountRepository;

  private BankingOperationRepository bankingOperationRepository;

  private SequenceGeneratorService sequenceGeneratorService;

  private PersonRepository personRepository;
@Autowired
  private PersonAccountRepository personAcountRepository;


  @Autowired
  public PersistenceServices(BankAccountRepository bankAccountRepository,
      BankingOperationRepository bankingOperationRepository,
      SequenceGeneratorService sequenceGeneratorService, PersonRepository personRepository) {
    this.bankAccountRepository = bankAccountRepository;
    this.bankingOperationRepository = bankingOperationRepository;
    this.sequenceGeneratorService = sequenceGeneratorService;
    this.personRepository = personRepository;
  }

  /*
   * create a new Person
   * 
   * @return userId
   */
  public String createNewPerson(String name, String firstName, String email) {
    LOGGER.debug("Create New Person with name: {}, firstName: {}, email: {}", name, firstName,
        email);
    Person per = new Person();
    long seq = sequenceGeneratorService.getNextSequence("person");
    String externalRef = String.format("User-%08d", seq);
    per.setId(externalRef);
    per.setName(name);
    per.setFirstName(firstName);
    per.setEmail(email);
    personRepository.save(per);
    LOGGER.debug("New person created: {}", per);

    createNewBankAccount(externalRef);
    return per.getId();
  }

  /*
   * Find a Person by its by his mail
   * 
   */
  public Person findPersonByMail(String mail) {
    Person per = personRepository.findByIdIgnoreCase(mail);
    if (per != null) {
      LOGGER.debug("Retrieve Person: {}", per);
      return per;
    } else {
      LOGGER.debug("No Person for the mail: {}", per);
      return null;
    }
  }

  /*
   * Find a Person by its by his id
   * 
   */
  public Person findPersonByid(String id) {
    Person per = personRepository.findByIdIgnoreCase(id);
    LOGGER.debug("id: {} findById, {} , per: {}", id, personRepository.findByIdIgnoreCase(id), per);
    if (per != null) {
      LOGGER.debug("Retrieve Person: {}", per);
      return per;
    } else {
      LOGGER.debug("No Person found for the ID: {}", id);
      return null;
    }
  }

  /**
   * 
   * Returns the list of operations for a bank account
   * 
   * @param ban the id Person
   * @return the list of operations else null
   */
  public List<Account> findBanOfPerson(String id) {
    // Lazy mode
    LOGGER.debug("[findBanOfPerson] id: {} START", id);
    Person lazyAc = findPersonByid(id);
    if (lazyAc != null && lazyAc.getId() != null) {
      LOGGER.debug("[findBankAccount] Found account with the id; {}, original id: {}", lazyAc.getId(), id);
      List<Account> ac = personAcountRepository.findByPersonId(lazyAc.getId());
      if (ac != null && !ac.isEmpty()) {
        LOGGER.debug(
            "[findBankAccount1] Nb of  account {} = {}", id,
            ac.size());
        return ac;
      }
    }else {
      LOGGER.debug("[findBankAccount2] Person not found for the id: {}", id);
    }
    LOGGER.debug(
        "[findBankAccount3] List of Account is empty for the account + {}",
        id);
    return Collections.emptyList();
  }

  /**
   * Create a new bank account
   * 
   * @return its BAN
   */
  public String createNewBankAccount(String id) {
    LOGGER.debug("Create New Bank Account for the person id: {}", id);
    Account ba = new Account( id);
    //Account ba = new Account("User-00000001");
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
      LOGGER.debug("Retrieve account: {}", ba);
      return ba;
    } else {
      LOGGER.debug("No account for the ban: {}", ban);
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
    Operation op;

    LOGGER.debug("+++ ba: ({})  opDate: ({})  opType: ({})  opAmount: ({}) ", ba, opDate, opType,
        opAmount);
    if (ba == null || ba.getId() == null || ba.getBankAccountNumber() == null
        || !ba.getBankAccountNumber().startsWith("CAMBYZEBANK")) {
      LOGGER.error("Operation not created because the bank account is invalid");

      return Constants.INVALID_BANK_ACCOUNT;
    } // condition bank account

    if (opDate == null || opDate.isBefore(Constants.MIN_OPERATION_DATE)
        || opDate.isAfter(Constants.MAX_OPERATION_DATE)) {
      LOGGER.error("Operation not created because the date is invalid: {}", opDate);
      return Constants.INVALID_DATE;
    } // condition opDate


    if (!Constants.OPERATION_TYPE_DEPOSIT.equals(opType)
        && !Constants.OPERATION_TYPE_WITHDRAW.equals(opType)) {
      LOGGER.error("Operation not created because the operation type is wrong: {}", opType);
      return Constants.INVALID_OPERATION_TYPE;
    } // condition opType

    if (opAmount != null && opAmount.longValue() > 0.0) {
      op = new Operation(ba.getAccountId(), opDate, opType, opAmount);
    } else {
      LOGGER.error("Operation not created because the amount is invalid");
      return Constants.INVALID_AMOUNT;
    } // condition opAmount
    if (Constants.OPERATION_TYPE_DEPOSIT.equals(opType)) {
      ba.setBalanceAmount(ba.getBalanceAmount().add(opAmount));
    } else {
      opAmount = opAmount.negate();
      ba.setBalanceAmount(ba.getBalanceAmount().add(opAmount));
    }
    bankingOperationRepository.save(op);
    bankAccountRepository.save(ba);

    LOGGER.debug("New situation of the bank account: {}", ba);
    LOGGER.debug("op.getID(): {} op.getId().isEmpty(): {}", op.getId(), op.getId().isEmpty());
    if (op.getId() != null && !op.getId().isEmpty()) {
      LOGGER.debug("Operation created: {}", op);
      return op.getId();
    } else {
      LOGGER.error("Operation not created: {}", op);
      return Constants.TECHNICAL_ERROR;
    } // condition op.getID
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
      LOGGER.debug("[findBankingOperationsOfBankAccount] Found account with the id; {}",
          lazyBa.getAccountId());
      List<Operation> operations = bankingOperationRepository.findByAccountId(lazyBa.getId());
      if (operations != null && !operations.isEmpty()) {
        LOGGER.debug(
            "[findBankingOperationsOfBankAccount] Nb of operations for the account {} = {}", ban,
            operations.size());
        return operations;
      }
    }
    LOGGER.debug(
        "[findBankingOperationsOfBankAccount] List of operations is empty for the account + {}",
        ban);
    return Collections.emptyList();
  }


  public void createOverdraft(Account ba, BigDecimal overDraftAmount) {
    ba.setOverdraftAmount(overDraftAmount);
    bankAccountRepository.save(ba);
    LOGGER.debug("New overdraft amount : {} for the BAN: {}", ba.getOverdraftAmount(),
        ba.getBankAccountNumber());
  }

  public String createSavingsAccount(String id) {
    //Account ba = new Account("User-00000001");
    // on assume que User-00000001 existe
    Account ba = new Account(id);
    long seq = sequenceGeneratorService.getNextSequence("bank_account_number");
    String externalRef = String.format("CAMBYZEBANK-%08d", seq);
    ba.setBankAccountNumber(externalRef);
    ba.setAccountType(Constants.ACCOUNT_TYPE_SAVINGS);
    bankAccountRepository.save(ba);
    LOGGER.debug("New savings account : {} for the BAN: {}", ba.getAccountType(),
        ba.getBankAccountNumber());
    return ba.getBankAccountNumber();
  }



}
