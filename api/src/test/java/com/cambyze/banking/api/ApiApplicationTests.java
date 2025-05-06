package com.cambyze.banking.api;

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

@SpringBootTest
@AutoConfigureMockMvc
class ApiApplicationTests {

  private static final Logger LOGGER = LoggerFactory.getLogger(ApiApplicationTests.class);

  @Autowired
  private MockMvc mockMvc;

  @Test
  void testCreateNewBAN() throws Exception {
    mockMvc.perform(post("/createBankAccount").contentType(MediaType.APPLICATION_JSON).content(""))
        .andExpect(status().isOk());

    mockMvc
        .perform(post("/createSavingsAccount").contentType(MediaType.APPLICATION_JSON).content(""))
        .andExpect(status().isOk());

  }

  @Test
  void testOperations() throws Exception {
    // test with bank account creation
    mockMvc.perform(post("/createBankAccount")).andExpect(status().isOk());

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

    mockMvc.perform(get("/monthlyBankStatement").param("ban", ban)).andExpect(status().isOk());

  }

}
