package com.cambyze.banking.api.microservice;

import org.springframework.data.repository.NoRepositoryBean;


/**
 * Interface for persistence entity DAO
 * 
 * @author Thierry Nestelhut
 * @see <a href="https://github.com/cambyze">cambyze GitHub</a>
 */
@NoRepositoryBean
public interface PersistEntityDao<T extends PersistEntity> {

  /**
   * find a persistence entity with its reference
   * 
   * @param reference reference of the entity
   * @return an entity
   */
  public T findByReference(String reference);

}
