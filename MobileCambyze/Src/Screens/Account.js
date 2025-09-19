import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, FlatList, StyleSheet, Button } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../Constants/colors";

export default function Account() {
  const { user, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [ShowModalAccount, setModalAccount] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operations, setOperations] = useState([]);
  const navigation = useNavigation();
  const { t } = useTranslation("account");
 useEffect(() => {
   if (!user) {
     navigation.navigate("HomePage");
   }
 }, [user, navigation]);

  useEffect(() => {
    
    if (user && user.personId) {
      fetchUserAccounts();
    }
  }, [user]);

  //refresh accounts when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (user && user.personId) {
        fetchUserAccounts(); 
      }
    }, [user])
  );

  const fetchAccoutsDetails = async (accountId) => {
    fetch(`http://localhost:8080/monthlyBankStatement?ban=${accountId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`API error: ${res.status} - ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            if (data && Array.isArray(data.operations)) {
                setOperations(data.operations);
            } else {
                console.error("Expected an array in 'operations' but received:", data);
                setOperations([]);
            }
        })
        .catch(err => console.error("Error fetching operations:", err))
        .finally(() => setLoading(false));
  };

  const fetchUserAccounts = async () => {
    if (!user.personId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/findBanByPerson?personId=${user.personId}`);
      console.log("Fetch response:", response);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      const formattedAccounts = Array.isArray(data)
        ? data.map((account) => ({
            id: account.bankAccountNumber || "N/A",
            type: account.accountType === "1" ? t("accountTypeBanking") : t("accountTypeSaving"),
            balance: account.balanceAmount || 0,
            overdraft: account.overdraftAmount || 0,
          }))
        : [];

      setUserAccounts(formattedAccounts);
      setError(null);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Error loading accounts.");
    } finally {
      setLoading(false);
    }
  };

  const createBankAccount = async (type) => {
    if (!user?.personId) {
      setError(t("Account.Set_Error_Missing_User_Id"));
      return;
    }

    try {
      const endpoint = type === "Saving" ? "http://localhost:8080/createSavingsAccount" : "http://localhost:8080/createBankAccount";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ personId: user.personId }).toString(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      fetchUserAccounts();
    } catch (err) {
      console.error("Error creating account:", err);
      setError(`Unable to create ${type} account. Please try again.`);
    }
  };

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{t("not_Connected_Title")}</Text>
          <Text style={styles.description}>{t("not_Connected_Description")}</Text>
          <Button
            title={t("login_Register_Button")}
            style={styles.primaryButton}
            onPress={() => navigation.navigate("LoginRegister")}
            label="Login/Register GO BACK"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.userName}>{user.firstName} {user.lastName}</Text> 
        <Text style={styles.userEmail}>{user.email}</Text>
        {user.personId && <Text style={styles.userId}>ID: {user.personId}</Text>}
        <Text style={styles.welcomeText}>{t("welcomeMessage")}</Text>
        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={{ color: colors.primary, fontWeight: "bold" }}>{t("ChangePasswordButton")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate("BankTransfer")}>
          <Text style={{ color: colors.primary, fontWeight: "bold" }}>{t("BankTransferButton")}</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading && (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      )}


      {/* <Text style={{ fontSize: 10, color: 'gray' }}>test {JSON.stringify(userAccounts, null, 2)}</Text> */}
      <FlatList
        data={userAccounts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.accountCard}
            onPress={() => {fetchAccoutsDetails(item.id), setModalAccount(true)}}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.accountType}>{item.type} </Text>
              <Text style={ styles.accountId}>#{item.id}</Text>
            </View>
            <Text style={styles.accountBalance}>{t("accountBalance")} €{item.balance.toFixed(2)}</Text>
            {item.overdraft > 0 && (
              <Text style={styles.accountOverdraft}>{t("accountOverdraft")} €{item.overdraft.toFixed(2)}</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noAccountsText}>{t("noAccountsAvailable")}</Text>
        )}
      />

      <TouchableOpacity style={styles.createAccountButton} onPress={() => setShowModal(true)}>
        <Text style={styles.createAccountText}>{t("createAccountButton")}</Text>
      </TouchableOpacity>
      {/* modal create account */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("createAccountModalTitle")}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false);
                createBankAccount("Saving");
              }}
            >
              <Text style={styles.modalButtonText}>{t("savingAccountButton")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>{t("cancelButton")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* modal account details */}
      <Modal visible={ShowModalAccount} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {t("LastAccountOperations")} #{operations.length > 0 && operations[0]?.accountId}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.modalLoader} />
          ) : operations.length > 0 ? (
            <FlatList
                data={operations}
                keyExtractor={(item, index) => `${item.operationDate}-${index}`}
                contentContainerStyle={{ paddingBottom: 20 }} // Add padding for better spacing
                style={{ maxHeight: 300, width: '100%' }}
                renderItem={({ item }) => (
                  <View style={styles.operationItem}>
                    <Text style={styles.operationText}>
                      {item.operationDate} - {item.operationType} : {item.amount} €
                    </Text>
                  </View>
                )}
              />
          ) : (
            <Text style={styles.noOperationsText}>{t("NoOperationsFound")}</Text>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalAccount(false);
              setOperations([]);
            }}
          >
            <Text style={styles.closeButtonText}>{t("cancelButton")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
      {/* <ModalAccount /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f5f8ff",
    backgroundColor: colors.background,
    padding: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    backgroundColor: colors.background,
  },
  card: {
    // backgroundColor: "#black",
    backgroundColor: colors.cardBackground,
    marginTop: 10,
    marginBottom: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.lowerTextDescription,
  },
  headerCard: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  userEmail: {
    fontSize: 16,
    color: colors.lowerTextDescription,
  },
  userId: {
    fontSize: 14,
    color: colors.userIdText,
    marginTop: 5,
  },
  welcomeText: {
    fontSize: 18,
    color: colors.midText,
    marginTop: 10,
  },
  errorCard: {
    // backgroundColor: "#f8d7da",
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.errorText,
  },
  loader: {
    marginVertical: 20,
  },
  accountCard: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  accountType: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
  },
  accountId: {
    fontSize: 12,
    color: colors.userIdText,
  },
  accountBalance: {
    fontSize: 16,
    color: colors.midText,
  },
  accountOverdraft: {
    fontSize: 14,
    color: colors.lowerTextDescription,
  },
  noAccountsText: {
    fontSize: 16,
    color: colors.infoText,
    textAlign: "center",
    marginTop: 20,
  },
  createAccountButton: {
    backgroundColor: colors.buttonBackGround,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    // marginTop: 20,
    margin: 20,
  },
  createAccountText: {
    fontSize: 18,
    color: colors.buttonText,
    fontWeight: "bold",
  },
   modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.modalContainerBackground, // Ajout d'un fond semi-transparent
  },
  modalContent: {
    backgroundColor: colors.modalBackground,
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  modalLoader: {
    marginVertical: 20,
  },
  modalButton: {
    backgroundColor: colors.buttonBackGround,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: colors.contrasText,
  },
  operationItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  operationText: {
    fontSize: 16,
    color: colors.midText,
  },
  noOperationsText: {
    fontSize: 16,
    color: colors.errorClearText,
    textAlign: "center",
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: colors.buttonBackGround,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.buttonText,
    fontWeight: "bold",
  },
});