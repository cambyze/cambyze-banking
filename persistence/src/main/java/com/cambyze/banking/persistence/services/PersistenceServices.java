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
import com.cambyze.banking.persistence.model.Adresse;
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
  // public String createNewPerson(String name, String firstName, String email, String psw,
  //     String adress) {
  public String createNewPerson(String name, String firstName, String email, String psw,
                              String street, String city, String state, String country, String secondaryAddress) {
    LOGGER.debug("Create New Person with name: {}, firstName: {}, email: {}, psw: {}, adress: {}",
        name, firstName, email, psw, street + ", " + city + ", " + state + ", " + country);
    Person per = new Person();
    // long seq = sequenceGeneratorService.getNextSequence("person");
    // String externalRef = String.format("CLI-%08d", seq);
    String ibanKey = new BanGenerator(sequenceGeneratorService).generateNewBan();
    LOGGER.debug("Generated IBAN Key: {}", ibanKey);
    // per.setId(externalRef);
    per.setId(ibanKey);
    per.setName(name);
    per.setFirstName(firstName);
    per.setEmail(email);
    per.setPsw(psw);
    // per.setAdress(adress);
    Adresse adresse = new Adresse();
    adresse.setStreet(street);
    adresse.setCity(city);
    adresse.setState(state);
    adresse.setCountry(country);
    adresse.setSecondaryAddress(secondaryAddress);
    per.setAdress(adresse);
    personRepository.save(per);
    LOGGER.debug("New person created: {}", per);
    return per.getPersonId();
  }

  /**
   * Find the persons by their mail
   * 
   * @param mail
   * @return list of persons with the mail else an empty list
   */
  public List<Person> findPersonByMail(String mail) {
    List<Person> pers = personRepository.findByEmail(mail);
    if (pers != null && !pers.isEmpty()) {
      LOGGER.debug("Retrieve {} persons with the mail {}", pers.size(), mail);
      return pers;
    } else {
      LOGGER.debug("No Person for the mail: {}", mail);
      return Collections.emptyList();
    }
  }

  /**
   * Find a person with its id
   * 
   * @param id
   * @return the person with this id else return null
   */
  public Person findPersonByid(String id) {
    Person per = personRepository.findByPersonIdIgnoreCase(id);
    if (per != null) {
      LOGGER.debug("Retrieve Person: {}", per);
      return per;
    } else {
      LOGGER.debug("No Person found for the ID: {}", id);
      return null;
    }
  }

  /**
   * generate a String who resume Account
   * 
   * @param ba
   * @return String to display personId, AccountNumber, AccountType, OverdraftAmount
   */
  public String accountToString(Account ba) {
    Person per = findPersonByid(ba.getPersonId());
    if (per != null && per.getPersonId() != null) {
      return "Client: " + per.getPersonId() + " BAN: " + ba.getBankAccountNumber() + " / "
          + ba.getAccountType() + " / " + ba.getBalanceAmount() + " / " + ba.getOverdraftAmount();
    }
    return "****** ERROR ********** : " + ba.getPersonId();
  }

  /**
   * 
   * generate a String who resume the operations
   * 
   * @param op
   * @return String to display personId, banNumber, overdraftAmount
   */
  public String operationToString(Operation op) {
    return bankAccountRepository.findById(op.getAccountId()).map(account -> {
      Person per = findPersonByid(account.getPersonId());
      if (per != null && per.getPersonId() != null) {
        return "Client: " + per.getPersonId() + " BAN: " + account.getBankAccountNumber() + " / "
            + account.getAccountType() + " / " + account.getBalanceAmount() + " / "
            + account.getOverdraftAmount();
      }
      return null;
    }).orElse(null);
  }


  /**
   * 
   * Returns the list of accounts for a person
   * 
   * @param personId
   * @return the list of accounts else an empty list
   */
  public List<Account> findBankAccountsByPerson(String personId) {
    // Lazy mode
    LOGGER.debug("[findBankAccountsByPerson] id: {} START", personId);
    Person lazyPer = findPersonByid(personId);
    if (lazyPer != null && lazyPer.getId() != null) {
      LOGGER.debug("[findBankAccount] Found person ({}) with the id ({}) and person ID: ({})",
          lazyPer.getName(), personId, lazyPer.getId());
      List<Account> acs = personAcountRepository.findByPersonId(lazyPer.getId());
      if (acs != null && !acs.isEmpty()) {
        LOGGER.debug("[findBankAccount1] Nb of accounts for the person ({}) = ({}) ",
            lazyPer.getName(), acs.size());
        return acs;
      } else {
        LOGGER.debug("[findBankAccount2] Not accounts found for the person: {}", lazyPer.getName());
        return Collections.emptyList();
      }
    } else {
      LOGGER.error("The person with the id {} doesn't exist", personId);
      return Collections.emptyList();
    }
  }

  /**
   * Create a new bank account for a person
   * 
   * @param personId
   * @return the created BAN
   */
  public String createNewBankAccount(String personId) {
    LOGGER.debug("Create New Bank Account for the person id: {}", personId);
    // Lazy mode
    LOGGER.debug("[findBankAccountsByPerson] id: {} START", personId);
    Person lazyPer = findPersonByid(personId);
    if (lazyPer != null && lazyPer.getId() != null) {
      Account ba = new Account(lazyPer.getId());
      long seq = sequenceGeneratorService.getNextSequence("bank_account_number");
      String externalRef = String.format("CAMBYZEBANK-%08d", seq);
      ba.setBankAccountNumber(externalRef);
      // Ajout de 10 si le type de compte est ACCOUNT_TYPE_BANK
      if (Constants.ACCOUNT_TYPE_BANK.equals(ba.getAccountType())) {
        ba.setBalanceAmount(ba.getBalanceAmount().add(BigDecimal.valueOf(10.0)));
      }
      bankAccountRepository.save(ba);
      return ba.getBankAccountNumber();
    } else {
      return "";
    }
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
      LOGGER.debug("Retrieve account: {}", accountToString(ba));
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
   *         <ul>
   *         <li>Constants.INVALID_BANK_ACCOUNT</li>
   *         <li>Constants.INVALID_OPERATION_TYPE</li>
   *         <li>Constants.INVALID_BANK_ACCOUNT</li>
   *         <li>Constants.INVALID_DATE</li>
   *         <ul>
   */
  public String createNewBankingOperation(Account ba, LocalDate opDate, String opType,
      BigDecimal opAmount) {
    Operation op;
    if (ba == null || ba.getAccountId() == null || ba.getBankAccountNumber() == null
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

    LOGGER.debug("New situation of the bank account: {}", accountToString(ba));
    if (op.getId() != null && !op.getId().isEmpty()) {
      return op.getId();
    } else {
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
      LOGGER.debug("[findBankingOperationsOfBankAccount] Found account with the id: {}",
          lazyBa.getBankAccountNumber());
      List<Operation> operations =
          bankingOperationRepository.findByAccountId(lazyBa.getAccountId());
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

  /**
   * 
   * Create a new Overdraft
   * 
   * @param ba
   * @param overDraftAmount
   */
  public void createOverdraft(Account ba, BigDecimal overDraftAmount) {
    ba.setOverdraftAmount(overDraftAmount);
    bankAccountRepository.save(ba);
    LOGGER.debug("New overdraft amount : {} for the BAN: {}", ba.getOverdraftAmount(),
        ba.getBankAccountNumber());
  }

  /**
   * Create a new saving account for a person
   * 
   * @param personId
   * @return the created BAN
   */
  public String createSavingsAccount(String personId) {
    Account ba = new Account(personId);
    long seq = sequenceGeneratorService.getNextSequence("bank_account_number");
    String externalRef = String.format("CAMBYZEBANK-%08d", seq);
    ba.setBankAccountNumber(externalRef);
    ba.setAccountType(Constants.ACCOUNT_TYPE_SAVINGS);
    bankAccountRepository.save(ba);
    LOGGER.debug("New savings account : {} for the BAN: {}", ba.getAccountType(),
        ba.getBankAccountNumber());
    return ba.getBankAccountNumber();
  }

   /**
  * Update an existing Person in the database
  * 
  * @param person The person object with updated details
  */
  public void updatePerson(Person person) {
    LOGGER.debug("Updating person: {}", person);
    personRepository.save(person);
    LOGGER.debug("Person updated successfully: {}", person);
  }

  /**
   * See Profile of a Person by their ID
   * @param personId The ID of the person
   * @return The Person object if found, otherwise null
   */
  public Person seeProfileById(String personId) {
    LOGGER.debug("Finding person by ID: {}", personId);
    return personRepository.findById(personId).orElse(null);
  }

  /**
   * update Profile of a Person
   * @param person The Person object with updated details
   * @return The updated Person object
   */

  public Person updateProfile(String personId, String name, String firstName, String email, String psw,
                              String street, String city, String state, String country, String secondaryAddress) {
    LOGGER.debug("Updating profile for person: {}, {}", personId, name);
    Person person = personRepository.findByPersonIdIgnoreCase(personId);
    if (person == null) {
      LOGGER.error("Person with ID {} not found for update.", personId);
      return null;
    }
    person.setName(name);
    person.setFirstName(firstName);
    person.setEmail(email);
    person.setPsw(psw);
    Adresse adresse = new Adresse();
    adresse.setStreet(street);
    adresse.setCity(city);
    adresse.setState(state);
    adresse.setCountry(country);
    adresse.setSecondaryAddress(secondaryAddress);
    person.setAdress(adresse);
    return personRepository.save(person);
  }

  /*
   * overdraft Update
   * 
   */
  public boolean updateOverdraftAmount(String bankAccountNumber, int newOverdraftAmount) {
    Account account = bankAccountRepository.findByBankAccountNumberIgnoreCase(bankAccountNumber);
    if (account != null) {
        account.setOverdraftAmount(BigDecimal.valueOf(newOverdraftAmount));
        bankAccountRepository.save(account);
        LOGGER.debug("Overdraft updated for BAN {}: {}", bankAccountNumber, newOverdraftAmount);
        return true;
    } else {
        LOGGER.error("No account found for BAN: {}", bankAccountNumber);
        return false;
    }
  } 
}