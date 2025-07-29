import React, { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../App";
import { AuthContext } from "../../App";import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, FlatList, StyleSheet, Button } from "react-native";

const exampleAccounts = [
  {
    id: 1,
    type: "Banking",
    balance: 1520.75,
    overdraft: 500,
  },
  {
    id: 2,
    type: "Saving",
    balance: 3200.0,
    overdraft: 0,
  },
];

export default function Account() {
  const { user, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // useEffect(() => {
  //   if (!user) {
  //     navigation.navigate("Home");
  //   }
  // }, [user, navigation]);

  // useEffect(() => {
  //   if (user && user.personId) {
  //     fetchUserAccounts();
  //   }
  // }, [user]);

  const fetchUserAccounts = async () => {
    if (!user.personId) return;

    setLoading(true);
    try {
      const response = await fetch(`/findBanByPerson?personId=${user.personId}`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      const formattedAccounts = Array.isArray(data)
        ? data.map((account) => ({
            id: account.bankAccountNumber || "N/A",
            type: account.accountType === "1" ? "Banking" : "Saving",
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
      setError("Missing user ID.");
      return;
    }

    try {
      const endpoint = type === "Saving" ? "/createSavingsAccount" : "/createBankAccount";

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

  const handleLogout = () => {
    logout();
    navigation.navigate("Home");
  };

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Not Connected</Text>
          <Text style={styles.description}>Please log in to access your account !!.</Text>
          <Button
            title="Login/Register"
            style={styles.primaryButton}
            onPress={() => navigation.navigate("LoginRegister")}
            Label="Login/Register GO BACK"
          />
          <Button
            title="Debug User"

            style={styles.primaryButton}
            onPress={() => user = { firstName: "John", lastName: "Doe", email: "", personId: "12345" }} // Mock user for testing)}
            Label="debug"
          />
                <FlatList
        data={exampleAccounts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.accountCard}
            onPress={() => navigation.navigate("AccountDetails", { accountId: item.id })}
          >
            <Text style={styles.accountType}>{item.type}</Text>
            <Text style={styles.accountBalance}>Balance: €{item.balance.toFixed(2)}</Text>
            {item.overdraft > 0 && (
              <Text style={styles.accountOverdraft}>Overdraft: €{item.overdraft.toFixed(2)}</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noAccountsText}>No accounts available.</Text>
        )}
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
        <Text style={styles.welcomeText}>Welcome to your account</Text>
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading && (
        <ActivityIndicator size="large" color="#4A6FA5" style={styles.loader} />
      )}

      <FlatList
        data={userAccounts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.accountCard}
            onPress={() => navigation.navigate("AccountDetails", { accountId: item.id })}
          >
            <Text style={styles.accountType}>{item.type}</Text>
            <Text style={styles.accountBalance}>Balance: €{item.balance.toFixed(2)}</Text>
            {item.overdraft > 0 && (
              <Text style={styles.accountOverdraft}>Overdraft: €{item.overdraft.toFixed(2)}</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noAccountsText}>No accounts available.</Text>
        )}
      />

      <TouchableOpacity style={styles.createAccountButton} onPress={() => setShowModal(true)}>
        <Text style={styles.createAccountText}>Create New Account</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Account</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false);
                createBankAccount("Saving");
              }}
            >
              <Text style={styles.modalButtonText}>Saving Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8ff",
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f8ff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A6FA5",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
  headerCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A6FA5",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  userId: {
    fontSize: 14,
    color: "#999",
  },
  welcomeText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
  },
  errorCard: {
    backgroundColor: "#f8d7da",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#721c24",
  },
  loader: {
    marginVertical: 20,
  },
  accountCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  accountType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A6FA5",
  },
  accountBalance: {
    fontSize: 16,
    color: "#333",
  },
  accountOverdraft: {
    fontSize: 14,
    color: "#666",
  },
  noAccountsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  createAccountButton: {
    backgroundColor: "#4A6FA5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  createAccountText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A6FA5",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#4A6FA5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  modalCancelButton: {
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#666",
  },
});
