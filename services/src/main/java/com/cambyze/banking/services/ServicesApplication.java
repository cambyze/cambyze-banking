package com.cambyze.banking.services;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.cambyze.banking"})
public class ServicesApplication {

  public static void main(String[] args) {
    SpringApplication.run(ServicesApplication.class, args);
  }

}
