package com.cambyze.banking.persistence.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.cambyze.banking.persistence.model.Account;

/**
 * CRUD for the entity Bank Account with auto-generated methods
 */
public interface BankAccountRepository extends MongoRepository<Account, String> {

}
