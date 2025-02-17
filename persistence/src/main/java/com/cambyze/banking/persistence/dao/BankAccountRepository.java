package com.cambyze.banking.persistence.dao;

import org.springframework.data.repository.CrudRepository;
import com.cambyze.banking.persistence.model.Account;

/**
 * CRUD for the entity Bank Account with auto-generated methods
 */
public interface BankAccountRepository
    extends CrudRepository<Account, Long>, BaseRepository<Account, Long> {

  Account findWithGraph(Long id, String graphName);

  Account findById(long id);

  Account findByBankAccountNumber(String bankAccountNumber);

}
