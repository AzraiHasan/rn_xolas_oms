import React, { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueReportInput, IssueSeverity } from '@/types/models/Issue';

export default function CreateIssueScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState<Partial<IssueReportInput>>({
    title: '',
    description: '',
    location: '',
    severity: IssueSeverity.Medium,
    photos: [],
    timestamp: new Date().toISOString()
  });

  const handleChange = (field: keyof IssueReportInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSeverityChange = (severity: IssueSeverity) => {
    handleChange('severity', severity);
  };

  const handleSubmit = () => {
    // Check if required fields are filled
    if (!formData.title || !formData.description || !formData.location) {
      Alert.alert('Required Fields', 'Please fill all required fields');
      return;
    }

    // Here would be the call to save the new issue
    // For now just show a success message and navigate back
    Alert.alert(
      'Success',
      'New issue created successfully',
      [
        {
          text: 'OK',
          onPress: () => router.navigate('/(tabs)/')
        }
      ]
    );
  };

  // Helper to determine button style based on selection state
  const getSeverityButtonStyle = (severity: IssueSeverity) => {
    const isSelected = formData.severity === severity;
    
    let backgroundColor;
    if (isSelected) {
      switch (severity) {
        case IssueSeverity.High:
          return { backgroundColor: '#E11D48', borderColor: '#E11D48' };
        case IssueSeverity.Medium:
          return { backgroundColor: '#F59E0B', borderColor: '#F59E0B' };
        case IssueSeverity.Low:
          return { backgroundColor: '#10B981', borderColor: '#10B981' };
      }
    }
    
    return {
      backgroundColor: 'transparent',
      borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB'
    };
  };

  const getSeverityTextStyle = (severity: IssueSeverity) => {
    const isSelected = formData.severity === severity;
    return {
      color: isSelected ? '#FFFFFF' : colors.text
    };
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ 
        title: 'New Issue',
        contentStyle: { paddingTop: 0 }
      }} />
      
      <ScrollView 
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Title *</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB',
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F9FAFB'
              }
            ]}
            placeholder="Enter issue title"
            placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
            value={formData.title}
            onChangeText={(text) => handleChange('title', text)}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Description *</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { 
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB',
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F9FAFB'
              }
            ]}
            placeholder="Describe the issue in detail"
            placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
            value={formData.description}
            onChangeText={(text) => handleChange('description', text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Location *</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB',
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F9FAFB'
              }
            ]}
            placeholder="Enter issue location"
            placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
            value={formData.location}
            onChangeText={(text) => handleChange('location', text)}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Severity *</ThemedText>
          <ThemedView style={styles.severityContainer}>
            <Pressable
              style={[
                styles.severityButton,
                getSeverityButtonStyle(IssueSeverity.Low)
              ]}
              onPress={() => handleSeverityChange(IssueSeverity.Low)}
            >
              <ThemedText style={[styles.severityText, getSeverityTextStyle(IssueSeverity.Low)]}>
                Low
              </ThemedText>
            </Pressable>
            
            <Pressable
              style={[
                styles.severityButton,
                getSeverityButtonStyle(IssueSeverity.Medium)
              ]}
              onPress={() => handleSeverityChange(IssueSeverity.Medium)}
            >
              <ThemedText style={[styles.severityText, getSeverityTextStyle(IssueSeverity.Medium)]}>
                Medium
              </ThemedText>
            </Pressable>
            
            <Pressable
              style={[
                styles.severityButton,
                getSeverityButtonStyle(IssueSeverity.High)
              ]}
              onPress={() => handleSeverityChange(IssueSeverity.High)}
            >
              <ThemedText style={[styles.severityText, getSeverityTextStyle(IssueSeverity.High)]}>
                High
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Photos</ThemedText>
          <ThemedView style={styles.photoPlaceholder}>
            <ThemedText style={styles.photoPlaceholderText}>
              Tap to add photos
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <Pressable
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary }
          ]}
          onPress={handleSubmit}
        >
          <ThemedText style={styles.submitButtonText}>Create Issue</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  severityText: {
    fontWeight: '500',
  },
  photoPlaceholder: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    opacity: 0.5,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});
