import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Button } from 'react-native';
import { database } from '../firebaseConfig'; // Firebase config file
import { ref, onValue } from 'firebase/database';
import { analytics } from '../firebaseConfig'; // Import analytics from firebaseConfig

export default function HomeScreen({ navigation }) {
  const [temperatureData, setTemperatureData] = useState(null);
  const [humidityData, setHumidityData] = useState(null);
  const [waterData, setWaterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sensorDataRef = ref(database, 'sensors');

    const unsubscribe = onValue(sensorDataRef, (snapshot) => {
      console.log('Fetching data from Firebase...');

      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Fetched Data:', data);

        // Set data into state
        setTemperatureData(data?.temperature_sensor?.value || 'N/A');
        setHumidityData(data?.humidity_sensor?.value || 'N/A');
        setWaterData(data?.water_sensor?.value ? 'Yes' : 'No');

        setLoading(false);
      } else {
        console.log('No data found in Firebase.');
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading sensor data...</Text>
      </View>
    );
  }

  // Firebase Analytics Event Logging
  const logButtonClick = (buttonName) => {
    analytics.logEvent('button_click', {
      name: buttonName,
      screen: 'HomeScreen',
    });
    console.log(`${buttonName} button clicked`);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Sensor Data</Text>

      {/* Sensor Data */}
      <View style={styles.card}>
        <Text style={styles.label}>Temperature: {temperatureData}°C</Text>
        <Text style={styles.label}>Humidity: {humidityData}%</Text>
        <Text style={styles.label}>Water Detected: {waterData}</Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttons}>
        <Button
          title="View History"
          onPress={() => {
            logButtonClick('View History'); // Log the button click event
            navigation.navigate('History');
          }}
        />
        <Button
          title="Settings"
          onPress={() => {
            logButtonClick('Settings'); // Log the button click event
            navigation.navigate('Settings');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttons: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
