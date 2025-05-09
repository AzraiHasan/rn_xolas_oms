import React, { useState, useRef } from 'react';
import {
  View,
  Pressable,
  Modal,
  FlatList,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface SelectOption {
  /**
   * The value of the option
   */
  value: string;
  
  /**
   * The label to display
   */
  label: string;
}

export interface SelectProps {
  /**
   * Array of options to display
   */
  options: SelectOption[];
  
  /**
   * Currently selected value
   */
  value?: string;
  
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;
  
  /**
   * Called when an option is selected
   */
  onValueChange: (value: string) => void;
  
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  
  /**
   * Label for the select
   */
  label?: string;
  
  /**
   * Whether the label is required
   */
  required?: boolean;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether to show the select in error state
   */
  isError?: boolean;
  
  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Additional NativeWind classes
   */
  className?: string;
}

/**
 * Dropdown select component
 */
export function Select({
  options,
  value,
  placeholder = 'Select an option',
  onValueChange,
  disabled = false,
  label,
  required = false,
  error,
  isError = false,
  style,
  className,
}: SelectProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [modalVisible, setModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);
  const { height: windowHeight } = Dimensions.get('window');
  
  const getBorderColor = () => {
    if (disabled) return colorScheme === 'dark' ? '#3E4144' : '#E4E7EB';
    if (isError) return '#E11D48';
    if (isFocused) return colors.tint;
    return colorScheme === 'dark' ? '#3E4144' : '#E4E7EB';
  };
  
  const toggleDropdown = () => {
    if (!disabled) {
      setModalVisible(!modalVisible);
      setIsFocused(!modalVisible);
    }
  };
  
  const selectOption = (optionValue: string) => {
    onValueChange(optionValue);
    setModalVisible(false);
    setIsFocused(false);
  };
  
  return (
    <ThemedView 
      className={`mb-4 ${className || ''}`}
      style={style}
    >
      {/* Label */}
      {label && (
        <View className="flex-row mb-1.5">
          <ThemedText className="text-sm font-medium">{label}</ThemedText>
          {required && <ThemedText className="text-[#E11D48] font-medium"> *</ThemedText>}
        </View>
      )}
      
      {/* Select Button */}
      <Pressable
        onPress={toggleDropdown}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityHint="Tap to open dropdown"
      >
        <ThemedView 
          className={`flex-row items-center justify-between border rounded-lg min-h-[44px] px-3 pr-2 
            ${colorScheme === 'dark' ? 'bg-[#1E1F20]' : 'bg-[#F9FAFB]'} 
            ${disabled ? 'opacity-50' : ''}`
          }
          style={{ borderColor: getBorderColor() }}
        >
          <ThemedText 
            className={`flex-1 py-2.5 text-base ${!selectedOption ? 'text-[#687076] dark:text-[#9BA1A6]' : ''}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </ThemedText>
          
          <IconSymbol 
            name={modalVisible ? "chevron.up" : "chevron.down"} 
            size={20} 
            color={colors.icon} 
          />
        </ThemedView>
      </Pressable>
      
      {/* Error Message */}
      {error && (
        <ThemedText className="text-xs mt-1 text-[#E11D48]">
          {error}
        </ThemedText>
      )}
      
      {/* Dropdown Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          setIsFocused(false);
        }}
      >
        <TouchableWithoutFeedback 
          onPress={() => {
            setModalVisible(false);
            setIsFocused(false);
          }}
        >
          <View className="flex-1 bg-black/30">
            <ThemedView 
              className={`absolute left-0 right-0 mx-4 rounded-lg border border-[#E4E7EB] dark:border-gray-700 
                          p-2 max-h-[${windowHeight / 2.5}px] ${colorScheme === 'dark' ? 'bg-[#121212]' : 'bg-white'}`
              }
              style={{ top: '25%' }}
            >
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => selectOption(item.value)}
                    className={`py-3 px-4 rounded-md mb-1 ${
                      item.value === value 
                        ? colorScheme === 'dark' 
                          ? 'bg-[#3E4144]' 
                          : 'bg-[#F1F5F9]' 
                        : ''
                    }`}
                  >
                    <ThemedText className="text-base">
                      {item.label}
                    </ThemedText>
                  </Pressable>
                )}
              />
            </ThemedView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  );
}
