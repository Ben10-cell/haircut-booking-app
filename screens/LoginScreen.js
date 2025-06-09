// screens/LoginScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function LoginScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Login</Text>
      <View style={styles.buttonSpacing}>
        <Button
          title="Go to Welcome"
          onPress={() => navigation.navigate('Welcome')}
          color={colors.secondary}
        />
      </View>
      <View style={styles.buttonSpacing}>
        <Button
          title="Go to Client Dashboard"
          onPress={() => navigation.navigate('ClientApp', { screen: 'ClientHome' })}
          color={colors.primary}
        />
      </View>
      <View style={styles.buttonSpacing}>
        <Button
          title="Go to Barber Dashboard (Dev Only)"
          onPress={() => navigation.navigate('BarberApp', { screen: 'BarberHome' })}
          color={colors.tertiary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonSpacing: {
    marginVertical: 5,
  },
});
