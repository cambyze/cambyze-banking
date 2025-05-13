package com.cambyze.banking.persistence.dao;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.cambyze.banking.persistence.model.Account;

public interface PersonAccountRepository extends MongoRepository<Account, String> {
  List<Account> findByPersonId(String personId);
}
