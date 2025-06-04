// screens/RegisterPreferencesScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function RegisterPreferencesScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Register: Preferences</Text>
      <Button title="Next: Payment" onPress={() => navigation.navigate('RegisterPayment')} color={colors.primary} />
      <Button title="Back to Photo" onPress={() => navigation.navigate('RegisterPhoto')} color={colors.secondary} />
    </View>
  );
}
// No local styles needed
