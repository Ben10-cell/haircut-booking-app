// screens/RegisterPhotoScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function RegisterPhotoScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Register: Add Photo</Text>
      <Button title="Next: Preferences" onPress={() => navigation.navigate('RegisterPreferences')} color={colors.primary} />
      <Button title="Back to Info" onPress={() => navigation.navigate('RegisterInfo')} color={colors.secondary} />
    </View>
  );
}
// No local styles needed
