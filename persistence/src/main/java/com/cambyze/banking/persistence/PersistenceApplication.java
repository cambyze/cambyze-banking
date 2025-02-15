package com.cambyze.banking.persistence;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.cambyze.banking"})
public class PersistenceApplication {

  public static void main(String[] args) {
    SpringApplication.run(PersistenceApplication.class, args);
  }

}
