import React, { useState, useEffect, useCallback } from 'react';
import { 
  Pressable, 
  Modal, 
  StyleSheet, 
  FlatList, 
  TextInput,
  ActivityIndicator
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Site, SiteOption } from '@/types/models/Site';
import { debounce } from '@/utils/debounce';

interface SearchableSiteSelectorProps {
  /**
   * Currently selected site ID
   */
  value: string;
  
  /**
   * Available site options
   */
  options: SiteOption[];
  
  /**
   * Function called when value changes
   */
  onChange: (value: string) => void;
  
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

export function SearchableSiteSelector({ 
  value, 
  options,
  onChange, 
  required = false,
  label,
  placeholder = "Search for a site",
  error,
  isError = false
}: SearchableSiteSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<SiteOption[]>(options);
  const [isSearching, setIsSearching] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Find the currently selected option to display its label
  const selectedOption = options.find(option => option.value === value);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setIsSearching(true);
      if (!query) {
        setFilteredOptions(options);
        setIsSearching(false);
        return;
      }

      const lowercaseQuery = query.toLowerCase();
      const filtered = options.filter(option => 
        option.label.toLowerCase().includes(lowercaseQuery) || 
        option.value.toLowerCase().includes(lowercaseQuery)
      );
      
      setFilteredOptions(filtered);
      setIsSearching(false);
    }, 300),
    [options]
  );

  // Handle search input changes
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredOptions(options);
  };

  // Reset search when modal opens
  useEffect(() => {
    if (modalVisible) {
      setSearchQuery('');
      setFilteredOptions(options);
    }
  }, [modalVisible, options]);

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
          name="magnify" 
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
              <ThemedText className="text-lg font-medium">{label || "Select Site"}</ThemedText>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </Pressable>
            </ThemedView>
            
            {/* Search input */}
            <ThemedView className="px-4 py-3 border-b" style={{ borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB' }}>
              <ThemedView className="flex-row items-center border rounded-lg px-3 py-2" 
                style={{ 
                  borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB',
                  backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F3F4F6'
                }}
              >
                <MaterialCommunityIcons name="magnify" size={20} color={colors.text} style={{ marginRight: 8 }} />
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  placeholder="Search sites..."
                  placeholderTextColor={colorScheme === 'dark' ? '#9BA3AF' : '#9BA3AF'}
                  style={{ 
                    flex: 1, 
                    color: colors.text,
                    fontSize: 16,
                  }}
                  autoFocus
                />
                {searchQuery ? (
                  <Pressable onPress={clearSearch}>
                    <MaterialCommunityIcons name="close-circle" size={20} color={colors.text} />
                  </Pressable>
                ) : null}
              </ThemedView>
            </ThemedView>
            
            {/* Results list */}
            {isSearching ? (
              <ThemedView className="flex-1 items-center justify-center p-4">
                <ActivityIndicator size="large" color={colors.primary} />
              </ThemedView>
            ) : filteredOptions.length > 0 ? (
              <FlatList
                data={filteredOptions}
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
            ) : (
              <ThemedView className="flex-1 items-center justify-center p-4">
                <MaterialCommunityIcons name="alert-circle-outline" size={40} color={colors.text} style={{ marginBottom: 12 }} />
                <ThemedText className="text-center">No sites found matching "{searchQuery}"</ThemedText>
              </ThemedView>
            )}
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
    maxHeight: '80%',
  },
});
