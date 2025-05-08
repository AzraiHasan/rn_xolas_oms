import React, { forwardRef, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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
      <View style={[styles.container, containerStyle]}>
        {label && (
          <View style={styles.labelContainer}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            {required && <ThemedText style={styles.requiredIndicator}> *</ThemedText>}
          </View>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: getBorderColor(),
              backgroundColor: colorScheme === 'dark' ? '#1E1F20' : '#F9FAFB',
            },
          ]}
        >
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
            placeholder={placeholder}
            style={[
              styles.input,
              {
                color: colors.text,
              },
              style,
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
        {(error || helperText) && (
          <ThemedText
            style={[
              styles.helperText,
              isError && { color: '#E11D48' },
            ]}
          >
            {error || helperText}
          </ThemedText>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  leftIconContainer: {
    marginRight: 10,
  },
  rightIconContainer: {
    marginLeft: 10,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});

// Display name for better debugging
Input.displayName = 'Input';
