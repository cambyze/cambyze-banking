package com.cambyze.banking.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    mockMvc.perform(post("/createBankAccount").contentType(MediaType.APPLICATION_JSON).content(""));
  }

  @Test
  public void testCreateDeposits() throws Exception {
    mockMvc.perform(post("/createBankAccount").contentType(MediaType.APPLICATION_JSON).content(""));
    String ban = "CAMBYZEBANK-1";
    String amount = "120.0";
    LOGGER.debug("We assume that at lease the BAN " + ban + " exists");
    mockMvc.perform(post("/createDeposit").param("ban", ban).param("amount", amount)
        .contentType(MediaType.APPLICATION_JSON).content(""));

  }

}
