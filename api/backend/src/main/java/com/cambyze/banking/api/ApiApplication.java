package com.cambyze.banking.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * Spring boot application class to deploy in tomcat
 */
@SpringBootApplication(scanBasePackages = {"com.cambyze.banking"})
public class ApiApplication extends SpringBootServletInitializer {
  public static void main(String[] args) {
    SpringApplication.run(ApiApplication.class, args);
  }

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
    return builder.sources(ApiApplication.class);
  }
}
