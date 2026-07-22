import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TypographySelector } from './src/components/TypographySelector';
import { TypographyProvider } from './src/context/TypographyContext';
import { UserProvider } from './src/context/UserContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    FranPlatformMedium: require('./assets/fonts/Platform-Medium.ttf'),
    FranPlatformBold: require('./assets/fonts/Platform-Bold.ttf'),
    FranSymbolBook: require('./assets/fonts/Symbol-Book.otf'),
    FranSymbolMedium: require('./assets/fonts/Symbol-Medium.otf'),
    FranSymbolSemibold: require('./assets/fonts/Symbol-Semibold.otf'),
    FranSymbolBold: require('./assets/fonts/Symbol-Bold.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <TypographyProvider>
          <UserProvider>
            <StatusBar style="dark" />
            <View style={styles.appFrame}>
              <RootNavigator />
              <TypographySelector />
            </View>
          </UserProvider>
        </TypographyProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  appFrame: { flex: 1 },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
});
