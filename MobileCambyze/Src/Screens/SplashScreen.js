import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('HomePage');
    }, 5000); // 5 secondes
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/cambyze_icon.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001f3f',
  },
  image: {
    width: '80%',
    height: '80%',
  },
});

export default SplashScreen;