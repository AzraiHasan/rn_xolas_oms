import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
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
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
        // Override default shadow styling with boxShadow
        tabBarItemStyle: {
          // This will replace any deprecated shadowColor, shadowOffset, etc.
          boxShadow: '0px 2px 3px rgba(0,0,0,0.1)'
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
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="exclamationmark.circle.fill" color={color} />,
          contentStyle: { paddingTop: 16 }, // Add 1rem (16px) top padding
        }}
      />
      <Tabs.Screen
        name="create-issue"
        options={{
          title: 'New Issue',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
          contentStyle: { paddingTop: 16 }, // Add 1rem (16px) top padding
        }}
      />
    </Tabs>
  );
}
