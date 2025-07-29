// package com.cambyze.banking.api.javaMail;
package com.cambyze.banking.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import javax.ws.rs.core.MediaType;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

@SpringBootTest
@AutoConfigureMockMvc
class ApiApplicationTests {

  private static final Logger LOGGER = LoggerFactory.getLogger(ApiApplicationTests.class);

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testCreatePerson() throws Exception {
    String name = "Jack";
    String firstName = "Onils";
    String mail = "Jack.Onils@mail.com";
    String psw = "psw";
    String adress = "adress";
    LOGGER.debug("--|Person|--");
    // test creation of new "person"
    mockMvc.perform(post("/createPerson")
            .param("name", name)
            .param("firstName", firstName)
            .param("mail", mail)
            .param("psw", psw)
            .param("adress", adress))
            .andExpect(status().isOk());

    String personId = "CLI-00000001";
    // test creation of a saving account
    mockMvc.perform(post("/createSavingsAccount").param("personId", personId)
        .contentType(MediaType.APPLICATION_JSON).content(""))
        .andExpect(status().isOk());
    // test creation of new bank account
    mockMvc.perform(post("/createBankAccount").param("personId", personId)
        .contentType(MediaType.APPLICATION_JSON).content(""))
        .andExpect(status().isOk());

    // test deposit operation with BigDecimal
    mockMvc.perform(post("/createDeposit")
        .param("ban", "CAMBYZEBANK-00000001")
        .param("amount", "123.45") // Remplacer la virgule par un point
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());

    // test login
    mockMvc.perform(post("/login").param("mail", mail)
        .contentType(MediaType.APPLICATION_JSON).content(""))
        .andExpect(status().isOk());

    mockMvc.perform(post("/login").param("mail", "falseMail")
        .contentType(MediaType.APPLICATION_JSON).content(""))
        .andExpect(status().isOk());
    // test return all bank accounts
    mockMvc.perform(get("/findBanByPerson").param("personId", personId)
        .contentType(MediaType.APPLICATION_JSON).content(""))
        .andExpect(status().isOk());
    mockMvc.perform(get("/findBanByPerson").param("personId", "falseID")
        .contentType(MediaType.APPLICATION_JSON).content(""))
        .andExpect(status().isOk());
  }

  @Test
  void testOperations() throws Exception {
    // test with bank account creation
    String id = "CLI-00000001";
    mockMvc.perform(post("/createBankAccount").param("personId", id)).andExpect(status().isOk());
    // Test createDeposit without parameters
    String ban = "";
    String amount = "";
    mockMvc.perform(post("/createDeposit").param("ban", ban).param("amount", amount))
        .andExpect(status().isInternalServerError());

    // Test createDeposit invalid parameters
    ban = "???";
    amount = "???";
    mockMvc.perform(post("/createDeposit").param("ban", ban).param("amount", amount))
        .andExpect(status().isInternalServerError());


    // Test createDeposit with unknown BAN
    ban = "????";
    amount = "120.0";
    mockMvc.perform(post("/createDeposit").param("ban", ban).param("amount", amount))
        .andExpect(status().isNotFound());

    // Test createDeposit with negative amount
    ban = "CAMBYZEBANK-00000001";
    amount = "-120.0";

    mockMvc.perform(post("/createDeposit").param("ban", ban).param("amount", amount))
        .andExpect(status().isBadRequest());

    // Successful test - we assume that the BAN "CAMBYZEBANK-00000001" exists
    ban = "CAMBYZEBANK-00000001";
    amount = "120.0";
    LOGGER.debug("We assume that at least the BAN {} exists ", ban);

    mockMvc.perform(post("/createDeposit").param("ban", ban).param("amount", amount))
        .andExpect(status().isOk());

    // Successful test - we assume that the BAN "CAMBYZEBANK-00000001" exists
    ban = "CAMBYZEBANK-00000001";
    amount = "100.0";
    LOGGER.debug("Withdraw on the BAN {}", ban);

    mockMvc.perform(post("/createDeposit").param("ban", ban).param("amount", amount))
        .andExpect(status().isOk());

    // Successful test - we assume that the BAN "CAMBYZEBANK-00000001" exists
    ban = "CAMBYZEBANK-00000001";
    LOGGER.debug("Overdraft for the {} ", ban);

    mockMvc.perform(post("/requestOverdraft").param("ban", ban)).andExpect(status().isOk());

    // Successful test - we assume that the BAN "CAMBYZEBANK-00000001" exists
    ban = "CAMBYZEBANK-00000001";
    LOGGER.debug("Bank statement for the  {}", ban);

    mockMvc.perform(get("/monthlyBankStatement")
        .param("ban", ban))
        .andExpect(status().isOk());

// test find bank account by person ID
    String personId = "CLI-00000001";
    mockMvc.perform(get("/findBanByPerson").param("personId", personId)
        .contentType(MediaType.APPLICATION_JSON).content("")).andExpect(status().isOk());

// test login with valid credentials
    mockMvc.perform(post("/login2").param("mail", "Jack.Onils@mail.com").param("psw", "psw")
        .contentType(MediaType.APPLICATION_JSON).content("")).andExpect(status().isOk());
    
    String sendAccount = "CAMBYZEBANK-00000001";
    String receiveAccount = "CAMBYZEBANK-00000002";
    String SendAccount2 = "CAMBYZEBANK-00000003";
    BigDecimal testAmount = new BigDecimal("79");
    LOGGER.debug("Bank transfer from {} to {} with amount {}", sendAccount, receiveAccount, testAmount);    

    // test bank transfer with valid parameters
    mockMvc.perform(post("/BankTransfer")
    .param("SendAccount", sendAccount)
    .param("ReceiveAccount", receiveAccount)
    .param("amount", testAmount.toString()))
    .andExpect(status().isOk());
    
     // test bank transfer with invalid parameters
    // LOGGER.debug("Bank Transfer 2");
    // mockMvc.perform(post("/BankTransfer")
    //     .param("amount", "90000000")
    //     .param("SendAccount", SendAccount2)
    //     .param("ReceiveAccount", receiveAccount))
    //     .andExpect(status().isBadRequest());

    MvcResult result = mockMvc.perform(post("/BankTransfer")
        .param("amount", "90000000")
        .param("SendAccount", SendAccount2)
        .param("ReceiveAccount", receiveAccount))
        .andReturn();
    LOGGER.debug("Response status: {}", result.getResponse().getStatus());
    LOGGER.debug("Response content: {}", result.getResponse().getContentAsString());

    LOGGER.debug("Resset password 1");
    mockMvc.perform(post("/resetPassword")
        .param("mail", "receiver@test.com")
        .param("psw", "psw")
        .param("newPsw", "newPsw"))
        .andExpect(status().isOk());
    
    LOGGER.debug("Resset password 2");
     result = mockMvc.perform(post("/resetPassword")
        .param("mail", "receiver@test.com")
        .param("psw", "badPsw")
        .param("newPsw", "newPsw"))
        .andExpect(status().isOk())
        .andReturn();
    
    String responseContent = result.getResponse().getContentAsString();
        assertEquals("false", responseContent);

    LOGGER.debug("Response psw2 status: {}", result.getResponse().getStatus());
    LOGGER.debug("Response psw2 content: {}", responseContent);
    

    LOGGER.debug("forgotten password 1");
    mockMvc.perform(post("/forgottenPsw")
        .param("mail", "receiver@test.com")
        .param("psw", "oldPassword")
        .param("newPsw", "newPassword"))
        .andExpect(status().isOk());

    LOGGER.debug("forgotten password 2");
    result = mockMvc.perform(post("/forgottenPsw")
        .param("mail", "badMail@test.com")
        .param("psw", "oldPassword")
        .param("newPsw", "newPassword"))
        // .andExpect(status().isBadRequest())
        .andReturn();

    responseContent = result.getResponse().getContentAsString();
        assertEquals("false", responseContent);
    LOGGER.debug("Response status: forgotten psw {}", result.getResponse().getStatus());
    LOGGER.debug("Response content: forgotten psw {}", result.getResponse().getContentAsString());

    // test send mail
    mockMvc.perform(post("/sendMail")
        .param("to", "mailtestdev11@gmail.com")
        .param("subject", "Bank API Test")
        .param("text", "Test send mail Banckend API"));
    LOGGER.debug("Back send mail end");  
  }
    @Test
    void testSendMail() throws Exception {
        mockMvc.perform(post("/sendMail")
            .param("to", "mailpr0ed0uard@gmail.com")
            .param("subject", "Back Bank API Test")
            .param("text", "Test send mail Banckend API"));
    }

}