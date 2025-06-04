// screens/BookingScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function BookingScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Book Your Haircut</Text>
      <Button title="Confirm Booking" onPress={() => console.log('Booking Confirmed!')} color={colors.primary} />
      <Button title="Back to Dashboard" onPress={() => navigation.navigate('ClientHome')} color={colors.secondary} />
    </View>
  );
}
// No local styles needed
