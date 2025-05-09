import React from 'react';
import { Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IssueSeverity } from '@/types/models/Issue';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SeveritySelectorProps {
  /**
   * Currently selected severity
   */
  value: IssueSeverity;
  
  /**
   * Function called when severity changes
   */
  onChange: (severity: IssueSeverity) => void;
  
  /**
   * Whether the field is required
   */
  required?: boolean;
  
  /**
   * Optional label for the selector
   */
  label?: string;
}

export const SeveritySelector = ({ 
  value, 
  onChange, 
  required = false,
  label = 'Severity'
}: SeveritySelectorProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Helper to determine button style based on selection state
  const getSeverityButtonStyle = (severity: IssueSeverity) => {
    const isSelected = value === severity;
    
    if (isSelected) {
      switch (severity) {
        case IssueSeverity.High:
          return { backgroundColor: '#E11D48', borderColor: '#E11D48' };
        case IssueSeverity.Medium:
          return { backgroundColor: '#F59E0B', borderColor: '#F59E0B' };
        case IssueSeverity.Low:
          return { backgroundColor: '#10B981', borderColor: '#10B981' };
      }
    }
    
    return {
      backgroundColor: 'transparent',
      borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB'
    };
  };

  const getSeverityTextStyle = (severity: IssueSeverity) => {
    const isSelected = value === severity;
    return {
      color: isSelected ? '#FFFFFF' : colors.text
    };
  };

  return (
    <ThemedView className="mb-5">
      {label && (
        <ThemedView className="flex-row mb-1.5">
          <ThemedText className="text-sm font-medium">{label}</ThemedText>
          {required && <ThemedText className="text-[#E11D48] font-medium"> *</ThemedText>}
        </ThemedView>
      )}
      <ThemedView className="flex-row justify-between space-x-2 md:space-x-3">
        <Pressable
          className="flex-1 py-3 md:py-4 rounded-lg items-center justify-center mx-1 border"
          style={getSeverityButtonStyle(IssueSeverity.Low)}
          onPress={() => onChange(IssueSeverity.Low)}
        >
          <ThemedText 
            className="font-medium md:text-base"
            style={getSeverityTextStyle(IssueSeverity.Low)}>
            Low
          </ThemedText>
        </Pressable>
        
        <Pressable
          className="flex-1 py-3 md:py-4 rounded-lg items-center justify-center mx-1 border"
          style={getSeverityButtonStyle(IssueSeverity.Medium)}
          onPress={() => onChange(IssueSeverity.Medium)}
        >
          <ThemedText 
            className="font-medium md:text-base"
            style={getSeverityTextStyle(IssueSeverity.Medium)}>
            Medium
          </ThemedText>
        </Pressable>
        
        <Pressable
          className="flex-1 py-3 md:py-4 rounded-lg items-center justify-center mx-1 border"
          style={getSeverityButtonStyle(IssueSeverity.High)}
          onPress={() => onChange(IssueSeverity.High)}
        >
          <ThemedText 
            className="font-medium md:text-base"
            style={getSeverityTextStyle(IssueSeverity.High)}>
            High
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

// NativeWind classes replace StyleSheet
