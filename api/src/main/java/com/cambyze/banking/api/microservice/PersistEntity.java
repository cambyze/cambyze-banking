package com.cambyze.banking.api.microservice;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Parent class for persistence entity
 *
 * @author Thierry Nestelhut
 * @see <a href="https://github.com/cambyze">cambyze GitHub</a>
 */
public abstract class PersistEntity {

  public static final int NBDECIMALS = 2;

  @JsonIgnore
  protected String entityName;

  /**
   * Generic constructor to override in inherited classes
   */
  public PersistEntity(String reference) {
    super();
    this.setReference(reference);
  }

  /**
   * Generic constructor to override in inherited classes
   */
  public PersistEntity() {
    super();
  }

  /**
   * Abstract method to implement in inherited classes
   * 
   * @return the name of the entity
   */
  public abstract String getEntityName();

  /**
   * Abstract method to implement in inherited classes
   */
  public abstract long getId();

  /**
   * Abstract method to implement in inherited classes
   */
  public abstract void setId(long id);

  /**
   * Abstract method to implement in inherited classes
   */
  public abstract void setReference(String reference);

  /**
   * Abstract method to implement in inherited classes
   */
  public abstract String getReference();

}
