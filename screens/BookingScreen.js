// screens/BookingScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; // Added serverTimestamp
import { db } from '../services/firebaseConfig';
import colors from '../constants/colors';
import commonStyles from '../constants/styles';

export default function BookingScreen({ route, navigation }) {
  const { barberId, date } = route.params;
  const [loading, setLoading] = useState(false);

  const confirmBooking = async () => {
    setLoading(true);
    try {
      const bookingRef = collection(db, 'bookings');
      await addDoc(bookingRef, {
        barberId,
        date,
        clientId: 'client_test_001', // Replace with authenticated user ID later
        status: 'pending',
        createdAt: serverTimestamp(), // Changed from ISO string to serverTimestamp
      });
      setLoading(false);
      Alert.alert('Success', 'Your appointment has been successfully booked!');
      navigation.navigate('ClientHome');
    } catch (error) {
      console.error('Booking failed:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to book your appointment. Please try again.');
    }
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Confirm Your Booking</Text>
      <Text style={styles.label}>Barber ID: {barberId}</Text>
      <Text style={styles.label}>Date: {new Date(date).toLocaleString()}</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <Button title="Confirm Booking" onPress={confirmBooking} color={colors.primary} />
          <Button title="Back to Dashboard" onPress={() => navigation.navigate('ClientHome')} color={colors.secondary} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
});
