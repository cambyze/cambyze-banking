package com.cambyze.banking.persistence.dao;

import org.springframework.data.repository.CrudRepository;
import com.cambyze.banking.persistence.model.BankAccount;

/*
 * Auto-generated CRUD for the entity Bank Account
 */
public interface BankAccountRepository extends CrudRepository<BankAccount, Long> {

  BankAccount findById(long id);

  BankAccount findByBankAccountNumber(String bankAccountNumber);

}
