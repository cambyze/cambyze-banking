import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../Constants/colors";

export default function Profile() {
  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../assets/profile_icon.png')}
        style={styles.profileImage}
      /> */}
      <Text style={styles.profileName}>John Doe</Text>
      <Text style={styles.profileEmail}>john.doe@example.com</Text>
      <Text >Resset password</Text>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: colors.buttonBackGround,
    padding: 12,
    borderRadius: 6,
  },
  editButtonText: {
    color: colors.buttonText,
    fontWeight: "bold",
  },
});
