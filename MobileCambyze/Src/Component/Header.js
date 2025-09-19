import React, { useContext, useState, useEffect, use } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import colors from '../Constants/colors';
import i18n from '../i18n/index';
import { AuthContext } from '../../App';
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native"; // Import DrawerActions
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.headerBackground,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.headerBackground,
  },
  buttonText: {
    color: colors.headerText,
    fontSize: 14,
    fontWeight: 'bold',
  },
});


function LanguageSwitcher({ currentLanguage, updateLanguage }) {
  const availableLanguages = ['fr', 'en']; // Liste des langues disponibles

  const switchLanguage = () => {
    const currentIndex = availableLanguages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    const newLanguage = availableLanguages[nextIndex];
    updateLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Recharger les traductions
  };

  return (
    <TouchableOpacity style={styles.button} onPress={switchLanguage}>
      <Text style={styles.buttonText}>{currentLanguage.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}


function BurgerMenu({ toggleMenu }) {
  const navigation = useNavigation();
  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer()); // Dispatch the openDrawer action
  };
  const { t } = useTranslation("Header");
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handleOpenDrawer}
    >
      <Text style={styles.buttonText}>☰</Text>
    </TouchableOpacity>
  );
}

const Isconnected = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const { t } = useTranslation("Header");

  const handleLogout = () => {
    logout();
    navigation.navigate('HomePage');
  }

  return (
    <View>
      {user ? (
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>{t("logout")}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("LoginRegister")}
          >
          <Text style={styles.buttonText}>{t("login")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

function Header({ language, setLanguage, toggleMenu }) {
  return (
    <View style={styles.headerContainer}>
      <BurgerMenu toggleMenu={toggleMenu} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Isconnected />
        <LanguageSwitcher currentLanguage={language} updateLanguage={setLanguage} />
      </View>
    </View>
  );
}
export default Header;