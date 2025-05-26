import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Header, PageLayout } from '@/components/layouts';
import { FormField, TextAreaField, SeveritySelector, DropdownField, SearchableSiteSelector } from '@/components/forms';
import { PhotoPicker } from '@/components/photos/fixed/PhotoPicker';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useForm } from '@/hooks/forms/useForm';
import { IssueReportInput, IssueSeverity, IssueStatus, IssueCategory, Photo } from '@/types/models/Issue';
import { getSiteOptions } from '@/constants/Sites';
import { requiredValidator, minLengthValidator } from '@/utils/validation';
import { useIssues } from '@/contexts/IssueContext';
import { ValidationRule } from '@/utils/validation';

// Create validators that handle potentially undefined values
const safeRequiredValidator: ValidationRule<string | undefined> = {
  validator: (value?: string) => !!value,
  message: 'This field is required'
};

const safeMinLengthValidator = (minLength: number): ValidationRule<string | undefined> => ({
  validator: (value?: string) => value ? value.length >= minLength : false,
  message: `Must be at least ${minLength} characters`
});

export default function CreateIssueScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createIssue } = useIssues();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
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
      category: IssueCategory.Docket,
      siteId: '',
      description: '',
      severity: IssueSeverity.Medium,
      status: IssueStatus.New,
      photos: [],
      timestamp: new Date().toISOString()
    },
    validators: {
      title: [
        safeRequiredValidator,
        safeMinLengthValidator(3)
      ],
      category: [
        safeRequiredValidator
      ],
      siteId: [
        safeRequiredValidator
      ],
      description: [
        safeRequiredValidator,
        safeMinLengthValidator(10)
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
              onPress: () => router.navigate('/')
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
    handleChangeValue('photos', newPhotos);
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
  
  // Type-safe wrapper for handleChange
  const handleChangeValue = (name: string, value: any) => {
    handleChange(name as any, value);
  };

  return (
    <PageLayout
      header={<Header title="New Issue" />}
      disableSafeArea={true}
    >
      <Stack.Screen options={{ 
        headerShown: false,
        tabBarStyle: { display: 'none' } // Hide tab bar on this screen
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
          onChangeValue={handleChangeValue}
          onBlur={() => handleBlur('title')}
          error={errors.title}
          isError={!!errors.title}
          validationRules={[requiredValidator, minLengthValidator(3)]}
        />

        <DropdownField
          label="Category"
          required
          placeholder="Select a category"
          value={values.category || IssueCategory.Docket}
          options={[
            { value: IssueCategory.Docket, label: 'Docket' },
            { value: IssueCategory.Vandalism, label: 'Vandalism' },
            { value: IssueCategory.Corrective, label: 'Corrective' },
            { value: IssueCategory.Preventive, label: 'Preventive' },
            { value: IssueCategory.Audit, label: 'Audit' }
          ]}
          onChange={(category) => handleChangeValue('category', category)}
          isError={!!errors.category}
          error={errors.category}
        />

        <SearchableSiteSelector
          label="Site"
          required
          placeholder="Search for a site"
          value={values.siteId || ''}
          options={getSiteOptions()}
          onChange={(siteId) => handleChangeValue('siteId', siteId)}
          isError={!!errors.siteId}
          error={errors.siteId}
        />

        <TextAreaField
          name="description"
          label="Description"
          required
          placeholder="Describe the issue in detail"
          value={values.description || ''}
          onChangeValue={handleChangeValue}
          onBlur={() => handleBlur('description')}
          error={errors.description}
          isError={!!errors.description}
          validationRules={[requiredValidator, minLengthValidator(10)]}
          numberOfLines={4}
        />

        <SeveritySelector
          label="Severity"
          required
          value={values.severity || IssueSeverity.Medium}
          onChange={(severity) => handleChangeValue('severity', severity)}
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
          onChange={(status) => handleChangeValue('status', status)}
          isError={!!errors.status}
          error={errors.status}
        />

        <PhotoPicker
          label="Photos"
          photos={values.photos || []}
          onPhotosChange={handlePhotosChange}
          maxPhotos={5}
        />

        {/* Buttons will be in the footer instead */}
      </ScrollView>
      
      {/* Fixed action buttons at the bottom */}
      <ThemedView style={[
        styles.actionsContainer,
        { 
          backgroundColor: Platform.select({
            ios: 'transparent', // Use transparent on iOS for blur effect
            android: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
            default: colorScheme === 'dark' ? '#121212' : '#FFFFFF'
          }),
          borderTopColor: colorScheme === 'dark' ? '#333333' : '#EEEEEE',
          borderTopWidth: Platform.OS === 'ios' ? 0 : 1 // No border on iOS
        }
      ]}>
        <Pressable
          style={[
            styles.actionButton
          ]}
          onPress={handleFormSubmit}
          disabled={isSubmitting}
        >
          <MaterialCommunityIcons 
            name="check-circle" 
            size={28} 
            color="#FF5A1F" // Match tab bar active color
          />
          <ThemedText style={[styles.buttonText, { color: '#FF5A1F', marginTop: 2 }]}>
            {isSubmitting ? 'Saving...' : 'Create'}
          </ThemedText>
        </Pressable>
        
        <Pressable
          style={[
            styles.actionButton,
            styles.cancelButton
          ]}
          onPress={() => router.navigate('/')}
        >
          <MaterialCommunityIcons 
            name="close-circle" 
            size={28} 
            color={colors.text}
          />
          <ThemedText style={[styles.buttonText, { color: colors.text, marginTop: 2 }]}>
            Cancel
          </ThemedText>
        </Pressable>
      </ThemedView>

    </PageLayout>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: 100, // Add extra padding to account for the fixed buttons
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24, // Extra padding at the bottom to match tab bar
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 90, // Total height to match tab bar
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  }
});
