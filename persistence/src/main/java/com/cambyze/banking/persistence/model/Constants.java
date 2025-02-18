package com.cambyze.banking.persistence.model;

/**
 * Constants for the project
 */
public class Constants {
  // Attributes of a bank account
  public static final int ACCOUNT_TYPE_BANK = 1;
  public static final int ACCOUNT_TYPE_SAVINGS = 2;
  // Attributes of a banking operations
  public static final int OPERATION_TYPE_DEPOSIT = 1;
  public static final int OPERATION_TYPE_WITHDRAW = 2;
  // Type of functional errors
  public static final int SERVICE_OK = 0;
  public static final int INVALID_BANK_ACCOUNT = -1;
  public static final int INVALID_DATE = -2;
  public static final int INVALID_AMOUNT = -3;
  public static final int INVALID_OPERATION_TYPE = -4;
  public static final int BANK_ACCOUNT_NOT_EXISTS = -5;
  public static final int OVERDRAFT_FORBID_SAVINGS_ACC = -6;
  public static final int TECHNICAL_ERROR = -99;
}
