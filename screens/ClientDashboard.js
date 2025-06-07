// screens/ClientDashboard.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig.js'; // Firestore instance
import colors from '../constants/colors';
import commonStyles from '../constants/styles';

export default function ClientDashboard({ navigation }) {
  // ─── State ──────────────────────────────────────────
  const [availableDates, setAvailableDates] = useState([]); // array of ISO date strings
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [barberId, setBarberId] = useState(null); // store one barber’s ID

  // ─── Map weekday name to JS Date index (0 = Sunday, 6 = Saturday)
  const weekdayToIndex = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  // ─── Step 1: On mount, fetch the first barber document’s ID
  useEffect(() => {
    async function fetchOneBarberId() {
      try {
        const barbersColRef = collection(db, 'barbers');
        const barbersSnapshot = await getDocs(barbersColRef);

        if (barbersSnapshot.empty) {
          console.warn('No barbers found in Firestore.');
          setLoading(false);
          return;
        }

        // Pick the first barber doc in the collection
        const firstBarberDoc = barbersSnapshot.docs[0];
        setBarberId(firstBarberDoc.id);
      } catch (error) {
        console.error('Error fetching barber IDs:', error);
      }
    }

    fetchOneBarberId();
  }, []);

  // ─── Step 2: Once we have a barberId, fetch that barber’s availability map
  useEffect(() => {
    if (!barberId) return;

    async function fetchBarberAvailability() {
      setLoading(true);
      try {
        const barberDocRef = doc(db, 'barbers', barberId);
        const barberSnapshot = await getDoc(barberDocRef);

        if (!barberSnapshot.exists()) {
          console.warn(`Barber ${barberId} does not exist.`);
          setLoading(false);
          return;
        }

        const barberData = barberSnapshot.data();
        const availabilityMap = barberData.availability || {};
        computeNextAvailableDates(availabilityMap);
      } catch (error) {
        console.error('Error fetching barber availability:', error);
        setLoading(false);
      }
    }

    fetchBarberAvailability();
  }, [barberId]);

  // ─── Helper: Given a weekly template (availabilityMap), compute next 7 dates
  function computeNextAvailableDates(availabilityMap) {
    const today = new Date();
    const dates = [];
    let cursor = new Date(today);

    // Keep searching until we have collected 7 available dates
    while (dates.length < 7) {
      const weekdayIndex = cursor.getDay(); // 0 = Sunday, … , 6 = Saturday

      // Check if this weekdayIndex matches any key in availabilityMap
      const foundDayKey = Object.keys(availabilityMap).find((dayName) => {
        return weekdayToIndex[dayName.toLowerCase()] === weekdayIndex;
      });

      if (foundDayKey) {
        // Barber is available on this dayKey; use its startTime (or default '09:00')
        const startTimeStr = availabilityMap[foundDayKey].startTime || '09:00';
        // Build an ISO timestamp (UTC) with date + startTime:
        const isoDate =
          cursor.toISOString().split('T')[0] + 'T' + startTimeStr + ':00Z';
        dates.push(isoDate);
      }

      // Move to the next calendar day
      cursor.setDate(cursor.getDate() + 1);
    }

    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
    setLoading(false);
  }

  // ─── When “Book Selected Date” is pressed
  const onPressBook = () => {
    if (!selectedDate || !barberId) return;

    // Navigate to the "Book" tab (which renders BookingScreen)
    navigation.navigate('BookingScreen', {
      barberId,
      date: selectedDate,
    });
  };

  // ─── Render ───────────────────────────────────────────
  if (loading) {
    return (
      <View style={[commonStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12 }}>Loading available dates…</Text>
      </View>
    );
  }

  if (availableDates.length === 0) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>
          No available dates found for this barber.
        </Text>
        <Button
          title="Refresh"
          onPress={() => {
            // Retry by resetting barberId (so the effect re-runs)
            setBarberId((id) => id);
          }}
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Book a Haircut</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedDate}
          onValueChange={(itemValue) => setSelectedDate(itemValue)}
          style={styles.picker}
        >
          {availableDates.map((isoDate) => (
            <Picker.Item
              key={isoDate}
              label={new Date(isoDate).toDateString()}
              value={isoDate}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Book Selected Date"
          onPress={onPressBook}
          color={colors.primary}
          disabled={!selectedDate}
        />
      </View>

      <View style={styles.bottomButtons}>
        <Button
          title="View Barbers"
          onPress={() => navigation.navigate('Barbers')}
          color={colors.secondary}
        />
        <Button
          title="Go to Barber Dashboard (Dev Only)"
          onPress={() =>
            navigation.navigate('BarberApp', { screen: 'BarberHome' })
          }
          color={colors.tertiary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 4,
    marginVertical: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonWrapper: {
    marginBottom: 30,
  },
  bottomButtons: {
    marginTop: 40,
    justifyContent: 'space-between',
    height: 100,
  },
});
