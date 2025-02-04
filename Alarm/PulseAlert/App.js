import React from 'react';
import { View, Text } from 'react-native';
import registerRootComponent from 'expo/src/launch/registerRootComponent';

// Import the correct App file directly from the root
import App from 'npx expo start --tunnel --clear
./App'; 

// Register the root component
registerRootComponent(App);

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to PulseAlert</Text>
    </View>
  );
}
