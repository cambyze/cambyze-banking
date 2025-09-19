import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import colors from '../Constants/colors';

export default function ForgotPsw() {
  const { t } = useTranslation("forgotPsw");
  const navigation = useNavigation();

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useFocusEffect(
      React.useCallback(() => {
        setEmail("");
        setError("");
        setStep(1);
      }, [])
    );

  const handleResetPassword = async () => {
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("http://localhost:8080/forgottenPsw", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ mail: email }).toString(),
      });
      if (res.ok) {
        navigation.navigate("LoginRegister");
      } else {
        setError(t("Échec de la réinitialisation"));
      }
    } catch {
      setError(t("Erreur réseau"));
    } finally {
      setStatus("idle");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#e3eafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {t("title")}
          </Text>

          <Text style={styles.subtitle}>
            {step === 1 && t("description")}

          </Text>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          {step === 1 && (
            <View>
              <TextInput
                style={styles.input}
                placeholder={t("EmailPlaceHolder")}
                placeholderTextColor={colors.textInputPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={status !== "sending"}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  status === "sending" && styles.buttonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  <ActivityIndicator color={colors.activityIndicator} />
                ) : (
                  <Text style={styles.buttonText}>
                    {t("RessetPswButton")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
  

          {step === 2 && (
            <Text style={styles.success}>
              {t("successMessage")}
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundContrast,
    padding: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 20,
    color: colors.midText,
    textAlign: "center",
    fontSize: 15,
  },
  input: {
      width: '100%',
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.textInputBorder,
      borderRadius: 8,
      fontSize: 16,
      color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.buttonBackGround,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.ButtonDisabled,
  },
  buttonText: {
    color: colors.SecondaryButtonText,
    fontWeight: "600",
    fontSize: 15,
  },
  error: {
    color: colors.errorClearText,
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
  },
  success: {
    color: colors.successText,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 16,
  },
});
