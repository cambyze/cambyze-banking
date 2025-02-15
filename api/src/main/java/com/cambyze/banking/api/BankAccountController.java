package com.cambyze.banking.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cambyze.banking.services.BankingServices;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
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
  public String calculateRate() {
    String ban = bankingServices.createNewBankAccount();
    LOGGER.info("New created account: " + ban);
    return ban;
  }

}
