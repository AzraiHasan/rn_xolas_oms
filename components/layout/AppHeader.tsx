import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/hooks/theme/useTheme';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

export function AppHeader({ title, showBackButton = false, rightComponent }: AppHeaderProps) {
  const navigation = useNavigation();
  const { getColor } = useTheme();

  return (
    <ThemedView className="px-4 py-1 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <ThemedView className="flex-row items-center justify-between">
        <ThemedText className="text-lg font-semibold">{title}</ThemedText>
        {rightComponent || null}
      </ThemedView>
    </ThemedView>
  );
}
