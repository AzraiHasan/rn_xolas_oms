import React from 'react';
import { Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IssueStatus } from '@/types/models/Issue';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface StatusSelectorProps {
  /**
   * Currently selected status
   */
  value: IssueStatus;
  
  /**
   * Function called when status changes
   */
  onChange: (status: IssueStatus) => void;
  
  /**
   * Whether the field is required
   */
  required?: boolean;
  
  /**
   * Optional label for the selector
   */
  label?: string;
}

export const StatusSelector = ({ 
  value, 
  onChange, 
  required = false,
  label = 'Status'
}: StatusSelectorProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Helper to determine button style based on selection state
  const getStatusButtonStyle = (status: IssueStatus) => {
    const isSelected = value === status;
    
    if (isSelected) {
      switch (status) {
        case IssueStatus.New:
          return { backgroundColor: '#3B82F6', borderColor: '#3B82F6' };  // Blue
        case IssueStatus.Assigned:
          return { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' };  // Purple
        case IssueStatus.InProgress:
          return { backgroundColor: '#F59E0B', borderColor: '#F59E0B' };  // Amber
        case IssueStatus.Resolved:
          return { backgroundColor: '#10B981', borderColor: '#10B981' };  // Green
      }
    }
    
    return {
      backgroundColor: 'transparent',
      borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB'
    };
  };

  const getStatusTextStyle = (status: IssueStatus) => {
    const isSelected = value === status;
    return {
      color: isSelected ? '#FFFFFF' : colors.text
    };
  };

  // Display text for each status
  const getStatusDisplayText = (status: IssueStatus): string => {
    switch (status) {
      case IssueStatus.New:
        return 'New';
      case IssueStatus.Assigned:
        return 'Assigned';
      case IssueStatus.InProgress:
        return 'In Progress';
      case IssueStatus.Resolved:
        return 'Resolved';
      default:
        return status;
    }
  };

  return (
    <ThemedView className="mb-5">
      {label && (
        <ThemedView className="flex-row mb-1.5">
          <ThemedText className="text-sm font-medium">{label}</ThemedText>
          {required && <ThemedText className="text-[#E11D48] font-medium"> *</ThemedText>}
        </ThemedView>
      )}
      <ThemedView className="flex-wrap flex-row justify-between gap-2">
        {Object.values(IssueStatus).map((status) => (
          <Pressable
            key={status}
            className="flex-1 min-w-[45%] py-3 md:py-4 rounded-lg items-center justify-center border"
            style={getStatusButtonStyle(status)}
            onPress={() => onChange(status)}
          >
            <ThemedText 
              className="font-medium md:text-base"
              style={getStatusTextStyle(status)}>
              {getStatusDisplayText(status)}
            </ThemedText>
          </Pressable>
        ))}
      </ThemedView>
    </ThemedView>
  );
};
