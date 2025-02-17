package com.cambyze.banking.persistence.dao;

public interface BaseRepository<D, T> {

  D findWithGraph(T id, String graphName);
}
