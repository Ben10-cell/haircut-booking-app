// screens/ClientListScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function ClientListScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Meet Our Professional Barbers</Text>
      <Button
        title="← Back to Dashboard"
        onPress={() => navigation.navigate('ClientHome')}
        color={colors.primary}
      />
    </View>
  );
}
