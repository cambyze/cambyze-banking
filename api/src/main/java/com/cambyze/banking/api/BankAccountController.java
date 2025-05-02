package com.cambyze.banking.api;

import java.math.BigDecimal;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.cambyze.banking.persistence.model.Constants;
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

  public BankAccountController() {
    super();
  }

  @Autowired
  private BankingServices bankingServices;

  @POST
  @Consumes("application/json")
  @Produces("application/json")
  @Operation(summary = "Create a bank account",
      description = "Create a bank account and return its bank account number",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "No request body needed", required = false,
          content = @Content(mediaType = "application/json",
              contentSchema = @Schema(implementation = String.class))),
      responses = {@ApiResponse(description = "The new bank account number",
          content = @Content(mediaType = "String"))})

  @Path("/createBankAccount")
  @PostMapping("/createBankAccount")
  public String createBankAccount() {
    String ban = bankingServices.createNewBankAccount();
    if (ban != null && !ban.isEmpty()) {
      LOGGER.info("New created account: " + ban);
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
      responses = {@ApiResponse(description = "The new bank account number",
          content = @Content(mediaType = "String"))})

  @Path("/createSavingsAccount")
  @PostMapping("/createSavingsAccount")
  public String createSavingsAccount() {
    String ban = bankingServices.createNewSavingsAccount();
    if (ban != null && !ban.isEmpty()) {
      LOGGER.info("New created savings account: " + ban);
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
  @Path("/createDeposit")
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
        && createDepositResponse.getReturnCode() == Constants.SERVICE_OK) {
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
  @Path("/createWithdraw")
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
        && createWithdrawResponse.getReturnCode() == Constants.SERVICE_OK) {
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
  @Path("/requestOverdraft")
  @PostMapping("/requestOverdraft")
  public BigDecimal requestOverdraft(@RequestParam(value = "ban") String ban) {

    AskOverdraftResponse askOverdraftResponse = bankingServices.askOverdraft(ban);
    if (askOverdraftResponse != null && askOverdraftResponse.getOverdraftAmount() != null
        && askOverdraftResponse.getReturnCode() == Constants.SERVICE_OK) {
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

}
