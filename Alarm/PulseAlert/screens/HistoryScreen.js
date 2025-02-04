import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Button, ScrollView, ActivityIndicator } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { database } from '../firebaseConfig'; // Use the correct relative path to the root
import { ref, onValue } from "firebase/database";

export default function HistoryScreen({ navigation }) {
  const [temperatureData, setTemperatureData] = useState([]); // Data for temperature
  const [humidityData, setHumidityData] = useState([]); // Data for humidity
  const [waterData, setWaterData] = useState([]); // Data for water detection
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Reference to Firebase Realtime Database for sensor data
    const sensorDataRef = ref(database, "sensors");

    const unsubscribe = onValue(sensorDataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val(); // Get the snapshot data

        console.log("✅ Fetched Data from Firebase:", data); // Debugging log

        // Extract values from the fetched data and store them in the state
        const temperature = data?.temperature_sensor?.value ?? "N/A";
        const humidity = data?.humidity_sensor?.value ?? "N/A";
        const water = data?.water_sensor?.value ?? false;

        // For the charts, let's assume we have data over time. If you want to plot the data over time, 
        // you should be fetching time-series data and appending new values on each Firebase update.
        setTemperatureData([temperature]); // Set the latest temperature data
        setHumidityData([humidity]); // Set the latest humidity data
        setWaterData([water ? 1 : 0]); // Set water detection as 1 (for true) or 0 (for false)

        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []); // Fetch data when the component mounts

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading historical data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Historical Data</Text>

      {/* Temperature Chart */}
      <Text style={styles.chartTitle}>Temperature Over Time</Text>
      <LineChart
        data={{
          labels: ['Latest'], // We are showing the latest value, so the label is 'Latest'
          datasets: [
            {
              data: temperatureData, // Pass the temperature data here
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#f9f9f9",
          backgroundGradientFrom: "#f9f9f9",
          backgroundGradientTo: "#f9f9f9",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />

      {/* Humidity Chart */}
      <Text style={styles.chartTitle}>Humidity Over Time</Text>
      <LineChart
        data={{
          labels: ['Latest'], // Same as above
          datasets: [
            {
              data: humidityData, // Pass the humidity data here
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#f9f9f9",
          backgroundGradientFrom: "#f9f9f9",
          backgroundGradientTo: "#f9f9f9",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />

      {/* Water Detection Chart */}
      <Text style={styles.chartTitle}>Water Detection Events</Text>
      <BarChart
        data={{
          labels: ['Latest'], // Showing the latest event
          datasets: [
            {
              data: waterData, // Pass the water detection data here
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#f9f9f9",
          backgroundGradientFrom: "#f9f9f9",
          backgroundGradientTo: "#f9f9f9",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />

      {/* Back Button */}
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
