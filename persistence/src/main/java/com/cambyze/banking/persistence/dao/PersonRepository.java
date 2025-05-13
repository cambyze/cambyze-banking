package com.cambyze.banking.persistence.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.cambyze.banking.persistence.model.Person;

/**
 * CRUD for the entity Person with auto-generated methods
 */
public interface PersonRepository extends MongoRepository<Person, String> {
  Person findByIdIgnoreCase(String id);
}
