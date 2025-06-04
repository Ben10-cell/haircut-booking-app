// screens/ClientDashboard.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function ClientDashboard({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Client Dashboooooard</Text>
      <Button title="Book a Haircut" onPress={() => navigation.navigate('Book')} color={colors.primary} />
      <Button title="View Barbers" onPress={() => navigation.navigate('Barbers')} color={colors.secondary} />
      <Button title="Go to Barber Dashboard (Dev Only)" onPress={() => navigation.navigate('BarberApp', { screen: 'BarberHome' })} color={colors.tertiary} />
    </View>
  );
}
// No local styles needed
