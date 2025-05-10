import React, { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormField, TextAreaField, SeveritySelector } from '@/components/forms';
import { PhotoPicker } from '@/components/photos/fixed/PhotoPicker';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useForm } from '@/hooks/forms/useForm';
import { IssueReportInput, IssueSeverity, Photo, IssueReport } from '@/types/models/Issue';
import { requiredValidator, minLengthValidator } from '@/utils/validation';
import { issueStorage, fileStorage } from '@/services/StorageService';
import { useIssues } from '@/contexts/IssueContext';

export default function CreateIssueScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshIssues } = useIssues();
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
        
        // Process photos first - save them using the fileStorage service
        const photoPromises = formValues.photos?.map(async (photo) => {
          // Only process photos that have a URI and need to be saved
          // We check if the URI is a local file that needs persistent storage
          if (photo.uri && !photo.uri.startsWith(FileSystem.documentDirectory)) {
            const savedPhoto = await fileStorage.saveImage(photo.uri, photo.title);
            // Return a new photo object with the saved URI
            return {
              ...photo,
              id: savedPhoto.id,
              uri: savedPhoto.uri
            };
          }
          // Photo already saved, return as is
          return photo;
        }) || [];

        // Wait for all photos to be saved
        const savedPhotos = await Promise.all(photoPromises);

        // Create the complete issue report input with saved photos
        const completeIssueInput: IssueReportInput = {
          ...formValues as IssueReportInput,
          photos: savedPhotos,
          timestamp: new Date().toISOString()
        };

        // Save the issue using issueStorage service
        const savedIssue = await issueStorage.createIssue(completeIssueInput);
        
        // Refresh the issues list
        await refreshIssues();
        
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
