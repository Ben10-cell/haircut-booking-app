// screens/SignupScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function SignupScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Sign Up</Text>
      <Button title="Start Registration" onPress={() => navigation.navigate('RegisterInfo')} color={colors.primary} />
      <Button title="Go to Welcome" onPress={() => navigation.navigate('Welcome')} color={colors.secondary} />
    </View>
  );
}
// No local styles needed
