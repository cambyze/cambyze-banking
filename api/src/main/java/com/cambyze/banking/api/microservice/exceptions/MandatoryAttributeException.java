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
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MandatoryAttributeException extends RuntimeException {

  private static final long serialVersionUID = 1207691880895021472L;

  /**
   * Exception triggered when a mandatory attribute is missing, typically the reference one which
   * makes the entity unique
   * 
   * @param message text which will be displayed in the response body as the message attribute
   */
  public MandatoryAttributeException(String message) {
    super(message);
  }

  /**
   * Exception triggered when a mandatory attribute is missing, typically the reference one which
   * makes the entity unique
   * 
   * @param entity entity used to build the message
   */
  public MandatoryAttributeException(PersistEntity entity) {
    super("Mandatory attributes are missing for the " + entity.getEntityName());
  }

}

