// navigation/ClientTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ClientDashboard from '../screens/ClientDashboard';
import BookingScreen from '../screens/BookingScreen';
import ClientListScreen from '../screens/ClientListScreen';
import colors from '../constants/colors.js'; // Ensure colors are imported

const Tab = createBottomTabNavigator();

export default function ClientTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: 5 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ClientHome') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Barbers') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="ClientHome"
        component={ClientDashboard}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Messages"
        component={BookingScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen
        name="Barbers"
        component={ClientListScreen}
        options={{ title: 'Barbers' }}
      />
    </Tab.Navigator>
  );
}
