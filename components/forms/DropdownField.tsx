import React, { useState } from 'react';
import { Pressable, Modal, StyleSheet, ScrollView, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownFieldProps<T extends string> {
  /**
   * Currently selected value
   */
  value: T;
  
  /**
   * Available options for the dropdown
   */
  options: DropdownOption<T>[];
  
  /**
   * Function called when value changes
   */
  onChange: (value: T) => void;
  
  /**
   * Whether the field is required
   */
  required?: boolean;
  
  /**
   * Label for the field
   */
  label?: string;

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;

  /**
   * Optional error message to display
   */
  error?: string;

  /**
   * Whether the field is in error state
   */
  isError?: boolean;
}

export function DropdownField<T extends string>({ 
  value, 
  options,
  onChange, 
  required = false,
  label,
  placeholder = "Select an option",
  error,
  isError = false
}: DropdownFieldProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Find the currently selected option to display its label
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <ThemedView className="mb-5">
      {label && (
        <ThemedView className="flex-row mb-1.5">
          <ThemedText className="text-sm font-medium">{label}</ThemedText>
          {required && <ThemedText className="text-[#E11D48] font-medium"> *</ThemedText>}
        </ThemedView>
      )}
      
      <Pressable
        className={`flex-row items-center justify-between border rounded-lg px-4 py-3 md:py-4 ${isError ? 'border-[#E11D48]' : ''}`}
        style={{ 
          borderColor: isError ? '#E11D48' : (colorScheme === 'dark' ? '#3E4144' : '#E4E7EB'),
          backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' 
        }}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText 
          className={`${!selectedOption ? 'text-gray-400' : ''}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </ThemedText>
        <MaterialCommunityIcons 
          name="chevron-down" 
          size={20} 
          color={colors.text} 
        />
      </Pressable>
      
      {isError && error && (
        <ThemedText className="text-[#E11D48] text-sm mt-1">{error}</ThemedText>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <ThemedView 
            className="rounded-t-xl"
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === 'dark' ? '#1F1F1F' : '#FFFFFF' }
            ]}
            onTouchEnd={e => e.stopPropagation()}
          >
            <ThemedView className="flex-row justify-between items-center p-4 border-b" style={{ borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB' }}>
              <ThemedText className="text-lg font-medium">{label || "Select Option"}</ThemedText>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </Pressable>
            </ThemedView>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  className="p-4 border-b" 
                  style={{ 
                    borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB',
                    backgroundColor: item.value === value 
                      ? (colorScheme === 'dark' ? '#3B4252' : '#F3F4F6') 
                      : 'transparent'
                  }}
                  onPress={() => {
                    onChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <ThemedView className="flex-row items-center justify-between">
                    <ThemedText>{item.label}</ThemedText>
                    {item.value === value && (
                      <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                    )}
                  </ThemedView>
                </Pressable>
              )}
            />
          </ThemedView>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    maxHeight: '70%',
  },
});
