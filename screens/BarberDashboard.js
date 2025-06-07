// screens/BarberDashboard.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function BarberDashboard({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Barber Dashboard</Text>
      <Button title="Manage Settings" onPress={() => navigation.navigate('Settings')} color={colors.primary} />
      <Button title="Go to Client Dashboard (Dev Only)" onPress={() => navigation.navigate('ClientApp', { screen: 'ClientHome' })} color={colors.secondary} />
    </View>
  );
}
// No local styles needed
