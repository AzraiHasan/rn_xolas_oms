import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
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
  
  /**
   * Additional className for styling with NativeWind
   */
  className?: string;
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
  className,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const getContainerClasses = () => {
    // Base classes for all buttons
    let classes = 'items-center justify-center';
    
    // Size classes
    switch (size) {
      case 'small':
        classes += ' py-1.5 px-3 rounded-md';
        break;
      case 'medium':
        classes += ' py-2.5 px-4 rounded-lg';
        break;
      case 'large':
        classes += ' py-3.5 px-5 rounded-xl';
        break;
      default:
        classes += ' py-2.5 px-4 rounded-lg';
    }
    
    // Variant classes
    switch (variant) {
      case 'primary':
        classes += ` bg-[${colors.tint}]`;
        break;
      case 'secondary':
        classes += ` bg-transparent border-2 border-[${colors.tint}]`;
        break;
      case 'danger':
        classes += ' bg-[#E11D48]';
        break;
      case 'ghost':
        classes += ' bg-transparent';
        break;
      default:
        classes += ` bg-[${colors.tint}]`;
    }
    
    // Add custom classes
    if (className) {
      classes += ` ${className}`;
    }
    
    return classes;
  };
  
  const getTextClasses = () => {
    // Base text classes
    let classes = 'font-medium';
    
    // Size-specific text classes
    switch (size) {
      case 'small':
        classes += ' text-sm';
        break;
      case 'medium':
        classes += ' text-base';
        break;
      case 'large':
        classes += ' text-lg';
        break;
      default:
        classes += ' text-base';
    }
    
    return classes;
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return colors.tint;
      case 'danger':
        return '#FFFFFF';
      case 'ghost':
        return colors.text;
      default:
        return '#FFFFFF';
    }
  };
  
  return (
    <Pressable
      className={getContainerClasses()}
      style={({ pressed }) => [
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.5 },
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
        <View className="flex-row items-center justify-center">
          {leftIcon && <View className="mx-1.5">{leftIcon}</View>}
          <ThemedText style={[{ color: getTextColor() }, textStyle]} className={getTextClasses()}>
            {label}
          </ThemedText>
          {rightIcon && <View className="mx-1.5">{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}
