import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function CreateIssueScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'New Issue',
        // Apply contentStyle directly here for each screen
        contentStyle: { paddingTop: 16 }
      }} />
      
      <ThemedText type="title">Create New Issue</ThemedText>
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
