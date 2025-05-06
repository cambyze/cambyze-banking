package com.cambyze.banking.persistence.services;

import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import com.cambyze.banking.persistence.model.Counter;

@Service
public class SequenceGeneratorService {

  private final MongoTemplate mongoTemplate;

  public SequenceGeneratorService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public long getNextSequence(String key) {
    Counter counter = mongoTemplate.findAndModify(Query.query(Criteria.where("_id").is(key)),
        new Update().inc("seq", 1), FindAndModifyOptions.options().returnNew(true).upsert(true),
        Counter.class);

    if (counter == null) {
      throw new IllegalStateException("Failed to generate sequence for key: " + key);
    }
    return counter.getSeq();
  }
}
