// Minor changes are marked with comments like // ✨ Change

// ... other imports remain unchanged
import { ScrollView } from 'react-native'; // ✨ Change: Added ScrollView for better layout

export default function ClientDashboard({ navigation }) {
  // ... state and useEffect blocks remain unchanged

  // ✨ Change: Wrapped main UI in ScrollView to handle overflow
  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
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
          title="View All Barbers"
          onPress={() => navigation.navigate('Barbers')} // ✨ Change: Clearer title text
          color={colors.secondary}
        />
        <Button
          title="Go to Barber Dashboard (Dev Access)"
          onPress={() =>
            navigation.navigate('BarberApp', { screen: 'BarberHome' })
          }
          color={colors.tertiary}
        />
      </View>
    </ScrollView>
  );
}

// ... rest of the style code remains unchanged
