import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import OnboardingScreen, { ONBOARDING_KEY } from './src/screens/OnboardingScreen';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
      setShowOnboarding(!hasSeenOnboarding);
    } catch (error) {
      console.error('Onboarding check error:', error);
      setShowOnboarding(false);
    }
  };

  const handleOnboardingDone = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding === null) {
    return null; // Loading
  }

  if (showOnboarding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <OnboardingScreen onDone={handleOnboardingDone} />
          <StatusBar style="light" />
        </ThemeProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
