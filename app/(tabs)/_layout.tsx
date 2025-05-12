import { Tabs } from 'expo-router';

// Disallow access to test tab
export const unstable_settings = {
  initialRouteName: 'index',
};
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { AppHeader } from '@/components/layout/AppHeader';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: props => <HapticTab {...props} />,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: 90, // Adjusted to match action buttons (50 + 16 + 24)
            paddingBottom: 24, // Matches action buttons padding
          },
          android: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
            elevation: 8,
            height: 90, // Adjusted to match action buttons (50 + 16 + 24)
            paddingBottom: 24, // Matches action buttons padding
          },
          default: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
            height: 90, // Adjusted to match action buttons (50 + 16 + 24)
            paddingBottom: 24, // Matches action buttons padding
          },
        }),
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 12,
          paddingBottom: 0,
          marginTop: 2, // Slight adjustment for better positioning
        },
        tabBarIconStyle: {
          marginTop: 12, // Adjusted for the increased height
          marginBottom: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="issues"
        options={{
          title: 'Issues',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="exclamationmark.circle.fill" color={color} />
        }}
      />

      <Tabs.Screen
        name="create-issue"
        options={{
          title: 'New Issue',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />
        }}
      />
    </Tabs>
  );
}
