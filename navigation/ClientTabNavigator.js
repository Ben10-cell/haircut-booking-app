// navigation/ClientTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ClientDashboard from '../screens/ClientDashboard';
import BookingScreen from '../screens/BookingScreen';
import ClientListScreen from '../screens/ClientListScreen';
import colors from '../constants/colors'; // Ensure colors are imported

const Tab = createBottomTabNavigator();

export default function ClientTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary, // Use primary color for active tab
        tabBarInactiveTintColor: colors.secondary, // Use secondary color for inactive tab
        tabBarStyle: {
          backgroundColor: colors.background, // Use background color for tab bar
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
          } else if (route.name === 'Book') {
            iconName = focused ? 'calendar' : 'calendar-outline';
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
        name="Book"
        component={BookingScreen}
        options={{ title: 'Book' }}
      />
      <Tab.Screen
        name="Barbers"
        component={ClientListScreen}
        options={{ title: 'Barbers' }}
      />
    </Tab.Navigator>
  );
}
