// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Welcome to TrimTime</Text>
      <Text style={commonStyles.paragraph}>Pumi is stingy, agressive, cool, achef</Text>
      <Button title="Log In" onPress={() => navigation.navigate('Login')} color={colors.primary} />
      <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} color={colors.secondary} />
    </View>
  );
}
// No local styles needed if all are covered by commonStyles
