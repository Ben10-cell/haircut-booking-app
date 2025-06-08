// navigation/ClientStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClientTabNavigator from './ClientTabNavigator';
import BookingScreen from '../screens/BookingScreen'; // Booking screen not in tabs

const Stack = createNativeStackNavigator();

export default function ClientStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientTabs" component={ClientTabNavigator} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} />
    </Stack.Navigator>
  );
}
