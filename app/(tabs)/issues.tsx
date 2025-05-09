import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function IssuesScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Issues',
        // Apply contentStyle directly here for each screen
        contentStyle: { paddingTop: 16 }
      }} />
      
      <ThemedText type="title">Issues List</ThemedText>
      {/* Rest of the screen content */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
