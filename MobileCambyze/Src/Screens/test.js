import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import "nativewind";
import { useFocusEffect } from "@react-navigation/native";

export default function Test() {
  const [showSplash, setShowSplash] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setShowSplash(true);
    }, [])
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // Cache le SplashScreen après 2 secondes
    }, 2000);

    return () => clearTimeout(timer); // Nettoie le timer
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('../assets/cambyze_icon.png')}
          style={styles.splashImage}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is a test page.</Text>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});