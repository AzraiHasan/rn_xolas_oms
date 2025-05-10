import React from 'react';
import { Switch } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useTheme } from '@/hooks/theme/useTheme';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useThemeContext();
  const { getColor } = useTheme();
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView className="flex-row items-center py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700">
      <IconSymbol 
        name={isDark ? "brightness-2" : "brightness-7"} 
        size={20} 
        color={isDark ? "#F0C420" : "#F59E0B"} 
      />
      <Switch
        value={isDark}
        onValueChange={toggleColorScheme}
        trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
        thumbColor="#FFFFFF"
        style={{ marginLeft: 6 }}
      />
    </ThemedView>
  );
}
