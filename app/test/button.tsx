import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Test screen for buttons
 */
export default function ButtonTestScreen() {
  const [counter, setCounter] = useState(0);
  
  const handleNativeButtonPress = () => {
    console.log('Native button pressed');
    setCounter(prev => prev + 1);
    Alert.alert('Native Button', `Button pressed ${counter + 1} times`);
  };

  const handleTouchablePress = () => {
    console.log('TouchableOpacity pressed');
    setCounter(prev => prev + 1);
    Alert.alert('Touchable', `Touchable pressed ${counter + 1} times`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Button Test Screen</Text>
        <Text style={styles.counter}>Counter: {counter}</Text>
        
        <View style={styles.spacer} />
        
        <Text style={styles.label}>React Native Button:</Text>
        <Button 
          title="Press Native Button" 
          onPress={handleNativeButtonPress} 
          color="#ff5c5c" 
        />
        
        <View style={styles.spacer} />
        
        <Text style={styles.label}>TouchableOpacity:</Text>
        <TouchableOpacity 
          style={styles.touchable}
          onPress={handleTouchablePress}
          activeOpacity={0.7}
        >
          <Text style={styles.touchableText}>Press Touchable</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  counter: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  spacer: {
    height: 30,
  },
  touchable: {
    backgroundColor: '#4a80f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  touchableText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
