package com.cambyze.banking.api.microservice.exceptions;

public class EntityPreparationException extends RuntimeException {
  private static final long serialVersionUID = 1L;

  public EntityPreparationException(String msg) {
    super(msg);
  }

  public EntityPreparationException(String message, Throwable cause) {
    super(message, cause);
  }
}
