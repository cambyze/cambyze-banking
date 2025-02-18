package com.cambyze.banking.api.microservice.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import com.cambyze.banking.api.microservice.PersistEntity;


/**
 * Standard exception for microservices
 * 
 * @author Thierry Nestelhut
 * @see <a href="https://github.com/cambyze">cambyze GitHub</a>
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class RecordNotFoundException extends RuntimeException {

  private static final long serialVersionUID = -2136526719851089161L;

  /**
   * Exception triggered when a microservice does not find the requested entity
   * 
   * @param message text which will be displayed in the response body as the message attribute
   */
  public RecordNotFoundException(String message) {
    super(message);
  }

  /**
   * Exception triggered when a microservice does not find the requested entity
   * 
   * @param entity entity used to build the message
   */
  public RecordNotFoundException(PersistEntity entity) {
    super("No existing " + entity.getEntityName() + " for the requested parameters");
  }



}

