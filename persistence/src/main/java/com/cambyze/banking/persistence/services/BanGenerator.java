package com.cambyze.banking.persistence.services;

import java.math.BigInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BanGenerator {
    private static final Logger LOGGER = LoggerFactory.getLogger(BanGenerator.class);
    private final SequenceGeneratorService sequenceGenerator;

    private static final String COUNTRY_CODE = "FR";
    private static final String CODE_BANQUE = "99999";
    private static final String CODE_GUICHET = "00010"; 

    public BanGenerator(SequenceGeneratorService sequenceGenerator) {
        this.sequenceGenerator = sequenceGenerator;
    }

    public String generateNewBan() {
        Long counter = sequenceGenerator.getNextSequence("person");

        String accountNumber = manageAccountNumber(counter);     
        String ribKey = generateRibKey(accountNumber);
        String ibanKey = generateIbanKey(accountNumber, ribKey);
        LOGGER.debug("Generated BAN: {}-{}-{}-{}-{}-{}", COUNTRY_CODE, ibanKey, CODE_BANQUE, CODE_GUICHET, accountNumber, ribKey);
        return COUNTRY_CODE + ibanKey + CODE_BANQUE + CODE_GUICHET + accountNumber + ribKey;
    }

    private String manageAccountNumber(Long counter) {
        String base36 = Long.toString(counter, 36).toUpperCase();
        return String.format("%11s", base36).replace(' ', '0');
    }


    // private String generateRibKey(String accountNumber) {
    //     String input = CODE_BANQUE + CODE_GUICHET + accountNumber;
    //     StringBuilder numericString = new StringBuilder();

    //     for (char ch : input.toCharArray()) {
    //         if (Character.isDigit(ch)) {
    //             numericString.append(ch);
    //         } else if (Character.isLetter(ch)) {
    //             numericString.append((int) ch - 'A' + 10);
    //         }
    //     }

    //     BigInteger numericValue = new BigInteger(numericString.toString());
    //     long key = 97 - (numericValue.mod(BigInteger.valueOf(97)).longValue());
    //     return String.format("%02d", key);
    // }

    private String generateRibKey(String accountNumber) {
        StringBuilder full = new StringBuilder(CODE_BANQUE)
            .append(CODE_GUICHET)
            .append(accountNumber);

        StringBuilder numericString = new StringBuilder();

        for (char ch : full.toString().toCharArray()) {
            if (Character.isDigit(ch)) {
                numericString.append(ch);
            } else if (Character.isLetter(ch)) {
                numericString.append(Character.toUpperCase(ch) - 'A' + 10);
            } else {
                throw new IllegalArgumentException("Invalid character in RIB: " + ch);
            }
        }

        BigInteger numericValue = new BigInteger(numericString.toString());
        long key = 97 - (numericValue.mod(BigInteger.valueOf(97)).longValue());
        return String.format("%02d", key);
    }


    private String generateIbanKey(String accountNumber, String ribKey) {
        String bban = CODE_BANQUE + CODE_GUICHET + accountNumber + ribKey;
        String rearranged = bban + COUNTRY_CODE + "00";
        BigInteger numericRepresentation = convertToNumber(rearranged);
        long mod97 = numericRepresentation.mod(BigInteger.valueOf(97)).longValue();
        long checkDigits = 98 - mod97;
        return String.format("%02d", checkDigits);
    }

    private BigInteger convertToNumber(String input) {
        StringBuilder numericString = new StringBuilder();
        for (char ch : input.toCharArray()) {
            if (Character.isDigit(ch)) {
                numericString.append(ch);
            } else if (Character.isLetter(ch)) {
                int value = Character.toUpperCase(ch) - 'A' + 10;
                numericString.append(value);
            }
        }
        return new BigInteger(numericString.toString());
    }

    public boolean isValidIban(String iban) {
        if (iban == null || iban.length() != 27) {
            return false;
        }
        String rearranged = iban.substring(4) + iban.substring(0, 4);
        BigInteger numeric = convertToNumber(rearranged);
        return numeric.mod(BigInteger.valueOf(97)).intValue() == 1;
    }
}


// public class BanGenerator {

//     private final SequenceGeneratorService sequenceGenerator;

//     private static final String COUNTRY_CODE = "FR";
//     private static final String CODE_BANQUE = "9999";
//     private static final String CODE_GUICHET = "0001";

//     public BanGenerator(SequenceGeneratorService sequenceGenerator) {
//         this.sequenceGenerator = sequenceGenerator;
//     }

//     public String generateNewBan() {
//         Long counter = sequenceGenerator.getNextSequence("person");

//         String accountNumber = manageAccountNumber(counter);
//         String ribKey = generateRibKey(accountNumber);
//         String ibanKey = generateIbanKey(accountNumber, ribKey);
        
//         return COUNTRY_CODE + ibanKey + CODE_BANQUE + CODE_GUICHET + accountNumber + ribKey;
//     }

//     private String manageAccountNumber(Long counter) {
//         String base36 = Long.toString(counter, 36).toUpperCase();
//         return String.format("%11s", base36).replace(' ', '0');
//     }

//     // private String generateRibKey(String accountNumber) {
//     //     String full = CODE_BANQUE + CODE_GUICHET + accountNumber;
//     //     BigInteger number = new BigInteger(full.replaceAll("[^0-9]", ""));
//     //     long key = 97 - (number.mod(BigInteger.valueOf(97)).longValue());
//     //     return String.format("%02d", key);
//     // }
//     private String generateRibKey(String accountNumber) {
//         String input = CODE_BANQUE + CODE_GUICHET + accountNumber;
//         StringBuilder numericString = new StringBuilder();

//         for (char ch : input.toCharArray()) {
//             if (Character.isDigit(ch)) {
//                 numericString.append(ch);
//             } else if (Character.isLetter(ch)) {
//                 numericString.append((int) ch - 'A' + 10);
//             }
//         }
//         BigInteger numericValue = new BigInteger(numericString.toString());
//         long key = 97 - (numericValue.mod(BigInteger.valueOf(97)).longValue());
//         return String.format("%02d", key);
//     }

//     private String generateIbanKey(String accountNumber, String ribKey) {
//         String bban = CODE_BANQUE + CODE_GUICHET + accountNumber + ribKey;
//         String rearranged = bban + COUNTRY_CODE + "00";
//         BigInteger numericRepresentation = convertToNumber(rearranged);
//         long mod97 = numericRepresentation.mod(BigInteger.valueOf(97)).longValue();
//         long checkDigits = 98 - mod97;
//         return String.format("%02d", checkDigits);
//     }
//     // private String generateIbanKey(String accountNumber, String ribKey) {
//     //     String bban = CODE_BANQUE + CODE_GUICHET + accountNumber + ribKey;
//     //     String rearranged = bban + COUNTRY_CODE + "00";
//     //     BigInteger numericRepresentation = convertToNumber(rearranged);
//     //     long mod97 = numericRepresentation.mod(BigInteger.valueOf(97)).longValue();
//     //     long checkDigits = 98 - mod97;
//     //     return String.format("%02d", checkDigits);
//     // }

//     private BigInteger convertToNumber(String input) {
//         StringBuilder numericString = new StringBuilder();
//         for (char ch : input.toCharArray()) {
//             if (Character.isDigit(ch)) {
//                 numericString.append(ch);
//             } else if (Character.isLetter(ch)) {
//                 int value = Character.toUpperCase(ch) - 'A' + 10;
//                 numericString.append(value);
//             }
//         }
//         return new BigInteger(numericString.toString());
//     }
// }

// // package com.cambyze.banking.persistence.services;

// // import java.math.BigInteger;

// // public class BanGenerator {
    
// //     private final SequenceGeneratorService sequenceGenerator;

// //     private static final String COUNTRY_CODE = "FR";
// //     private static final String CODE_BANQUE = "9999";
// //     private static final String CODE_GUICHET = "0001";

// //     public BanGenerator(SequenceGeneratorService sequenceGenerator) {
// //         this.sequenceGenerator = sequenceGenerator;
// //     }

// //     public String generateNewBan(){
// //         Long counter = sequenceGenerator.getNextSequence("person");

// //         String accountNumber = manageAccountNumber(counter);
// //         String ribKey = manageRibKey(counter);
// //         String ibanKey = ibanKey(counter, accountNumber);

// //         return COUNTRY_CODE + ibanKey +  CODE_BANQUE + CODE_GUICHET + accountNumber + ribKey;
// //     }

// //     private String manageAccountNumber(Long counter) {
// //         String base36 = manageBase36(counter);
// //         return String.format("%011s", base36).replace(' ', '0');
// //     }

// //     private String manageBase36(long counter) {
// //     return Long.toString(counter, 36).toUpperCase();
// //     }
// //     private String manageRibKey(Long counter) {
// //         BigInteger code = BigInteger.valueOf(Long.parseLong(CODE_BANQUE + CODE_GUICHET + counter));
// //         long res = 97 - (code.mod(BigInteger.valueOf(97)).longValue());
// //         return String.format("%02d", res);
// //     }

// //     private String ibanKey(Long counter, String accountNumber) {
// //         String bban = CODE_BANQUE + CODE_GUICHET + accountNumber;
// //         String rearranged = bban + COUNTRY_CODE + "00";
// //         BigInteger numericRepresentation = convertToNumber(rearranged);
// //         long mod97 = numericRepresentation.mod(BigInteger.valueOf(97)).longValue();
// //         long checkDigits = 98 - mod97;
// //         return String.format("%02d", checkDigits);
// //     }

// //     private BigInteger convertToNumber(String input) {
// //         StringBuilder numericString = new StringBuilder();
// //         for (char ch : input.toCharArray()) {
// //             if (Character.isDigit(ch)) {
// //                 numericString.append(ch);
// //             } else if (Character.isLetter(ch)) {
// //                 int value = Character.toUpperCase(ch) - 'A' + 10;
// //                 numericString.append(value);
// //             }
// //         }
// //         return new BigInteger(numericString.toString());
// //     }
// // }

