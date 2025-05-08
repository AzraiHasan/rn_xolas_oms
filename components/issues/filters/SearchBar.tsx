import React, { useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

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
    <ThemedView style={styles.container}>
      <ThemedView
        style={[
          styles.inputContainer,
          { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' },
        ]}
      >
        <IconSymbol name="magnifyingglass" size={18} color={colors.icon} style={styles.searchIcon} />
        
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.text }]}
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
      
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <ThemedText style={styles.cancelText}>Cancel</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 8,
  },
  cancelText: {
    color: '#0086C9',
    fontSize: 16,
  },
});
