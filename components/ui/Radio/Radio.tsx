import React, { useState } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface RadioOption {
  /**
   * The value of the option
   */
  value: string;
  
  /**
   * The label to display
   */
  label: string;
  
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
}

export interface RadioProps {
  /**
   * Array of options to display
   */
  options: RadioOption[];
  
  /**
   * Currently selected value
   */
  value: string;
  
  /**
   * Called when an option is selected
   */
  onValueChange: (value: string) => void;
  
  /**
   * Whether the radio group is disabled
   */
  disabled?: boolean;
  
  /**
   * Optional label for the radio group
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether to show the radio group in error state
   */
  isError?: boolean;
  
  /**
   * Whether the radio buttons should be arranged horizontally
   */
  horizontal?: boolean;
  
  /**
   * Additional style for the container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Additional NativeWind classes
   */
  className?: string;
}

/**
 * Radio button group component
 */
export function Radio({
  options,
  value,
  onValueChange,
  disabled = false,
  label,
  error,
  isError = false,
  horizontal = false,
  style,
  className,
}: RadioProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [focusedOption, setFocusedOption] = useState<string | null>(null);
  
  const getOuterCircleColor = (optionValue: string) => {
    if (disabled || (options.find(opt => opt.value === optionValue)?.disabled)) {
      return colorScheme === 'dark' ? '#3E4144' : '#E4E7EB';
    }
    if (isError) return '#E11D48';
    if (focusedOption === optionValue) return colors.tint;
    return colorScheme === 'dark' ? '#3E4144' : '#E4E7EB';
  };
  
  const getInnerCircleColor = () => {
    if (disabled) return colorScheme === 'dark' ? '#687076' : '#9CA3AF';
    if (isError) return '#E11D48';
    return colors.tint;
  };
  
  return (
    <ThemedView 
      className={`mb-4 ${className || ''}`}
      style={style}
    >
      {label && (
        <ThemedText className="text-sm font-medium mb-2">
          {label}
        </ThemedText>
      )}
      
      <ThemedView 
        className={`${horizontal ? 'flex-row flex-wrap' : ''} gap-3 md:gap-4`}
      >
        {options.map((option) => {
          const isOptionDisabled = disabled || option.disabled;
          const isSelected = value === option.value;
          
          return (
            <Pressable
              key={option.value}
              className={`flex-row items-center ${horizontal ? 'mr-6' : 'mb-3'}`}
              onPress={() => !isOptionDisabled && onValueChange(option.value)}
              onFocus={() => setFocusedOption(option.value)}
              onBlur={() => setFocusedOption(null)}
              disabled={isOptionDisabled}
              accessibilityRole="radio"
              accessibilityState={{ 
                checked: isSelected,
                disabled: isOptionDisabled,
              }}
            >
              <ThemedView 
                className={`w-5 h-5 items-center justify-center rounded-full border md:w-6 md:h-6 ${
                  isOptionDisabled ? 'opacity-50' : ''
                }`}
                style={{
                  borderColor: getOuterCircleColor(option.value),
                }}
              >
                {isSelected && (
                  <ThemedView
                    className="w-2.5 h-2.5 rounded-full md:w-3 md:h-3"
                    style={{
                      backgroundColor: getInnerCircleColor(),
                    }}
                  />
                )}
              </ThemedView>
              
              <ThemedText 
                className={`ml-2 text-base ${isOptionDisabled ? 'opacity-50' : ''}`}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ThemedView>
      
      {error && (
        <ThemedText className="text-xs mt-1 text-[#E11D48]">
          {error}
        </ThemedText>
      )}
    </ThemedView>
  );
}
