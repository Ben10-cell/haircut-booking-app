// navigation/BarberTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets

import BarberDashboard from '../screens/BarberDashboard';
import BarberSettings from '../screens/BarberSettings';
import colors from '../constants/colors'; // Ensure colors are imported

const Tab = createBottomTabNavigator();

export default function BarberTabNavigator() {
  const insets = useSafeAreaInsets(); // Get safe area insets

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

          if (route.name === 'BarberHome') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="BarberHome"
        component={BarberDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Settings"
        component={BarberSettings}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
