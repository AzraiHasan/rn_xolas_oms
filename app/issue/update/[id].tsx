import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Alert, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoPicker } from '@/components/photos/fixed/PhotoPicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DropdownField, TextAreaField } from '@/components/forms';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useIssues } from '@/contexts/IssueContext';
import { IssueReport, IssueStatus, Photo } from '@/types/models/Issue';
import { CameraService } from '@/services/photos/CameraService';

export default function UpdateIssueScreen() {
  const { id } = useLocalSearchParams();
  const issueId = typeof id === 'string' ? id : '';
  const router = useRouter();
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { 
    getIssueById, 
    updateIssue,
    loading: issuesLoading 
  } = useIssues();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issue, setIssue] = useState<IssueReport | null>(null);
  
  // Update form state
  const [status, setStatus] = useState<IssueStatus | null>(null);
  const [updateDescription, setUpdateDescription] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  
  // Fetch issue data
  useEffect(() => {
    if (!issueId) {
      setError('Invalid issue ID');
      setLoading(false);
      return;
    }
    
    try {
      const issueData = getIssueById(issueId);
      
      if (!issueData) {
        setError('Issue not found');
      } else {
        setIssue(issueData);
        setStatus(issueData.status);
        // Initialize with empty array for new photos only
        setPhotos([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load issue details');
    } finally {
      setLoading(false);
    }
  }, [issueId, getIssueById]);
  
  // Filter out the 'New' status option
  const getStatusOptions = () => {
    return Object.values(IssueStatus)
      .filter(s => s !== IssueStatus.New)
      .map(s => ({ value: s, label: s }));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!issue) return;
    
    // Validate form
    if (!status) {
      Alert.alert('Error', 'Please select a status');
      return;
    }
    
    if (updateDescription.trim() === '') {
      Alert.alert('Error', 'Please provide a description for the update');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create update entry
      // All photos in the photos state are new uploads
      const newPhotos = photos;
      
      const update = {
        timestamp: new Date().toISOString(),
        description: updateDescription,
        photos: newPhotos,
        previousStatus: issue.status,
        newStatus: status
      };
      
      // Create updated issue
      const updatedIssue: IssueReport = {
        ...issue,
        status,
        photos: [...issue.photos, ...newPhotos], // Add new photos to existing ones
        updates: [...(issue.updates || []), update]
      };
      
      // Save changes
      await updateIssue(updatedIssue);
      
      Alert.alert(
        'Success',
        'Issue updated successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error updating issue:', error);
      Alert.alert(
        'Error',
        'Failed to update issue. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  // Add new photos
  const handlePhotosChange = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
  };
  
  // Handle adding a photo from camera
  const handleTakePhoto = async () => {
    try {
      const photo = await CameraService.takePhoto();
      if (photo) {
        setPhotos([...photos, photo]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  // Handle adding a photo from gallery
  const handleSelectPhoto = async () => {
    try {
      const photo = await CameraService.selectPhoto();
      if (photo) {
        setPhotos([...photos, photo]);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };
  
  // Render loading state
  if (loading || issuesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Loading issue details...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }
  
  // Render error state
  if (error || !issue) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <ThemedView style={styles.errorContainer}>
          <IconSymbol 
            size={48} 
            name="exclamationmark.triangle.fill" 
            color="#E11D48" 
          />
          <ThemedText style={styles.errorText}>{error || 'Issue not found'}</ThemedText>
          <Pressable
            className="py-3 rounded-lg items-center justify-center mx-1 border"
            style={{
              backgroundColor: colors.tint,
              borderColor: colors.tint,
              paddingHorizontal: 16
            }}
            onPress={() => router.back()}
          >
            <ThemedText style={{ color: '#FFFFFF' }} className="font-medium">
              Go Back
            </ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Issue Information Header */}
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title">Update Issue</ThemedText>
          <ThemedText style={styles.subtitle}>{issue.title}</ThemedText>
        </ThemedView>
        
        {/* Update Form */}
        <ThemedView style={styles.formContainer}>
          {/* Status Dropdown */}
          <DropdownField
            label="Status"
            required
            placeholder="Select a status"
            value={status || ''}
            options={getStatusOptions()}
            onChange={(value) => setStatus(value as IssueStatus)}
            isError={false}
            error=""
          />
          
          {/* Update Description */}
          <TextAreaField
            name="updateDescription"
            label="Update Description"
            required
            placeholder="Describe the reason for this status update"
            value={updateDescription}
            onChangeValue={(_, value) => setUpdateDescription(value)}
            error=""
            isError={false}
            numberOfLines={4}
          />
          
          {/* Photo Management - Only for adding new photos */}
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Add New Photos</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Upload new photos to document this update
            </ThemedText>
            
            <PhotoPicker
              photos={photos}
              onPhotosChange={handlePhotosChange}
              maxPhotos={10} // Allow up to 10 new photos
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
      
      {/* Action Buttons - Fixed at bottom */}
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
            styles.actionButton,
            styles.submitButton,
            { opacity: submitting ? 0.7 : 1 }
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <IconSymbol size={28} name="check-circle" color="#2563EB" />
          <ThemedText style={[styles.buttonText, { color: '#2563EB', marginTop: 2 }]}>
            {submitting ? 'Updating...' : 'Save'}
          </ThemedText>
        </Pressable>
        
        <Pressable
          style={[
            styles.actionButton,
            styles.cancelButton
          ]}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <IconSymbol size={28} name="close-circle" color="#6B7280" />
          <ThemedText style={[styles.buttonText, { color: '#6B7280', marginTop: 2 }]}>Cancel</ThemedText>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra space for buttons
  },
  headerContainer: {
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
    fontSize: 16,
  },
  formContainer: {
    gap: 16,
  },
  sectionContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionDescription: {
    marginBottom: 16,
    opacity: 0.7,
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
    // Specific styles for cancel button
  },
  submitButton: {
    // Specific styles for submit button
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#E11D48',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
});
