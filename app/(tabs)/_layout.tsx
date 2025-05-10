import { Tabs } from 'expo-router';
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
            height: 70, // Increased height
            paddingBottom: 15, // Increased bottom padding
          },
          android: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
            elevation: 8,
            height: 70, // Increased height
            paddingBottom: 15, // Increased bottom padding
          },
          default: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
            height: 70, // Increased height
            paddingBottom: 15, // Increased bottom padding
          },
        }),
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 12,
          paddingBottom: 0,
          marginTop: 1, // Reduced spacing between icon and text
        },
        tabBarIconStyle: {
          marginTop: 8,
          marginBottom: 2, // Reduced spacing between icon and text
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
