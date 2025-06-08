// screens/BarberSettings.js
import React, { useState } from 'react';
import { View, Text, Button, Switch, TextInput, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/styles';

export default function BarberSettings({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [displayName, setDisplayName] = useState('Barber John');

  const handleSave = () => {
    // Placeholder logic for saving settings
    console.log('Settings saved:', {
      notificationsEnabled,
      displayName,
    });
    alert('Settings saved!');
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Barber Settings</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your display name"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={notificationsEnabled ? colors.primary : '#ccc'}
        />
      </View>

      <Button
        title="Save Changes"
        onPress={handleSave}
        color={colors.primary}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Back to Dashboard"
          onPress={() => navigation?.navigate('BarberHome')}
          color={colors.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
