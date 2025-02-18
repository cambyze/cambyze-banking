package com.cambyze.banking.services.tools;


import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Mathematics tools
 * 
 * @author Thierry Nestelhut
 * @see <a href="https://github.com/cambyze">cambyze GitHub</a>
 */
public class MathTools {

  private static final Logger LOGGER = LoggerFactory.getLogger(MathTools.class);

  /**
   * Round a Double with n decimals to be used typically for amounts as EUR with 2 decimals
   * <p>
   * Rounding mode to round towards "nearest neighbour" unless both neighbours are equidistant, in
   * which case round up.
   * 
   * @param number number or amount to be rounded
   * @param decimals number of decimals used to round the number
   * @return rounded number
   */
  public static Double roundWithDecimals(Double number, int decimals) {
    if (number != null && decimals > 0) {
      String decPattern = "";
      for (int i = 0; i < decimals; i++) {
        decPattern += '0';
      }
      // locale ENGLISH to force the number format to allow the Double.valueof() at the end
      DecimalFormat df =
          new DecimalFormat("0." + decPattern, new DecimalFormatSymbols(Locale.ENGLISH));
      // to round to the nearest decimal
      df.setRoundingMode(RoundingMode.HALF_UP);
      String stringValue = df.format(number);
      LOGGER.debug(stringValue);
      return Double.valueOf(stringValue);
    } else {
      return null;
    }
  }

}
