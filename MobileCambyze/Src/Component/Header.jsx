import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import colors from '../Constants/colors';
import i18n from '../i18n/index';

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

export function LanguageSwitcher({ currentLanguage, updateLanguage }) {
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

export function getHeaderRight(language, setLanguage) {
  return () => (
    <LanguageSwitcher currentLanguage={language} updateLanguage={setLanguage} />
  );
}

export function BurgerMenu({ toggleMenu }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleMenu} // Call toggleMenu when clicked
    >
      <Text style={styles.buttonText}>☰</Text>
    </TouchableOpacity>
  );
}

// export const headerOptions = (language, setLanguage, toggleMenu) => ({
//   headerShown: true,
//   headerLeft: () => <BurgerMenu toggleMenu={toggleMenu} />, // Pass toggleMenu to BurgerMenu
//   headerRight: getHeaderRight(language, setLanguage),
//   headerTitleAlign: 'center',
//   headerStyle: {
//     backgroundColor: colors.headerBackground,
//   },
//   headerTintColor: colors.headerText,
// });

function Header({ language, setLanguage, toggleMenu }) {
  return (
    <View style={styles.headerContainer}>
      <BurgerMenu toggleMenu={toggleMenu} />
      <LanguageSwitcher currentLanguage={language} updateLanguage={setLanguage} />
    </View>
  );
}
export default Header;