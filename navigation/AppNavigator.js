// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// --- Auth / Onboarding ---
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import RegisterInfoScreen from '../screens/RegisterInfoScreen';
import RegisterPhotoScreen from '../screens/RegisterPhotoScreen';
import RegisterPreferencesScreen from '../screens/RegisterPreferencesScreen';
import RegisterPaymentScreen from '../screens/RegisterPaymentScreen';
import RegisterTermsScreen from '../screens/RegisterTermsScreen';
import TermsScreen from '../screens/TermsScreen';

// --- Tab Navigators (Main App Flows) ---
import ClientStackNavigator from './ClientStackNavigator';
import BarberTabNavigator from './BarberTabNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Auth / Onboarding */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="RegisterInfo" component={RegisterInfoScreen} />
      <Stack.Screen name="RegisterPhoto" component={RegisterPhotoScreen} />
      <Stack.Screen name="RegisterPreferences" component={RegisterPreferencesScreen} />
      <Stack.Screen name="RegisterPayment" component={RegisterPaymentScreen} />
      <Stack.Screen name="RegisterTerms" component={RegisterTermsScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />

      {/* Client Flow - Now uses a Tab Navigator */}
      {/* The name 'ClientApp' here allows you to navigate to the client's tabbed experience */}
      <Stack.Screen name="ClientApp" component={ClientStackNavigator} />
      {/* Note: Individual client screens like Booking and ClientList are now part of ClientTabNavigator.
          You might still need to navigate to them directly from within the Client Dashboard or other tab screens
          if you want to push a new screen *on top* of the tabs using a nested stack navigator inside a tab.
          For simplicity, I've removed their direct stack entries as they are now tabs.
          If you need to navigate to 'Booking' from 'ClientDashboard' and have the tab bar persist,
          you'd typically do `navigation.navigate('Book')` or use a nested stack within the tab.
          If 'Booking' should *not* show the tab bar, it would need to remain a Stack.Screen in AppNavigator,
          and 'ClientDashboard' would navigate to it via `navigation.push('Booking')`.
          For this setup, I'm assuming 'Booking' and 'ClientList' are accessed directly via their tabs.
      */}


      {/* Barber Flow - Now uses a Tab Navigator */}
      {/* The name 'BarberApp' here allows you to navigate to the barber's tabbed experience */}
      <Stack.Screen name="BarberApp" component={BarberTabNavigator} />
      {/* Similar to client screens, BarberSettings is now part of BarberTabNavigator. */}
    </Stack.Navigator>
  );
}
