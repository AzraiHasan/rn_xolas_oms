import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: Math.max(10, insets.bottom), // Ensure minimum padding of 10px
    },
    blurBackground: {
      backgroundColor: colorScheme === 'dark' 
        ? 'rgba(0, 0, 0, 0.5)' 
        : 'rgba(255, 255, 255, 0.7)',
    },
    solidBackground: {
      backgroundColor: colorScheme === 'dark' 
        ? '#121212' 
        : '#FFFFFF',
    }
  });
  
  // Only use BlurView on iOS
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={80}
        style={[styles.container, styles.blurBackground]}
        tint={colorScheme}
      />
    );
  }
  
  // For Android and Web, return a regular View with a solid background color
  return (
    <View 
      style={[styles.container, styles.solidBackground]}
    />
  );
}

// Calculate safe area for tab bar overflow
export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}
