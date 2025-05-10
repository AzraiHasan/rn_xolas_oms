import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormField, TextAreaField, SeveritySelector, DropdownField } from '@/components/forms';
import { PhotoPicker } from '@/components/photos/fixed/PhotoPicker';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useForm } from '@/hooks/forms/useForm';
import { IssueReportInput, IssueSeverity, IssueStatus, Photo } from '@/types/models/Issue';
import { requiredValidator, minLengthValidator } from '@/utils/validation';
import { useIssues } from '@/contexts/IssueContext';

export default function CreateIssueScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createIssue } = useIssues();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm
  } = useForm<Partial<IssueReportInput>>({
    initialValues: {
      title: '',
      description: '',
      location: '',
      severity: IssueSeverity.Medium,
      status: IssueStatus.New,
      photos: [],
      timestamp: new Date().toISOString()
    },
    validators: {
      title: [
        requiredValidator,
        minLengthValidator(3)
      ],
      description: [
        requiredValidator,
        minLengthValidator(10)
      ],
      location: [
        requiredValidator
      ]
    },
    onSubmit: async (formValues) => {
      try {
        setIsSubmitting(true);
        
        // Create the complete issue report input
        const completeIssueInput: IssueReportInput = {
          ...formValues as IssueReportInput,
          timestamp: new Date().toISOString()
        };

        // Create the issue using the context
        await createIssue(completeIssueInput);
        
        // Show success message
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
      } catch (error) {
        console.error('Failed to create issue:', error);
        Alert.alert(
          'Error',
          'Failed to create issue. Please try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Handle photo changes
  const handlePhotosChange = (newPhotos: Photo[]) => {
    handleChange('photos', newPhotos);
  };

  // Handle manual form submission with additional UI feedback
  const handleFormSubmit = () => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    // Run form validation
    const isFormValid = validateForm();
    
    if (isFormValid) {
      handleSubmit();
    } else {
      // Show error alert if validation fails
      Alert.alert(
        'Validation Error',
        'Please fill all required fields correctly.',
        [{ text: 'OK' }]
      );
    }
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
        <FormField
          name="title"
          label="Title"
          required
          placeholder="Enter issue title"
          value={values.title || ''}
          onChangeValue={handleChange}
          onBlur={() => handleBlur('title')}
          error={errors.title}
          isError={!!errors.title}
          validationRules={[requiredValidator, minLengthValidator(3)]}
        />

        <TextAreaField
          name="description"
          label="Description"
          required
          placeholder="Describe the issue in detail"
          value={values.description || ''}
          onChangeValue={handleChange}
          onBlur={() => handleBlur('description')}
          error={errors.description}
          isError={!!errors.description}
          validationRules={[requiredValidator, minLengthValidator(10)]}
          numberOfLines={4}
        />

        <FormField
          name="location"
          label="Location"
          required
          placeholder="Enter issue location"
          value={values.location || ''}
          onChangeValue={handleChange}
          onBlur={() => handleBlur('location')}
          error={errors.location}
          isError={!!errors.location}
          validationRules={[requiredValidator]}
        />

        <SeveritySelector
          label="Severity"
          required
          value={values.severity || IssueSeverity.Medium}
          onChange={(severity) => handleChange('severity', severity)}
        />

        <DropdownField
          label="Status"
          required
          placeholder="Select a status"
          value={values.status || IssueStatus.New}
          options={[
            { value: IssueStatus.New, label: 'New' },
            { value: IssueStatus.Assigned, label: 'Assigned' },
            { value: IssueStatus.InProgress, label: 'In Progress' },
            { value: IssueStatus.Resolved, label: 'Resolved' }
          ]}
          onChange={(status) => handleChange('status', status)}
          isError={!!errors.status}
          error={errors.status}
        />

        <PhotoPicker
          label="Photos"
          photos={values.photos || []}
          onPhotosChange={handlePhotosChange}
          maxPhotos={5}
        />

        <Pressable
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
            isSubmitting && { opacity: 0.7 }
          ]}
          onPress={handleFormSubmit}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.submitButtonText}>
            {isSubmitting ? 'Saving...' : 'Create Issue'}
          </ThemedText>
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
