package com.cambyze.banking.persistence.dao;

import org.springframework.data.repository.CrudRepository;
import com.cambyze.banking.persistence.model.Operation;

/**
 * CRUD for the entity Bank Account with auto-generated methods
 */
public interface BankingOperationRepository extends CrudRepository<Operation, Long> {

  Operation findById(long id);


}
