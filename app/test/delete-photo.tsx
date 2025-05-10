import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Button, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useIssues } from '@/contexts/IssueContext';
import { IssueReport, Photo } from '@/types/models/Issue';

/**
 * Specialized test screen for photo deletion
 */
export default function DeletePhotoTestScreen() {
  const { issues, removePhotoFromIssue } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);
  
  // Get the first issue with photos
  useEffect(() => {
    const issueWithPhotos = issues.find(issue => issue.photos.length > 0);
    if (issueWithPhotos) {
      setSelectedIssue(issueWithPhotos);
      console.log(`Found issue with ${issueWithPhotos.photos.length} photos`);
    }
  }, [issues]);
  
  const handleDeletePhoto = (photo: Photo) => {
    console.log('Delete button pressed for photo:', photo.id);
    
    if (!selectedIssue) return;
    
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Confirmed delete for photo:', photo.id);
              const updatedIssue = await removePhotoFromIssue(selectedIssue.id, photo.id);
              
              if (updatedIssue) {
                console.log('Photo deleted successfully');
                setSelectedIssue(updatedIssue);
                Alert.alert('Success', 'Photo deleted successfully');
              }
            } catch (err) {
              console.error('Error deleting photo:', err);
              Alert.alert('Error', 'Failed to delete photo');
            }
          }
        }
      ]
    );
  };
  
  if (!selectedIssue) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.title}>No issues with photos found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Photo Deletion Test</Text>
        <Text style={styles.issueTitle}>Issue: {selectedIssue.title}</Text>
        <Text style={styles.photoCount}>Photos: {selectedIssue.photos.length}</Text>
        
        <View style={styles.photosContainer}>
          {selectedIssue.photos.map((photo, index) => (
            <View key={photo.id} style={styles.photoItem}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.photoImage}
                contentFit="cover"
              />
              <View style={styles.photoDetails}>
                <Text style={styles.photoId}>ID: {photo.id}</Text>
                <Button
                  title="DELETE THIS PHOTO"
                  color="#E11D48"
                  onPress={() => handleDeletePhoto(photo)}
                />
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Go Back"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  photoCount: {
    fontSize: 16,
    marginBottom: 20,
  },
  photosContainer: {
    marginBottom: 20,
  },
  photoItem: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  photoImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  photoDetails: {
    marginTop: 10,
  },
  photoId: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  }
});
