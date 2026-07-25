import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { PremiumProvider } from './src/context/PremiumContext';
import PaywallModal from './src/components/PaywallModal';
import OnboardingScreen, { ONBOARDING_KEY } from './src/screens/OnboardingScreen';
import { scheduleAllNotifications } from './src/utils/notifications';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://51195aff0a6a57e6b8cfaaec1e79f5ee@o4511738860077056.ingest.de.sentry.io/4511738892320848',
  tracesSampleRate: 0.1,
});

function App() {
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    checkOnboarding();
    scheduleAllNotifications();
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
        <SafeAreaProvider>
          <PremiumProvider>
            <ThemeProvider>
              <OnboardingScreen onDone={handleOnboardingDone} />
              <StatusBar style="light" />
            </ThemeProvider>
          </PremiumProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PremiumProvider>
          <ThemeProvider>
            <AppNavigator />
            <PaywallModal />
            <StatusBar style="auto" />
          </ThemeProvider>
        </PremiumProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
