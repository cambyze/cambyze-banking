package com.cambyze.banking.api;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.cambyze.banking.api.microservice.exceptions.InsufficientBalanceException;
import com.cambyze.banking.api.microservice.exceptions.InvalidAmountException;
import com.cambyze.banking.api.microservice.exceptions.InvalidBANException;
import com.cambyze.banking.api.microservice.exceptions.InvalidDateException;
import com.cambyze.banking.api.microservice.exceptions.InvalidOperationTypeException;
import com.cambyze.banking.api.microservice.exceptions.OverdraftForbiddenException;
import com.cambyze.banking.api.microservice.exceptions.RecordNotFoundException;
import com.cambyze.banking.api.microservice.exceptions.SavingsLimitReachedException;
import com.cambyze.banking.api.microservice.exceptions.TechnicalErrorException;
import com.cambyze.banking.persistence.model.Account;
import com.cambyze.banking.persistence.model.Constants;
import com.cambyze.banking.persistence.model.Person;
import com.cambyze.banking.services.AskOverdraftResponse;
import com.cambyze.banking.services.BankingServices;
import com.cambyze.banking.services.CreateDepositResponse;
import com.cambyze.banking.services.CreateWithdrawResponse;
import com.cambyze.banking.services.MonthlyBankStatement;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.servers.Server;

/**
 * REST API controller for the management of the bank accounts
 * 
 * @author Thierry NESTELHUT
 * @author CAMBYZE
 * @see <a href="https://cambyze.com">Cambyze</a>
 * 
 */
  @OpenAPIDefinition(
    info = @Info(title = "Cambyze banking service", version = "0.0",
        description = "Services to banking accounts",
        termsOfService = "https://cambyze.com/termsofservice/",
        license = @License(name = "Apache 2.0",
            url = "https://www.apache.org/licenses/LICENSE-2.0.html"),
        contact = @Contact(url = "https://cambyze.com/", name = "Cambyze support",
            email = "support@cambyze.com")),
    servers = {@Server(description = "Cambyze server", url = "https://cambyze.com/banking-api")})

  @RestController
  public class BankAccountController {

    private static final Logger LOGGER = LoggerFactory.getLogger(BankAccountController.class);

    private final BankingServices bankingServices;

    public BankAccountController(BankingServices bankingServices) {
      super();
      this.bankingServices = bankingServices;
    }

  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @Operation(summary = "Create a bank account",
      description = "Create a bank account and return its bank account number",

      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed", required = false,
          content = @Content(mediaType = "application/json",
              contentSchema = @Schema(implementation = String.class))),
      parameters = {
          @Parameter(required = true, description = "Person id", example = "CLI-00000001")},
      responses = {@ApiResponse(description = "The new bank account number",
          content = @Content(mediaType = "String"))})


  @Path("/createBankAccount")
  @PostMapping("/createBankAccount")
  public String createBankAccount(@RequestParam(value = "personId") String personId) {
    String ban = bankingServices.createNewBankAccount(personId);
    if (ban != null && !ban.isEmpty()) {
      LOGGER.info("New created account: {}", ban);
      return ban;
    } else {
      String msg = "Technical pb when creating a new bank account";
      LOGGER.error(msg);
      throw new TechnicalErrorException(msg);
    }
  }

  private RuntimeException functionalException(String returnCode) {
    switch (returnCode) {
      case Constants.BANK_ACCOUNT_NOT_EXISTS:
        return new RecordNotFoundException("The bank account does not exist");
      case Constants.INVALID_AMOUNT:
        return new InvalidAmountException("The amount is invalid");
      case Constants.INVALID_BANK_ACCOUNT:
        return new InvalidBANException("The bank account is invalid");
      case Constants.INVALID_DATE:
        return new InvalidDateException("The date is invalid");
      case Constants.INVALID_OPERATION_TYPE:
        return new InvalidOperationTypeException("The operation type is invalid");
      case Constants.OVERDRAFT_FORBID_SAVINGS_ACC:
        return new OverdraftForbiddenException("Overdraft are forbidden for savings account");
      case Constants.INSUFFICIENT_BALANCE:
        return new InsufficientBalanceException("No sufficient balance for the operation");
      case Constants.SAVINGS_LIMIT_REACHED:
        return new SavingsLimitReachedException("The limit of the savings account is reached");
      default:
        return new TechnicalErrorException("Technical error");
    }
  }

  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @Operation(summary = "Create a savings account",
      description = "Create a savings account and return its bank account number",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed", required = false,
          content = @Content(mediaType = "application/json",
              contentSchema = @Schema(implementation = String.class))),
      parameters = {
          @Parameter(required = true, description = "Person id", example = "CLI-00000001")},
      responses = {@ApiResponse(description = "The new bank account number",
          content = @Content(mediaType = "String"))})

  @PostMapping("/createSavingsAccount")
  public String createSavingsAccount(@RequestParam("personId") String personId) {

    String ban = bankingServices.createNewSavingsAccount(personId);
    if (ban != null && !ban.isEmpty()) {
      LOGGER.info("New created savings account: {} ", ban);
      return ban;
    } else {
      String msg = "Technical pb when creating a new savings account";
      LOGGER.error(msg);
      throw new TechnicalErrorException(msg);
    }
  }

  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @Operation(summary = "Create a deposit in a bank account",
      description = "Create the deposit in the bank account and return its new balance",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed, you have to use the required parameters: ban (the bank account number, ex: CAMBYZEBANK-2) & amount (the deposit amount, ex: 120.26)",
          required = false),
      parameters = {
          @Parameter(required = true, description = "Bank Account Number",
              example = "CAMBYZEBANK-2"),
          @Parameter(required = true, description = "Deposit amount", example = "120.26")},
      responses = {@ApiResponse(description = "The new balance",
          content = @Content(mediaType = "BigDecimal"))})

  @PostMapping("/createDeposit")
  public BigDecimal createDeposit(@RequestParam(value = "ban") String ban,
      @RequestParam(value = "amount") String amount) {
    BigDecimal bigAmount;
    try {
      bigAmount = BigDecimal.valueOf(Double.parseDouble(amount));
    } catch (NumberFormatException e) {
      String msg = "Invalid amount: " + e.getMessage();
      LOGGER.error(msg);
      throw new TechnicalErrorException(msg);
    }

    CreateDepositResponse createDepositResponse = bankingServices.createDeposit(ban, bigAmount);
    if (createDepositResponse != null && createDepositResponse.getNewBalance() != null
        && createDepositResponse.getReturnCode().equals(Constants.SERVICE_OK)) {
      LOGGER.debug("createDepositResponse.getNewBalance() : {}",
          createDepositResponse.getNewBalance());
      return createDepositResponse.getNewBalance();
    } else {
      if (createDepositResponse == null) {
        String msg = "Technical pb when creating a new banking operation";
        LOGGER.error(msg);
        throw new TechnicalErrorException(msg);
      } else {
        throw functionalException(createDepositResponse.getReturnCode());
      }
    }
  }


  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @Operation(summary = "Create a withdraw in a bank account",
      description = "Create the withdraw in the bank account and return its new balance",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed, you have to use the required parameters: ban (the bank account number, ex: CAMBYZEBANK-2) & amount (the withdraw amount, ex: 245.45)",
          required = false),
      parameters = {
          @Parameter(required = true, description = "Bank Account Number",
              example = "CAMBYZEBANK-2"),
          @Parameter(required = true, description = "Withdraw amount", example = "120.26")},
      responses = {@ApiResponse(description = "The new balance",
          content = @Content(mediaType = "BigDecimal"))})
  @PostMapping("/createWithdraw")
  public BigDecimal createWithdraw(@RequestParam(value = "ban") String ban,
      @RequestParam(value = "amount") String amount) {

    BigDecimal bigAmount;
    try {
      bigAmount = BigDecimal.valueOf(Double.parseDouble(amount));
    } catch (NumberFormatException e) {
      String msg = "Invalid amount: " + e.getMessage();
      LOGGER.error(msg);
      throw new TechnicalErrorException(msg);
    }

    CreateWithdrawResponse createWithdrawResponse = bankingServices.createWithdraw(ban, bigAmount);
    if (createWithdrawResponse != null && createWithdrawResponse.getNewBalance() != null
        && createWithdrawResponse.getReturnCode().equals(Constants.SERVICE_OK)) {
      return createWithdrawResponse.getNewBalance();
    } else {
      if (createWithdrawResponse == null) {
        String msg = "Technical pb when creating a new banking operation";
        LOGGER.error(msg);
        throw new TechnicalErrorException(msg);
      } else {
        throw functionalException(createWithdrawResponse.getReturnCode());
      }
    }
  }

  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @Operation(summary = "Request an overdraft for a bank account",
      description = "Create the overdraft amount in the bank account and return its value",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed, you have to use the required parameters: ban (the bank account number, ex: CAMBYZEBANK-2)",
          required = false),
      parameters = {@Parameter(required = true, description = "Bank Account Number",
          example = "CAMBYZEBANK-2")},
      responses = {@ApiResponse(description = "The overdraft amount",
          content = @Content(mediaType = "BigDecimal"))})
  // @Path("/requestOverdraft")
  @PostMapping("/requestOverdraft")
  public BigDecimal requestOverdraft(@RequestParam(value = "ban") String ban) {

    AskOverdraftResponse askOverdraftResponse = bankingServices.askOverdraft(ban);
    if (askOverdraftResponse != null && askOverdraftResponse.getOverdraftAmount() != null
        && askOverdraftResponse.getReturnCode().equals(Constants.SERVICE_OK)) {
      return askOverdraftResponse.getOverdraftAmount();
    } else {
      if (askOverdraftResponse == null) {
        String msg = "Technical pb when requesting the overdraft amount";
        LOGGER.error(msg);
        throw new TechnicalErrorException(msg);
      } else {
        throw functionalException(askOverdraftResponse.getReturnCode());
      }
    }
  }

  @GET
  @Consumes("application/json")
  @Operation(summary = "Send the monthly bank statement",
      description = "Send the monthly bank statement for the date of today",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed, you have to use the required parameters: ban (the bank account number, ex: CAMBYZEBANK-2)",
          required = false),
      parameters = {@Parameter(required = true, description = "Bank Account Number",
          example = "CAMBYZEBANK-2")},
      responses = {@ApiResponse(description = "The bank statement",
          content = @Content(mediaType = "MonthlyBankStatement"))})

  @Path("/monthlyBankStatement")
  @GetMapping("/monthlyBankStatement")
  public MonthlyBankStatement calculateMonthlyBankStatement(
      @RequestParam(value = "ban") String ban) {
    MonthlyBankStatement bk = bankingServices.createMonthlyBankStatement(ban);
    if (bk != null) {
      return bk;
    } else {
      String msg = "Technical pb when requesting the bank statement";
      LOGGER.error(msg);
      throw new TechnicalErrorException(msg);
    }
  }

  @POST
  @Consumes("application/json")
  @Operation(summary = "Create a new Person", description = "Create a new person",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed, you have to use the required parameters: name, firstName, mail",
          required = false),
      parameters = {
          @Parameter(name = "name", required = true, description = "Last name of the person",
              example = "Doe"),
          @Parameter(name = "firstName", required = true, description = "First name of the person",
              example = "John"),
          @Parameter(name = "email", required = true, description = "Email address of the person",
              example = "john.doe@example.com"),
          @Parameter(name = "psw", required = true, description = "the User password",
              example = "MySuperPassw0rdIsSafe100%"),
          @Parameter(name = "Street", required = true, description = "the User adress",
              example = "8 rue Sainte-Anne, 75001 Paris."),
          @Parameter(name = "city", required = false, description = "the User city",
              example = "Paris"),
          @Parameter(name = "state", required = false, description = "the User state",
              example = "Ile de France"),
          @Parameter(name = "country", required = false, description = "the User country",
              example = "France"),
          @Parameter(name = "secondaryAddress", required = false,
              description = "the User secondary address", example = "Bat A, Appt 25")
      },
      responses = {
          @ApiResponse(description = "boolean", content = @Content(mediaType = "boolean"))})
  @Produces("application/json")
  @Path("/createPerson")
  @PostMapping("/createPerson")
  public String createPerson(
      @RequestParam(value = "name") String name,
      @RequestParam(value = "firstName") String firstName,
      @RequestParam(value = "mail") String mail,
      @RequestParam(value = "psw") String psw,
      @RequestParam(value = "Street") String street,
      @RequestParam(value = "city", required = false) String city,
      @RequestParam(value = "state", required = false) String state,
      @RequestParam(value = "country", required = false) String country,
      @RequestParam(value = "secondaryAddress", required = false) String secondaryAddress) {
    String per = bankingServices.createPerson(name, firstName, mail, psw, street, city, state, country, secondaryAddress);
    if (per != null && !per.isEmpty()) {
      LOGGER.info("New created Person: {}", per);
      return per;
    } else {
      String msg = "Technical pb when creating a new Person";
      LOGGER.error(msg);
      throw new TechnicalErrorException(msg);
    }
  }

  @POST
  @Consumes("application/json")
  @Operation(summary = "Send if the user is logged",
      description = "Send the monthly bank statement for the date of today",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed, you have to use the required parameters: mail",
          required = false),
      parameters = {@Parameter(required = true, description = "login mail", example = "user.mail")},
      responses = {
          @ApiResponse(description = "boolean", content = @Content(mediaType = "boolean"))})

  @Produces("application/json")
  @PostMapping("/login")
  public boolean login(@RequestParam(value = "mail") String mail) {
    if (mail == null || mail.isEmpty()) {
      String msg = "mail field was empty";
      LOGGER.error("MSG : {}", msg);
      return false;
    }
    boolean login = bankingServices.login(mail);
    if (!login) {
      LOGGER.error("Login failed for mail: {}", mail);
      return false;
    }
    return login;
  }

  @Consumes("application/json")
  @Operation(summary = "send all account for a Person",
      description = "Send a list of all account linked to Person by personId",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed, you have to use the required parameters: personId",
          required = false),
      parameters = {
          @Parameter(required = true, description = "List<Account>", example = "CLI-00000000")},
      responses = {
          @ApiResponse(description = "boolean", content = @Content(mediaType = "boolean"))})


  @Produces("application/json")
  @GetMapping("/findBanByPerson")
  public List<Account> findBanByPerson(@RequestParam(value = "personId") String personId) {
    if (personId == null || personId.isEmpty()) {
      LOGGER.debug("LIST ACCOUNT IS EMPTY");
      return Collections.emptyList();
    }

    List<Account> laccount = bankingServices.findBanByPerson(personId);
    if (laccount.isEmpty()) {
      LOGGER.debug("Find Account List is empty");
      return Collections.emptyList();
    }
    return laccount;
  }

  @PostMapping("/login2")
  public Map<String, Object> login2(@RequestParam("mail") String mail,
      @RequestParam("psw") String psw) {
    Map<String, Object> response = new HashMap<>();
    try {
      if (mail == null || mail.isEmpty()) {
        response.put("authenticated", false);
        response.put("error", "Mail is empty");
        return response;
      }

      Person person = bankingServices.findPersonByMail(mail);

      boolean isValidPerson = bankingServices.login(mail);
      if (!isValidPerson) {
        LOGGER.error("Login failed for mail: {}", mail);
        response.put("authenticated", false);
        response.put("error", "Person not found");
        return null;
      }

      if (person == null || !person.getPsw().equals(psw)) {
        response.put("authenticated", false);
        response.put("error", "Wrong password or person not found");
        return response;
      }

      response.put("authenticated", true);
      response.put("personId", person.getId());
      response.put("firstName", person.getFirstName());
      response.put("lastName", person.getName());
      response.put("email", person.getEmail());
      response.put("adress", person.getAdress());
      return response;
    } catch (Exception e) {
      LOGGER.error("Error during login process: {}", e.getMessage());
      response.put("authenticated", false);
      response.put("error", "Internal server error");
      return response;
    }
  }

  @POST
  @Consumes("application/json")
  @Operation(
      summary = "send the amount set by user from the selected account to the selected account",
      description = "Send the selected amount from a selected account tou a sellected account",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed,  parameters: amount, account from, account for",
          required = true),
      parameters = {@Parameter(required = true, description = "amount", example = "150"),
          @Parameter(required = true, description = "sendAccount",
              example = "CAMBYZEBANK-00000001"),
          @Parameter(required = true, description = "recieveAccount",
              example = "CAMBYZEBANK-00000002")},
      responses = {
          @ApiResponse(description = "boolean", content = @Content(mediaType = "boolean"))})

  @Produces("application/json")
  @PostMapping("/BankTransfer")
  public boolean BankTransfer(@RequestParam(value = "amount", required = false) BigDecimal amount,
      @RequestParam("SendAccount") String SendAccount,
      @RequestParam("ReceiveAccount") String ReceiveAccount) {
    if (amount == null) {
      LOGGER.error("Amount parameter is missing or invalid");
      return false;
    }
    // public boolean BankTransfer(@RequestParam("amount") BigDecimal amount,
    // @RequestParam("SendAccount") String SendAccount,
    // @RequestParam("ReceiveAccount") String ReceiveAccount) {
    // // if (amount < 0) {
    // // throw new InvalidAmountException("The amount must be positive");
    // // }
    if (amount.compareTo(BigDecimal.ZERO) < 0) {
      LOGGER.error("Amount must be positive");
      return false;
    }
    if (SendAccount == null || ReceiveAccount == null) {
      throw new InvalidBANException("SendAccount or ReceiveAccount is null");
    }
    if (SendAccount.equals(ReceiveAccount)) {
      throw new InvalidOperationTypeException("SendAccount and ReceiveAccount cannot be the same");
    }

    boolean transfer = bankingServices.bankTransfer(ReceiveAccount, SendAccount, amount);
    if (!transfer) {
      // throw new InsufficientBalanceException("Insufficient funds for transfer");
      LOGGER.debug("Insufficient funds for transfer");
      return false;
    }
    LOGGER.debug("Transfer Success!!");
    return true;
  }

  @Produces("application/json")
  @PostMapping("/resetPassword") // Changed from "/BankTransfer" to "/resetPassword"
  public boolean RessetPassword(@RequestParam(value = "mail") String mail,
      @RequestParam(value = "psw") String psw,
      @RequestParam(value = "newPsw") String newPsw) {
    if (mail == null || mail.isEmpty()) {
      LOGGER.error("Error, no mail, enter your mail to connect. psw : {} / {}", psw, newPsw);
      return false;
    }
    boolean reset = bankingServices.RessetPassword(mail, psw, newPsw);
    if (!reset) {
      LOGGER.error("Error resetting password for mail: {}", mail);
      return false;
    }
    return true;
  }

    @POST
  @PostMapping("/sendMail")
  public Map<String, Object> sendMailToUser(
      @RequestParam("to") String to,
      @RequestParam("subject") String subject,
      @RequestParam("text") String body) {
      Map<String, Object> response = new HashMap<>();
      LOGGER.info("Sending mail to: {}, subject: {}, body: {}", to, subject, body);
      
      bankingServices.sendEmail(to, subject, body);

      if (true) {
          response.put("Try Mail Send", true);
          response.put("message", "Mail tes sent to " + to);
      } 
      return response;
  }

  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @PostMapping("/forgottenPsw")
  public boolean forgottenPsw(@RequestParam(value = "mail") String mail)
  {
    LOGGER.info("Forgotten password request for mail: {}", mail);
    if (mail == null || mail.isEmpty()) {
      LOGGER.error("Error, no mail, enter your mail to connect.");
      return false;
    }
    boolean reset = bankingServices.forgottenPsw(mail);
    if (!reset) {
      LOGGER.error("Error resetting password for mail: {}", mail);
      return false;
    }
    return true;
  }  

  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @PostMapping("/PswUpdate")
  public boolean PswUpdate(@RequestParam(value = "mail") String mail,
      @RequestParam(value = "psw") String psw,
      @RequestParam(value = "newPsw") String newPsw)
  {
    LOGGER.info("Forgotten password request for mail: {}", mail);
    if (mail == null || mail.isEmpty() || psw == null || psw.isEmpty() || newPsw == null || newPsw.isEmpty()) {
      LOGGER.error("Error, no mail, enter your mail to connect. psw : {} / {}", psw, newPsw);
      return false;
    }
    boolean reset = bankingServices.RessetPassword(mail, psw, newPsw);
    if (!reset) {
      LOGGER.error("Error resetting password for mail: {}", mail);
      return false;
    }
    sendMailToUser(mail, "reset password", "Your password has been reset successfully. Please log in with your new password.");
    return true;
  }  

@GET
@Consumes("application/json")
@Produces("application/json")
@GetMapping("/seeProfile")
  public Person getProfile(@RequestParam(value = "personId") String personId) {
      LOGGER.info("Get profile request for personId: {}", personId);
      if (personId == null || personId.isEmpty()) {
          LOGGER.error("Error, no personId provided.");
          return null;
      }
      Person person = bankingServices.seeProfileById(personId);
      if (person == null) {
          LOGGER.error("Error retrieving profile for personId: {}", personId);
          return null;
      }
      return person;
  }

  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @PostMapping("/updateProfile")
  public boolean updateProfile(@RequestParam(value = "personId") String personId,
      @RequestParam(value = "name") String name,
      @RequestParam(value = "firstName") String firstName,
      @RequestParam(value = "mail") String mail,
      @RequestParam(value = "psw") String psw,
      @RequestParam(value = "Street") String street,
      @RequestParam(value = "city", required = false) String city,
      @RequestParam(value = "state", required = false) String state,
      @RequestParam(value = "country", required = false) String country,
      @RequestParam(value = "secondaryAddress", required = false) String secondaryAddress
      )
  {
    LOGGER.info("Update profile request for personId: {}", personId);
    if (personId == null || personId.isEmpty()) {
      LOGGER.error("Error, no personId provided.");
      return false;
    }
    Person updatedPerson = bankingServices.updateProfile(personId, name, firstName, 
      mail, psw, street, city, state, country, secondaryAddress);
    if (updatedPerson == null) {
      LOGGER.error("Error updating profile for personId: {}", personId);
      return false;
    }
    return true;
  }

  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @Operation(
    summary = "Update overdraft amount",
    description = "Update the overdraft amount for a given bank account number (ban)",
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      description = "No request body needed, you have to use the required parameters: ban (the bank account number) & newOverdraftAmount (the new overdraft amount)",
      required = false
    ),
    parameters = {
      @Parameter(required = true, description = "Bank Account Number", example = "CAMBYZEBANK-2"),
      @Parameter(required = true, description = "New overdraft amount", example = "500")
    },
    responses = {
      @ApiResponse(description = "true if updated, false otherwise", content = @Content(mediaType = "boolean"))
    }
  )
  @PostMapping("/updateOverdraftAmount")
  public boolean updateOverdraftAmount(
    @RequestParam(value = "ban") String ban,
    @RequestParam(value = "newOverdraftAmount") int newOverdraftAmount) {
    if (ban == null || ban.isEmpty()) {
      LOGGER.error("Error, no ban provided.");
      return false;
    }
    if (newOverdraftAmount < 0) {
      LOGGER.error("Error, newOverdraftAmount must be non-negative.");
      return false;
    }
    boolean updated = bankingServices.updateOverdraft(ban, newOverdraftAmount);
    if (!updated) {
      LOGGER.error("Error updating overdraft amount for ban: {}", ban);
      return false;
    }
    return true;
  }
  
}
