package com.cambyze.banking.services;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ServicesApplicationTests {

  private static final Logger LOGGER = LoggerFactory.getLogger(ServicesApplicationTests.class);

  @Test
  void contextLoads() {
    LOGGER.debug("contextLoads");
  }

  @Autowired
  private BankingServices bankingServices;

  @Test
  void testServices() {
    LOGGER.debug("Test services");
    String ban = bankingServices.createNewBankAccount();
    LOGGER.debug("New BAN : " + ban);
  }
}
