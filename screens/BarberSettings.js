// screens/BarberSettings.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function BarberSettings({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Barber Settings</Text>
      <Button title="Back to Dashboard" onPress={() => navigation.navigate('BarberHome')} color={colors.primary} />
    </View>
  );
}
// No local styles needed
