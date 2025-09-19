import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../App";
import { useTranslation } from "react-i18next";
import colors from "../Constants/colors";
import Map from "./Map"; // Import Map component
// import AddressModal from "./OpenStreetMap"; // Désactivé (commenté)
import { useFocusEffect } from "@react-navigation/native";

export default function LoginRegisterSelect() {
  const { t } = useTranslation("loginRegister");
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [MapSelected, setMapSelected] = useState(false);

  // login / register
  const [selected, setSelected] = useState("register");
  const [status, setStatus] = useState("idle");
  const [passwordError, setPasswordError] = useState("");

  //  Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerCheckPassword, setRegisterCheckPassword] = useState("");
  const [address, setAddress] = useState("");

// reset form on change screen
  useFocusEffect( React.useCallback(() => {
      setLoginEmail("");
      setLoginPassword("");
      setRegisterFirstName("");
      setRegisterLastName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterCheckPassword("");
      setAddress("");
      setStatus("idle");
      setPasswordError("");
      setSelected("register");
    }, [])
  );

  const handleSubmitLogin = async ({ email, password }) => {
    setStatus("authenticating");
    try {
      const res = await fetch("http://localhost:8080/login2", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ mail: email, psw: password }).toString(),
      });
      console.log("Trying to fetch:", `http://localhost:8080/login2?mail=ccolomb@mail.com&psw=psw`);

      if (!res.ok) throw new Error(await res.text());
      const success = await res.json();
      if (!success) throw new Error("Email non reconnu");
      console.log("Login successful:", success, success.personId, success.mail, success.firstName, success.lastName);
      if (success.authenticated === false){ 
        console.log("Login failed: ");
        throw new Error("Mot de passe incorrect");
      }
      console.log("Login successful:", success , success.personId, success.mail, success.firstName, success.lastName);
      login({
        mail: success.mail,
        firstName: success.firstName,
        lastName: success.lastName,
        personId: success.personId,
      });
      setStatus("authenticated");
      navigation.navigate("Account");
    } catch (err) {
      console.error("Login error", err);
      setStatus("error");
    }
  };

  const handleSubmitRegister = async ({ firstName, lastName, email, password, checkPassword }) => {
    setStatus("registering");
    setPasswordError("");

    if (password !== checkPassword) {
      setPasswordError(t("Passwords_Do_Not_Match"));
      setStatus("idle");
      return;
    }
    if (!firstName || !lastName || !email || !password || !checkPassword) {
      setPasswordError(t("All_Fields_Are_Required"));
      setStatus("idle");
      return;
    }

    try {
      const ipAdress = "localhost:8080";
      const res = await 
      fetch("http://" + ipAdress + "/createPerson", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          firstName,
          name: lastName,
          mail: email,
          psw: password,
          adress: address,
        }).toString(),
      });

      if (!res.ok) throw new Error(await res.text());
      const personId = await res.text();
      if (!personId) throw new Error("Échec de la création du compte");

      login({
        email,
        firstName,
        lastName,
        personId,
      });
      setStatus("registered");
      navigation.navigate("Account");
    } catch (err) {
      console.error("Register error", err);
      setStatus("error");
    }
  };

  const renderLogin = () => (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder={t("Login_Form_Email")}
        placeholderTextColor={colors.textInputPlaceholder}
        value={loginEmail}
        onChangeText={setLoginEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t("Login_Form_Password")}
        placeholderTextColor={colors.textInputPlaceholder}
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
      />
      {status === "error" && (
        <Text style={styles.error}>{t("Connection_Failed")}</Text>
      )}
      <TouchableOpacity
        style={[styles.button, status === "authenticating" && styles.buttonDisabled]}
        onPress={() =>
          handleSubmitLogin({ email: loginEmail, password: loginPassword })
        }
        disabled={status === "authenticating"}
      >
        <Text style={styles.buttonText}>
          {status === "authenticating"
            ? t("Login_Form_Button_Status_pending")
            : t("Login_Form_Button_Status_Connecting")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPsw")}>
        <Text style={styles.link}>
          {t("Login_Form_Forget_Password")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRegister = () => (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder={t("Register_Form_Family_Name")}
        placeholderTextColor={colors.textInputPlaceholder}
        value={registerLastName}
        onChangeText={setRegisterLastName}
      />
      <TextInput
        style={styles.input}
        placeholder={t("Register_Form_First_Name")}
        placeholderTextColor={colors.textInputPlaceholder}
        value={registerFirstName}
        onChangeText={setRegisterFirstName}
      />
      {/* AddressModal désactivé */}
      <TextInput
        style={styles.input}
        placeholder={t("Register_Form_Email")}
        placeholderTextColor={colors.textInputPlaceholder}
        value={registerEmail}
        onChangeText={setRegisterEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t("Register_Form_Password")}
        placeholderTextColor={colors.textInputPlaceholder}
        value={registerPassword}
        onChangeText={setRegisterPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder={t("Register_Form_Password")}
        placeholderTextColor={colors.textInputPlaceholder}
        value={registerCheckPassword}
        onChangeText={setRegisterCheckPassword}
        secureTextEntry
      />
      <Text style={styles.footerText}>
        {address !== "" ? t("selected_address") : t("No_Address_Selected")} {address}
      </Text>
      {/* --------------------------------------- */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setMapSelected(!MapSelected)}
              >
                <Text style={styles.secondaryButtonText}>{t("openMap")}</Text>
              </TouchableOpacity>
      {passwordError !== "" && (
        <Text style={styles.error}>{passwordError}</Text>
      )}
      {status === "error" && (
        <Text style={styles.error}>{t("Inscription_Failed")}</Text>
      )}
      <TouchableOpacity
        style={[styles.button, status === "registering" && styles.buttonDisabled]}
        onPress={() =>
          handleSubmitRegister({
            firstName: registerFirstName,
            lastName: registerLastName,
            email: registerEmail,
            password: registerPassword,
            checkPassword: registerCheckPassword,
          })
        }
        disabled={status === "registering"}
      >
        <Text style={styles.buttonText}>
          {status === "registering"
            ? t("Register_Form_Button_Status_pending")
            : t("Register_Form_Button_Status_Connecting")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{t("Entreprise_Name")}</Text>
      <Text style={styles.subHeader}>
        {selected === "login"
          ? t("Login_Title")
          : t("Register_Title")}
      </Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setSelected("register")}
          style={[
            styles.toggle,
            selected === "register" && styles.toggleSelectedRegister,
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              selected === "register" && styles.toggleTextSelected,
            ]}
          >
            {t("Register_Button")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelected("login")}
          style={[
            styles.toggle,
            selected === "login" && styles.toggleSelectedLogin,
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              selected === "login" && styles.toggleTextSelected,
            ]}
          >
            {t("Login_Button")}
          </Text>
        </TouchableOpacity>
      </View>

      {selected === "login" ? renderLogin() : renderRegister()}

      <Text style={styles.footerText}>
        {t("Condition_Of_Use.prefix")}{" "}
        <Text style={styles.link}>
          {t("Condition_Of_Use.terms")}
        </Text>{" "}
        {t("Condition_Of_Use.and")}{" "}
        <Text style={styles.link}>
          {t("Condition_Of_Use.privacy")}
        </Text>

      </Text>

      <Map isOpen={MapSelected} onClose={() => setMapSelected(false)} onAddressChange={setAddress} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    //backgroundColor: "#e3eafc",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 18,
    color: colors.subHeaderText,
    marginBottom: 20,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  toggle: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
  },
  toggleSelectedRegister: {
    backgroundColor: colors.toogleBackground,
    borderColor: colors.toogleBorder,
  },
  toggleSelectedLogin: {
    backgroundColor: colors.toogleBackground,
    borderColor: colors.toogleBorder,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.toggleText,
  },
  toggleTextSelected: {
    color: colors.toggleTextOff,
  },
  form: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.textInputBorder,
    borderRadius: 8,
    fontSize: 16,
    placeholderTextColor: colors.textInputPlaceholder,
  },
  button: {
    width: "100%",
    backgroundColor: colors.buttonBackGround,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
   secondaryButton: {
      backgroundColor: colors.SecondaryButtonBackground,
      padding: 12,
      borderRadius: 6,
      alignItems: "center",
    },
  buttonDisabled: {
    backgroundColor: colors.ButtonDisabled,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 8,
    color: colors.link,
    textDecorationLine: "underline",
    fontSize: 14,
  },
  error: {
    color: colors.error,
    marginBottom: 8,
    fontSize: 14,
  },
  footerText: {
    fontSize: 12,
    color: colors.footerText,
    marginTop: 20,
    textAlign: "center",
  },
});