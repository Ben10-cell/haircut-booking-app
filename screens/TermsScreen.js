// screens/TermsScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles'; // Import common styles

export default function TermsScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Terms and Conditions</Text>
      <ScrollView style={styles.scrollView}> {/* scrollView is unique to this screen */}
        <Text style={commonStyles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Text style={commonStyles.paragraph}>
          Section 1.1: User Responsibilities. Users are responsible for maintaining the confidentiality of their account and password and for restricting access to their computer, and they agree to accept responsibility for all activities that occur under their account or password.
        </Text>
        <Text style={commonStyles.paragraph}>
          Section 1.2: Privacy Policy. Our privacy policy outlines how we collect, use, and protect your personal data. By using this app, you agree to the terms of our privacy policy.
        </Text>
        <Text style={commonStyles.paragraph}>
          Section 1.3: Service Limitations. We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. You agree that we shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service.
        </Text>
      </ScrollView>
      <Button title="Go Back" onPress={() => navigation.goBack()} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginBottom: 20,
    width: '100%', // Ensure scroll view takes full width
  },
});
