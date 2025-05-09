import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface InputProps extends TextInputProps {
  /**
   * Input label
   */
  label?: string;
  
  /**
   * Error message displayed below the input
   */
  error?: string;
  
  /**
   * Optional help text displayed below the input
   */
  helperText?: string;
  
  /**
   * Whether to show the error state
   * @default false
   */
  isError?: boolean;
  
  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Custom container style
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Optional right icon
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Optional left icon
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Additional className for styling with NativeWind
   */
  className?: string;
}

/**
 * Input component that adapts to light/dark mode
 */
export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      isError = false,
      required = false,
      containerStyle,
      rightIcon,
      leftIcon,
      style,
      placeholder,
      onFocus,
      onBlur,
      className,
      ...rest
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const getBorderColor = () => {
      if (isError) return '#E11D48';
      if (isFocused) return colors.tint;
      return colorScheme === 'dark' ? '#3E4144' : '#E4E7EB';
    };

    return (
      <View className="mb-4" style={containerStyle}>
        {label && (
          <View className="flex-row mb-1.5">
            <ThemedText className="text-sm font-medium">{label}</ThemedText>
            {required && <ThemedText className="text-[#E11D48] font-medium"> *</ThemedText>}
          </View>
        )}
        <View
          className={`flex-row items-center border rounded-lg min-h-[44px] px-3 ${
            colorScheme === 'dark' ? 'bg-[#1E1F20]' : 'bg-[#F9FAFB]'
          } ${className || ''}`}
          style={{
            borderColor: getBorderColor(),
          }}
        >
          {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
          <TextInput
            ref={ref}
            placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
            placeholder={placeholder}
            className="flex-1 text-base py-2.5"
            style={[
              {
                color: colors.text,
              },
              style,
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
          {rightIcon && <View className="ml-2.5">{rightIcon}</View>}
        </View>
        {(error || helperText) && (
          <ThemedText
            className={`text-xs mt-1 ${isError ? 'text-[#E11D48]' : ''}`}
          >
            {error || helperText}
          </ThemedText>
        )}
      </View>
    );
  }
);

// Display name for better debugging
Input.displayName = 'Input';
