import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'ProximaNova-Regular': require('./assets/fonts/proximanova_regular.otf'),
    'ProximaNova-Bold': require('./assets/fonts/proximanova_bold.otf'),
    'ProximaNova-Light': require('./assets/fonts/proximanova_light.otf'),
    'ProximaNova-Medium': require('./assets/fonts/proximanova_medium.otf'),
    'ProximaNova-Semibold': require('./assets/fonts/proximanova_semibold.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      {/* Your app content here */}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
} 