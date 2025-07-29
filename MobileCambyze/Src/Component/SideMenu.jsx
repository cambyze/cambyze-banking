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

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = 250;

export default function SideMenu({ isOpen, toggleMenu }) {
  const navigation = useNavigation();
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
        <Text style={styles.drawerTitle}>Menu</Text>

        <TouchableOpacity
          onPress={() => {
            toggleMenu();
            navigation.navigate('HomePage');
          }}
        >
          <Text style={styles.drawerItem}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            toggleMenu();
            navigation.navigate('Test');
          }}
        >
          <Text style={styles.drawerItem}>Test</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.drawerItem}>
            {user ? 'Déconnexion' : 'Connexion'}
          </Text>
        </TouchableOpacity>
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
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  drawerItem: {
    fontSize: 18,
    marginVertical: 10,
  },
});


// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Button } from 'react-native';
// import { AuthContext } from '../../App';
// import { useNavigation } from '@react-navigation/native';

// const SCREEN_WIDTH = Dimensions.get('window').width;
// const DRAWER_WIDTH = 250;

// export default function SideMenu({ isOpen, toggleMenu }) {
//   const { user, logout } = useContext(AuthContext);
//   const navigation = useNavigation();
//   const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
//   const [showSettings, setShowSettings] = useState(false);

//   useEffect(() => {
//     Animated.timing(translateX, {
//       toValue: isOpen ? 0 : -DRAWER_WIDTH,
//       duration: 250,
//       useNativeDriver: true,
//     }).start();
//   }, [isOpen]);

//   return (
//     <>
//       {/* Drawer visible même quand isOpen = false (mais hors écran) */}
//       <Animated.View
//         pointerEvents={isOpen ? 'auto' : 'none'}
//         style={[styles.drawerContainer, { transform: [{ translateX }] }]}
//       >
//         <TouchableOpacity
//           onPress={() => {
//             toggleMenu();
//             navigation.navigate('HomePage');
//           }}
//           style={styles.drawerItem}
//         >
//           <Text style={styles.drawerText}>Accueil</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => {
//             toggleMenu();
//             navigation.navigate('Test');
//           }}
//           style={styles.drawerItem}
//         >
//           <Text style={styles.drawerText}>Test</Text>
//         </TouchableOpacity>

//         <Button title="Paramètres" onPress={() => setShowSettings(!showSettings)} />
//         {showSettings && <Text>Paramètres activés</Text>}

//         {user ? (
//           <TouchableOpacity
//             onPress={() => {
//               logout();
//               toggleMenu();
//               navigation.navigate('LoginRegister');
//             }}
//             style={styles.drawerItem}
//           >
//             <Text style={styles.drawerText}>Déconnexion</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             onPress={() => {
//               toggleMenu();
//               navigation.navigate('LoginRegister');
//             }}
//             style={styles.drawerItem}
//           >
//             <Text style={styles.drawerText}>Connexion</Text>
//           </TouchableOpacity>
//         )}
//       </Animated.View>

//       {/* Overlay qui ferme le menu */}
//       {isOpen && (
//         <TouchableOpacity
//           style={styles.overlay}
//           activeOpacity={1}
//           onPress={toggleMenu}
//         />
//       )}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: DRAWER_WIDTH,
//     width: SCREEN_WIDTH - DRAWER_WIDTH,
//     height: '100%',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     zIndex: 1,
//   },
//   drawerContainer: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: DRAWER_WIDTH,
//     backgroundColor: '#fff',
//     padding: 20,
//     elevation: 10,
//     zIndex: 2,
//   },
//   drawerItem: {
//     marginVertical: 10,
//   },
//   drawerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });