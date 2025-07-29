
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';

export default function Footer() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.footerContainer}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Text style={{fontSize: 15}}>Scroll me plz
          © 2023 Your Company Name. All rights reserved.   
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});