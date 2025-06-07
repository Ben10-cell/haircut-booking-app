// screens/MessagesScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonStyles from '../constants/styles';
import colors from '../constants/colors';

export default function MessagesScreen() {
  return (
    <View style={commonStyles.container}>
      <Text style={styles.text}>This is your messages screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: colors.text,
  },
});
