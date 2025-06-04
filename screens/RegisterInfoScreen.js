// screens/RegisterInfoScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function RegisterInfoScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Register: Basic Info</Text>
      <Button title="Next: Photo" onPress={() => navigation.navigate('RegisterPhoto')} color={colors.primary} />
      <Button title="Back to Sign Up" onPress={() => navigation.navigate('Signup')} color={colors.secondary} />
    </View>
  );
}
// No local styles needed
