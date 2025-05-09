import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  // Only use BlurView on iOS
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={80}
        className="absolute inset-0"
        style={{
          backgroundColor: 
            colorScheme === 'dark' 
              ? 'rgba(0, 0, 0, 0.5)' 
              : 'rgba(255, 255, 255, 0.7)',
        }}
        tint={colorScheme}
      />
    );
  }
  
  // For Android and Web, return a regular View with a solid background color
  return (
    <View 
      className="absolute inset-0"
      style={{
        backgroundColor: 
          colorScheme === 'dark' 
            ? '#121212' 
            : '#FFFFFF',
      }}
    />
  );
}

// Calculate safe area for tab bar overflow
export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}
