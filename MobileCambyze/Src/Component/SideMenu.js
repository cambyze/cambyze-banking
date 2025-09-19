// SideMenu.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../App';
import { useTranslation } from "react-i18next";
import colors from '../Constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = 250;

function MenuButton({ toggleMenu, page }) {
  const navigation = useNavigation();
  const { t } = useTranslation("sideMenu");
  
  return (
       <TouchableOpacity
          onPress={() => {
            toggleMenu();
            navigation.navigate(page);
          }}
          activeOpacity={0.7}
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>{t(page)}</Text>
        </TouchableOpacity>
  );
}

export default function SideMenu({ isOpen, toggleMenu }) {
  const { user } = useContext(AuthContext);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Interpolation pour opacité
  const overlayOpacity = translateX.interpolate({
    inputRange: [-DRAWER_WIDTH, 0],
    outputRange: [0, 0.5],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (isOpen) setDrawerVisible(true); // afficher le menu tout de suite

    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (!isOpen) setDrawerVisible(false); // cacher une fois refermé
    });
  }, [isOpen, translateX]);

  if (!drawerVisible) return null;

  return (
    <>
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      </Animated.View>

      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX }] }]}>
        {user && user !== null ? 
        <View>
          <MenuButton toggleMenu={toggleMenu} page="HomePage" />
          <MenuButton toggleMenu={toggleMenu} page="Test" />
          <MenuButton toggleMenu={toggleMenu} page="Account" />
          <MenuButton toggleMenu={toggleMenu} page="BankTransfer" />
          <MenuButton toggleMenu={toggleMenu} page="ResetPassword" />
        </View>:
        // not connected
        <View> 
          <MenuButton toggleMenu={toggleMenu} page="HomePage" />
          <MenuButton toggleMenu={toggleMenu} page="Test" />
          <MenuButton toggleMenu={toggleMenu} page="LoginRegister" />
        </View>}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: 'black',
    zIndex: 1,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 0 },
    zIndex: 2,
  },
  menuButton: {
    // backgroundColor: '#f5f5f5', // Couleur de fond discrète
    // borderBlockColor: '#ddd', // Couleur de bordure claire
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 8,
    marginVertical: 8, 
    // elevation: 2, 
     shadowColor: 'black',
     shadowOpacity: 0.1,
     shadowRadius: 1,
     shadowOffset: { width: 0, height: 2 },
  },
  menuButtonText: {
    fontSize: 16,
    color: colors.buttonBackGround, 
    textAlign: 'center', 
    fontWeight: '500', 
  },
});