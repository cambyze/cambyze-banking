import React from 'react';
import './Src/i18n/index';
import { StatusBar, StyleSheet, useColorScheme, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {useEffect, useState, createContext}  from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Src/Component/Footer';
import HomePage from './Src/Screens/HomePage';
import Test from './Src/Screens/test';
import LoginRegister from './Src/Screens/LoginRegister';
import Header from './Src/Component/Header';
import 'react-native-reanimated';
import SideMenu from './Src/Component/SideMenu';
import Account from './Src/Screens/Account';

export const AuthContext = createContext<{ user: any; login: (user: any) => void; logout: () => void }>({
  //user: null,
  user: { firstName: "John", lastName: "Doe", email: "", personId: "12345" },
  login: () => {},
  logout: () => {},
});
export const LanguageContext = createContext<{ language: string; setLanguage: (lang: string) => void }>({
  language: 'fr',
  setLanguage: () => {},
});

function App() {
   const isDarkMode = useColorScheme() === 'dark';
  const Drawer = createDrawerNavigator();
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('fr');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to load user', e);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const saveUser = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem('user');
        }
      } catch (e) {
        console.error('Failed to save user', e);
      }
    };
    saveUser();
  }, [user]);

  const login = (userData: any) => setUser(userData);
  const logout = () => setUser(null);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    header: {
      height: 60,
      backgroundColor: '#f8f8f8',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    headerButton: {
      position: 'absolute',
      left: 20,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  });

  const navigationView = (
    <Drawer.Navigator initialRouteName="HomePage">
      <Drawer.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
      <Drawer.Screen name="Test" component={Test} options={{ headerShown: false }} />
      <Drawer.Screen name="LoginRegister" component={LoginRegister} options={{ headerShown: false }} />
      <Drawer.Screen name="Account" component={Account} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <NavigationContainer>
          <Header
            language={language}
            setLanguage={setLanguage}
            toggleMenu={toggleDrawer}
          />
          <LanguageContext.Provider value={{ language, setLanguage }}>
            <View style={styles.container}>
              <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <SideMenu isOpen={isDrawerOpen} toggleMenu={toggleDrawer} />
                  {navigationView}
              {/* <Footer /> */}
            </View>
          </LanguageContext.Provider>
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaView>
  );
}

export default App;
