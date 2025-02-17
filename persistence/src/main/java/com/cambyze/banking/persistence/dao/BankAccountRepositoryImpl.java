package com.cambyze.banking.persistence.dao;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Repository;
import com.cambyze.banking.persistence.model.Account;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

/**
 * CRUD for the entity Bank Account with auto-generated methods
 */
@Repository
public class BankAccountRepositoryImpl implements BaseRepository<Account, Long> {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Account findWithGraph(Long id, String graphName) {

    jakarta.persistence.EntityGraph<?> entityGraph = entityManager.getEntityGraph(graphName);
    Map<String, Object> properties = new HashMap<>();
    properties.put("javax.persistence.fetchgraph", entityGraph);
    Account ba = entityManager.find(Account.class, id, properties);

    return ba;
  }

}
