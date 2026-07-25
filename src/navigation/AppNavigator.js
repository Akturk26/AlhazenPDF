import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { navigationRef } from './navigationRef';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import CameraScreen from '../screens/CameraScreen';
import FormScreen from '../screens/FormScreen';
import TemplateScreen from '../screens/TemplateScreen';
import PreviewScreen from '../screens/PreviewScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FormatScreen from '../screens/FormatScreen';
import RealEstatePreviewScreen from '../screens/RealEstatePreviewScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ExpertizScreen from '../screens/ExpertizScreen';
import ExpertizliFormScreen from '../screens/ExpertizliFormScreen';
import ExpertizliTemplateScreen from '../screens/ExpertizliTemplateScreen';
import ExpertizliPreviewScreen from '../screens/ExpertizliPreviewScreen';
import ServisFormScreen from '../screens/ServisFormScreen';
import ServisGecmisScreen from '../screens/ServisGecmisScreen';
import TeknikServisScreen from '../screens/TeknikServisScreen';
import AracSorgulaScreen from '../screens/AracSorgulaScreen';
import TeklifFaturaFormScreen from '../screens/TeklifFaturaFormScreen';
import SatisTakipScreen from '../screens/SatisTakipScreen';
import AracEkleScreen from '../screens/AracEkleScreen';
import EmlakPortfolyoScreen from '../screens/EmlakPortfolyoScreen';
import AraclarimScreen from '../screens/AraclarimScreen';
import SahsiAracEkleScreen from '../screens/SahsiAracEkleScreen';
import AracDetayScreen from '../screens/AracDetayScreen';
import AuthScreen from '../screens/AuthScreen';
import PlanScreen from '../screens/PlanScreen';
import CompanySelectScreen from '../screens/CompanySelectScreen';
import TeamMembersScreen from '../screens/TeamMembersScreen';
import HasarHaritasiScreen from '../screens/HasarHaritasiScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const bgColor = isDark ? '#0E0F14' : '#F9FAFB';

  // Custom navigation theme to prevent white flash
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: bgColor,
      card: bgColor,
      primary: theme.blue,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1F2937' : '#4F46E5',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          unmountOnBlur: true,
          detachPreviousScreen: true,
          gestureEnabled: true,
          cardStyle: {
            backgroundColor: bgColor,
          },
          cardOverlayEnabled: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          headerShown: true,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: 'Fotoğraf Ekle' }}
        />
        <Stack.Screen
          name="Form"
          component={FormScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Template"
          component={TemplateScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Preview"
          component={PreviewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Format"
          component={FormatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RealEstatePreview"
          component={RealEstatePreviewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Expertiz"
          component={ExpertizScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExpertizliForm"
          component={ExpertizliFormScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExpertizliTemplate"
          component={ExpertizliTemplateScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExpertizliPreview"
          component={ExpertizliPreviewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ServisForm"
          component={ServisFormScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ServisGecmis"
          component={ServisGecmisScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeknikServis"
          component={TeknikServisScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AracSorgula"
          component={AracSorgulaScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeklifFatura"
          component={TeklifFaturaFormScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SatisTakip"
          component={SatisTakipScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AracEkle"
          component={AracEkleScreen}
          options={{ headerShown: false, unmountOnBlur: false }}
        />
        <Stack.Screen
          name="HasarHaritasi"
          component={HasarHaritasiScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmlakPortfolyo"
          component={EmlakPortfolyoScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Araclarim"
          component={AraclarimScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SahsiAracEkle"
          component={SahsiAracEkleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AracDetay"
          component={AracDetayScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Plan"
          component={PlanScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompanySelect"
          component={CompanySelectScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeamMembers"
          component={TeamMembersScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
