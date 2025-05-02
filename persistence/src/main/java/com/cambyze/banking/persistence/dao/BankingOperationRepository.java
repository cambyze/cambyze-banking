package com.cambyze.banking.persistence.dao;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

// import org.springframework.data.repository.CrudRepository;

import com.cambyze.banking.persistence.model.Operation;

/**
 * CRUD for the entity Bank Account with auto-generated methods
 */
public interface BankingOperationRepository extends MongoRepository<Operation, String> {
  List<Operation> findByAccountId(String accountId);
}
