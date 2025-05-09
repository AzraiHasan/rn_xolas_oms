import React, { useRef } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SearchBarProps {
  /**
   * Current search query
   */
  value: string;
  
  /**
   * Called when search query changes
   */
  onChangeText: (text: string) => void;
  
  /**
   * Called when search is submitted
   */
  onSubmit?: () => void;
  
  /**
   * Called when cancel button is pressed
   */
  onCancel: () => void;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Auto focus when rendered
   */
  autoFocus?: boolean;
}

/**
 * Search bar component for filtering issues
 */
export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onCancel,
  placeholder = 'Search issues...',
  autoFocus = true,
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const inputRef = useRef<TextInput>(null);
  
  return (
    <ThemedView className="flex-row items-center pb-3">
      <ThemedView
        className="flex-1 flex-row items-center rounded-lg px-3 h-10 md:h-12"
        style={{ backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' }}
      >
        <IconSymbol name="magnifyingglass" size={18} color={colors.icon} className="mr-2" />
        
        <TextInput
          ref={inputRef}
          className="flex-1 text-base py-2.5"
          style={{ color: colors.text }}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={colors.icon}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </ThemedView>
      
      <TouchableOpacity onPress={onCancel} className="ml-3">
        <ThemedText className="text-[#0086C9] text-base">Cancel</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}


