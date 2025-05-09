import React, { useState } from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface CheckboxProps {
  /**
   * Label text to display next to the checkbox
   */
  label?: string;
  
  /**
   * Whether the checkbox is checked
   */
  checked: boolean;
  
  /**
   * Function called when checkbox state changes
   */
  onValueChange: (checked: boolean) => void;
  
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether to show the checkbox in error state
   */
  isError?: boolean;
  
  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Additional NativeWind classes
   */
  className?: string;
}

/**
 * Checkbox component with support for labels and error states
 */
export function Checkbox({
  label,
  checked,
  onValueChange,
  disabled = false,
  error,
  isError = false,
  style,
  className,
}: CheckboxProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isFocused, setIsFocused] = useState(false);
  
  const getBoxColor = () => {
    if (disabled) return colorScheme === 'dark' ? '#3E4144' : '#E4E7EB';
    if (isError) return '#E11D48';
    if (checked) return colors.tint;
    return colorScheme === 'dark' ? '#3E4144' : '#E4E7EB';
  };
  
  const getBorderColor = () => {
    if (disabled) return colorScheme === 'dark' ? '#3E4144' : '#E4E7EB';
    if (isError) return '#E11D48';
    if (isFocused) return colors.tint;
    return colorScheme === 'dark' ? '#3E4144' : '#E4E7EB';
  };
  
  return (
    <ThemedView 
      className={`mb-4 ${className || ''}`} 
      style={style}
    >
      <Pressable
        className="flex-row items-start"
        onPress={() => !disabled && onValueChange(!checked)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
      >
        <ThemedView 
          className={`w-5 h-5 items-center justify-center rounded border md:w-6 md:h-6 ${
            disabled ? 'opacity-50' : ''
          }`}
          style={{
            backgroundColor: checked ? getBoxColor() : 'transparent',
            borderColor: getBorderColor(),
          }}
        >
          {checked && (
            <IconSymbol
              name="checkmark"
              size={14}
              color="#FFFFFF"
            />
          )}
        </ThemedView>
        
        {label && (
          <ThemedText 
            className={`ml-2 flex-1 text-base ${disabled ? 'opacity-50' : ''}`}
          >
            {label}
          </ThemedText>
        )}
      </Pressable>
      
      {error && (
        <ThemedText className="text-xs mt-1 text-[#E11D48]">
          {error}
        </ThemedText>
      )}
    </ThemedView>
  );
}
