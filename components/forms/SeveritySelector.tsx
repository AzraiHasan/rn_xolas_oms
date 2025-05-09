import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
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
    <ThemedView style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          {required && <ThemedText style={styles.requiredIndicator}> *</ThemedText>}
        </View>
      )}
      <ThemedView style={styles.severityContainer}>
        <Pressable
          style={[
            styles.severityButton,
            getSeverityButtonStyle(IssueSeverity.Low)
          ]}
          onPress={() => onChange(IssueSeverity.Low)}
        >
          <ThemedText style={[styles.severityText, getSeverityTextStyle(IssueSeverity.Low)]}>
            Low
          </ThemedText>
        </Pressable>
        
        <Pressable
          style={[
            styles.severityButton,
            getSeverityButtonStyle(IssueSeverity.Medium)
          ]}
          onPress={() => onChange(IssueSeverity.Medium)}
        >
          <ThemedText style={[styles.severityText, getSeverityTextStyle(IssueSeverity.Medium)]}>
            Medium
          </ThemedText>
        </Pressable>
        
        <Pressable
          style={[
            styles.severityButton,
            getSeverityButtonStyle(IssueSeverity.High)
          ]}
          onPress={() => onChange(IssueSeverity.High)}
        >
          <ThemedText style={[styles.severityText, getSeverityTextStyle(IssueSeverity.High)]}>
            High
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  requiredIndicator: {
    color: '#E11D48',
    fontWeight: '500',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  severityText: {
    fontWeight: '500',
  },
});
