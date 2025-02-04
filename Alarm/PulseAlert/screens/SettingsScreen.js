import messaging from '@react-native-firebase/messaging'; // FCM import
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import { database } from '../firebaseConfig'; // Correct path to firebaseConfig
import { ref, onValue, push, set, remove } from 'firebase/database';

export default function SettingsScreen({ navigation }) {
  const [waterAlert, setWaterAlert] = useState(true);
  const [humidityAlert, setHumidityAlert] = useState(false);
  const [temperatureAlert, setTemperatureAlert] = useState(true);
  const [highTempThreshold, setHighTempThreshold] = useState(40);
  const [highHumidityThreshold, setHighHumidityThreshold] = useState(70);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(database, 'devices');

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const devicesData = snapshot.val();
        const deviceList = Object.keys(devicesData).map((key) => ({
          id: key,
          ...devicesData[key],
        }));
        setDevices(deviceList);
      } else {
        setDevices([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to trigger a notification
  const triggerNotification = (message) => {
    // Use Firebase Cloud Messaging to send a push notification to the device
    messaging()
      .getToken()
      .then((token) => {
        // Send a notification using your server or FCM directly
        // This is just an example. Replace it with real FCM sending logic.
        console.log("FCM Token:", token);
        messaging().send({
          to: token,
          notification: {
            title: 'Threshold Alert!',
            body: message,
          },
        });
      })
      .catch((error) => console.error('Error sending notification: ', error));
  };

  // Function to monitor thresholds and trigger alerts
  const monitorThresholds = (temperature, humidity) => {
    if (temperature > highTempThreshold && temperatureAlert) {
      triggerNotification(`High Temperature Alert! Temperature: ${temperature}°C`);
    }

    if (humidity > highHumidityThreshold && humidityAlert) {
      triggerNotification(`High Humidity Alert! Humidity: ${humidity}%`);
    }
  };

  // Add device and other operations...
  
  // Test Notification (simulated)
  const testNotification = () => {
    alert("Test notification sent!");
  };

  // Loading state or display device list
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading devices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Notifications */}
      <Text style={styles.sectionTitle}>Notifications:</Text>
      <View style={styles.row}>
        <Text>Enable Water Detection Alerts</Text>
        <Switch value={waterAlert} onValueChange={setWaterAlert} />
      </View>
      <View style={styles.row}>
        <Text>Enable High Humidity Alerts</Text>
        <Switch value={humidityAlert} onValueChange={setHumidityAlert} />
      </View>
      <View style={styles.row}>
        <Text>Enable High Temperature Alerts</Text>
        <Switch value={temperatureAlert} onValueChange={setTemperatureAlert} />
      </View>

      {/* Thresholds */}
      <Text style={styles.sectionTitle}>Thresholds:</Text>
      <View style={styles.row}>
        <Text>High Temperature:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(highTempThreshold)}
          onChangeText={(value) => setHighTempThreshold(Number(value))}
        />
        <Text>°C</Text>
      </View>
      <View style={styles.row}>
        <Text>High Humidity:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(highHumidityThreshold)}
          onChangeText={(value) => setHighHumidityThreshold(Number(value))}
        />
        <Text>%</Text>
      </View>

      {/* Test Alerts */}
      <Text style={styles.sectionTitle}>Test Alerts:</Text>
      <Button title="Send Test Notification" onPress={testNotification} />

      {/* Back Button */}
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginHorizontal: 10,
    width: 60,
    textAlign: "center",
  },
});
