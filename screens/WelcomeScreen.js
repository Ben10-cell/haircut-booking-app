import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { GlobalStyles } from '../constants/GlobalStyles';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={GlobalStyles.container}>
      <Text style={styles.title}>Haircut Booking</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate('LoginScreen.js')}
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignupScreen.js')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
  }
});