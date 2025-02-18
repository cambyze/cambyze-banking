package com.cambyze.banking.api.microservice.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Standard exception for microservices
 * 
 * @author Thierry Nestelhut
 * @see <a href="https://github.com/cambyze">cambyze GitHub</a>
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RequestEntityNullException extends RuntimeException {

  private static final long serialVersionUID = 3260754074087058507L;

  /**
   * Exception triggered when a mandatory attribute is missing, typically the reference one which
   * makes the entity unique
   * 
   * @param message text which will be displayed in the response body as the message attribute
   */
  public RequestEntityNullException(String message) {
    super(message);
  }

  /**
   * Exception triggered when a mandatory attribute is missing, typically the reference one which
   * makes the entity unique
   * 
   * @param entity entity used to build the message
   */
  public RequestEntityNullException() {
    super("The request entity is null");
  }

}

