import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function BasicTestScreen() {
  const [count, setCount] = useState(0);
  
  // Very basic function with console logging
  const onPress = () => {
    console.log('BUTTON PRESSED', new Date().toISOString());
    setCount(prev => prev + 1);
    Alert.alert('Button Pressed', `Counter: ${count + 1}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Basic Test Screen</Text>
      <Text style={styles.text}>Count: {count}</Text>
      <Button 
        title="PRESS ME"
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  }
});
