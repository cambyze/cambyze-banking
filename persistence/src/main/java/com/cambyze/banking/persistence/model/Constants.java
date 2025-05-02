package com.cambyze.banking.persistence.model;

import java.time.LocalDate;

// TODO: Move the constants to a dedicated maven project

/**
 * Constants for the project
 */
public class Constants {

  private Constants() {
    throw new IllegalStateException("Constants class");
  }

  // Attributes of a bank account
  public static final String ACCOUNT_TYPE_BANK = "1";
  public static final String ACCOUNT_TYPE_SAVINGS = "2";
  public static final double SAVINGS_ACCOUNT_LIMIT = 5000.0;
  public static final double OVERDRAFT_AMOUNT = 1500.0;

  // Attributes of a banking operations
  public static final String OPERATION_TYPE_DEPOSIT = "1";
  public static final String OPERATION_TYPE_WITHDRAW = "2";

  // Type of functional errors
  public static final String SERVICE_OK = "0";
  public static final String INVALID_BANK_ACCOUNT = "-1";
  public static final String INVALID_DATE = "-2";
  public static final String INVALID_AMOUNT = "-3";
  public static final String INVALID_OPERATION_TYPE = "-4";
  public static final String BANK_ACCOUNT_NOT_EXISTS = "-5";
  public static final String OVERDRAFT_FORBID_SAVINGS_ACC = "-6";
  public static final String INSUFFICIENT_BALANCE = "-7";
  public static final String SAVINGS_LIMIT_REACHED = "-8";
  public static final String TECHNICAL_ERROR = "-99";

  // Date limits
  public static final LocalDate MIN_OPERATION_DATE = LocalDate.of(1990, 1, 1);
  public static final LocalDate MAX_OPERATION_DATE = LocalDate.of(2500, 1, 1);
}
