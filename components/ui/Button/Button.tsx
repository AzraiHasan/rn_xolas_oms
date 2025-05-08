import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * Button text content
   */
  label: string;
  
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Size variant of the button
   * @default 'medium'
   */
  size?: ButtonSize;
  
  /**
   * Shows a loading indicator instead of the label
   * @default false
   */
  loading?: boolean;
  
  /**
   * Optional icon to display before the label
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Optional icon to display after the label
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Custom text style
   */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Button component that adapts to light/dark mode
 */
export function Button({
  label,
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const getContainerStyle = () => {
    const baseStyle: ViewStyle = {
      ...styles.container,
      ...sizeStyles[size],
    };
    
    // Apply variant-specific styles
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.tint,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.tint,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: '#E11D48',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };
  
  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      ...textSizeStyles[size],
    };
    
    // Apply variant-specific text styles
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: colors.tint,
        };
      case 'danger':
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: colors.text,
        };
      default:
        return baseStyle;
    }
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        getContainerStyle(),
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'ghost' ? colors.tint : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <ThemedText style={[getTextStyle(), textStyle]}>{label}</ThemedText>
          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

// Size variants
const sizeStyles: Record<ButtonSize, ViewStyle> = {
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
};

// Text size variants
const textSizeStyles: Record<ButtonSize, TextStyle> = {
  small: {
    fontSize: 14,
    fontWeight: '500',
  },
  medium: {
    fontSize: 16,
    fontWeight: '500',
  },
  large: {
    fontSize: 18,
    fontWeight: '500',
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginHorizontal: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
