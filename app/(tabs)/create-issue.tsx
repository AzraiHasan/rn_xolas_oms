import React from 'react';
import { StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormField, TextAreaField, SeveritySelector } from '@/components/forms';
import { PhotoPicker } from '@/components/photos';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useForm } from '@/hooks/forms/useForm';
import { IssueReportInput, IssueSeverity, Photo } from '@/types/models/Issue';
import { requiredValidator, minLengthValidator } from '@/utils/validation';

export default function CreateIssueScreen() {
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
    onSubmit: (formValues) => {
      // Here would be the call to save the new issue
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
    }
  });

  // Handle photo changes
  const handlePhotosChange = (newPhotos: Photo[]) => {
    handleChange('photos', newPhotos);
  };

  // Handle manual form submission with additional UI feedback
  const handleFormSubmit = () => {
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
            { backgroundColor: colors.primary }
          ]}
          onPress={handleFormSubmit}
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
