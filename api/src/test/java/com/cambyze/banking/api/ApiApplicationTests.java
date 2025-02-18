package com.cambyze.banking.api;

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
public class ApiApplicationTests {

  private static final Logger LOGGER = LoggerFactory.getLogger(ApiApplicationTests.class);

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testCreateNewBAN() throws Exception {
    mockMvc.perform(post("/createBankAccount").contentType(MediaType.APPLICATION_JSON).content(""))
        .andExpect(status().isOk());
  }

  @Test
  public void testCreateDeposits() throws Exception {
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
    ban = "CAMBYZEBANK-1";
    amount = "-120.0";
    mockMvc.perform(post("/createDeposit").param("ban", ban).param("amount", amount))
        .andExpect(status().isBadRequest());

    // Successful test - we assume that the BAN "CAMBYZEBANK-1" exists
    ban = "CAMBYZEBANK-1";
    amount = "120.0";
    LOGGER.debug("We assume that at least the BAN " + ban + " exists");
    mockMvc.perform(post("/createDeposit").param("ban", ban).param("amount", amount))
        .andExpect(status().isOk());

  }

}
