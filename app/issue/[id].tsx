import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Alert, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { PhotoGallery } from '@/components/photos';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useIssues } from '@/contexts/IssueContext';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

/**
 * Enhanced issue detail screen with photo gallery
 */
export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams();
  const issueId = typeof id === 'string' ? id : '';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { 
    getIssueById, 
    deleteIssue, 
    removePhotoFromIssue,
    loading: issuesLoading 
  } = useIssues();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issue, setIssue] = useState<IssueReport | null>(null);
  
  // Fetch issue data from context
  useEffect(() => {
    if (!issueId) {
      setError('Invalid issue ID');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching issue with ID:', issueId);
      console.log('Current colorScheme:', colorScheme);
      const issueData = getIssueById(issueId);
      console.log('Issue data found:', issueData ? 'YES' : 'NO');
      if (issueData) {
        console.log('Issue updates:', issueData.updates);
        console.log('Dark update container style:', styles.dark_updateContainer);
      }
      setIssue(issueData || null);
      
      if (!issueData) {
        setError('Issue not found');
      }
    } catch (err) {
      console.error('Error fetching issue:', err);
      setError('Failed to load issue details');
    } finally {
      setLoading(false);
    }
  }, [issueId, getIssueById, colorScheme]);
  
  // Format timestamp to a readable date
  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getSeverityColor = (severity: IssueSeverity) => {
    switch (severity) {
      case IssueSeverity.High:
        return '#E11D48';
      case IssueSeverity.Medium:
        return '#F59E0B';
      case IssueSeverity.Low:
        return '#10B981';
      default:
        return colors.text;
    }
  };
  
  const getSeverityIconName = (severity: IssueSeverity) => {
    switch (severity) {
      case IssueSeverity.High:
        return 'exclamationmark.triangle.fill';
      case IssueSeverity.Medium:
        return 'exclamationmark.circle.fill';
      case IssueSeverity.Low:
        return 'info.circle.fill';
      default:
        return 'circle.fill';
    }
  };
  
  // Handle issue deletion
  const handleDeleteIssue = () => {
    if (!issue) return;
    
    Alert.alert(
      'Delete Issue',
      'Are you sure you want to delete this issue? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteIssue(issue.id);
              
              if (success) {
                Alert.alert(
                  'Success',
                  'Issue deleted successfully',
                  [
                    {
                      text: 'OK',
                      onPress: () => router.navigate('/(tabs)')
                    }
                  ]
                );
              } else {
                throw new Error('Failed to delete issue');
              }
            } catch (error) {
              console.error('Error deleting issue:', error);
              Alert.alert(
                'Error',
                'Failed to delete issue. Please try again.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };
  
  // Handle photo deletion
  const handleRemovePhoto = (photoId: string) => {
    if (!issue) return;
    
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedIssue = await removePhotoFromIssue(issue.id, photoId);
              
              if (updatedIssue) {
                setIssue(updatedIssue);
                Alert.alert('Success', 'Photo removed successfully');
              } else {
                throw new Error('Failed to remove photo');
              }
            } catch (error) {
              console.error('Error removing photo:', error);
              Alert.alert(
                'Error',
                'Failed to remove photo. Please try again.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };
  
  const darkContainerStyle = colorScheme === 'dark' ? {
    borderColor: '#3E4144',
    backgroundColor: 'rgba(30, 31, 32, 0.5)',
  } : {};
  
  const darkStatusStyle = colorScheme === 'dark' ? {
    backgroundColor: '#2D3033',
  } : {};
  
  // Render content based on state
  if (loading || issuesLoading) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <ThemedView style={[styles.statusBarBackground, { height: insets.top }]} />
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Loading issue details...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }
  
  if (error || !issue) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <ThemedView style={[styles.statusBarBackground, { height: insets.top }]} />
        <ThemedView style={styles.errorContainer}>
          <IconSymbol 
            size={48} 
            name="exclamationmark.triangle.fill" 
            color="#E11D48" 
          />
          <ThemedText style={styles.errorText}>{error || 'Issue not found'}</ThemedText>
          <Link href="/(tabs)/issues" asChild>
            <Pressable
              className="py-3 md:py-4 rounded-lg items-center justify-center mx-1 border"
              style={{
                backgroundColor: colors.tint,
                borderColor: colors.tint,
                paddingHorizontal: 16
              }}
            >
              <ThemedText style={{ color: '#FFFFFF' }} className="font-medium md:text-base">
                View All Issues
              </ThemedText>
            </Pressable>
          </Link>
        </ThemedView>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Status Bar Background */}
      <ThemedView style={[styles.statusBarBackground, { height: insets.top }]} />
      
      {/* Custom Header */}
      <ThemedView style={styles.headerContainer}>
        <Pressable 
          onPress={() => router.back()} 
          style={[styles.backButton, { 
            backgroundColor: colorScheme === 'dark' ? colors.dark[700] : '#FFFFFF',
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? colors.dark[500] : '#666666'
          }]}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <ThemedText type="title" style={styles.headerTitle}>Issue Details</ThemedText>
        <ThemedView style={styles.headerRight} />
      </ThemedView>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Issue Header */}
        <ThemedView style={styles.issueHeader}>
          <ThemedView style={[
            styles.severityIndicator, 
            { backgroundColor: getSeverityColor(issue.severity) }
          ]}>
            <IconSymbol 
              name={getSeverityIconName(issue.severity)} 
              size={20} 
              color="#FFFFFF" 
            />
          </ThemedView>
          
          <ThemedText type="title" style={styles.title}>{issue.title}</ThemedText>
        </ThemedView>
        
        {/* Meta Information */}
        <ThemedView style={styles.metaContainer}>
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="mappin.circle.fill" color={colors.icon} />
            <ThemedText style={styles.metaText}>{issue.location}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="calendar" color={colors.icon} />
            <ThemedText style={styles.metaText}>{formatTimestamp(issue.timestamp)}</ThemedText>
          </ThemedView>
          
          <ThemedView className="mr-4"></ThemedView>
          
          <ThemedView style={[
            styles.severityBadge, 
            { backgroundColor: getSeverityColor(issue.severity) }
          ]}>
            <ThemedText style={styles.severityText}>{issue.severity}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="chart-bar" color={colors.icon} />
            <ThemedText style={styles.metaText}>{issue.status}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* Description Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Description</ThemedText>
          <ThemedText style={styles.description}>{issue.description}</ThemedText>
        </ThemedView>
        
        {/* Photos Section */}
        <ThemedView style={[styles.sectionContainer, { marginBottom: 12 }]}>
          <PhotoGallery 
            photos={issue.photos} 
            title="Photos" 
            onPhotoRemove={handleRemovePhoto}
          />
        </ThemedView>

        {/* Update History Section */}
        {issue.updates && issue.updates.length > 0 && (
          <ThemedView style={[styles.sectionContainer, { marginTop: 0 }]}>
            <ThemedText type="subtitle">Update History</ThemedText>
            {console.log('Rendering updates, count:', issue.updates.length)}
            {console.log('colorScheme in render:', colorScheme)}
            {issue.updates.map((update, index) => {
              console.log('Rendering update:', index, typeof update);
              
              // Skip if update is not a valid object
              if (!update || typeof update !== 'object') {
                console.log('Update is null, undefined, or not an object');
                return null;
              }
              
              // Make sure timestamp exists
              const timestamp = update.timestamp || new Date().toISOString();
              const description = update.description || 'No description';
              const previousStatus = update.previousStatus || 'Unknown';
              const newStatus = update.newStatus || 'Unknown';
              
              // Use empty array if photos is undefined
              const photosArray = update.photos && Array.isArray(update.photos) ? update.photos : [];
              console.log('Photos array length:', photosArray.length);
              
              return (
                <ThemedView key={index} style={[styles.updateContainer, darkContainerStyle]}>
                  <ThemedText style={styles.updateTimestamp}>
                    {formatTimestamp(timestamp)}
                  </ThemedText>
                  <ThemedView style={[styles.statusChangeContainer, darkStatusStyle]}>
                    <ThemedText style={styles.statusText}>
                      {previousStatus} → {newStatus}
                    </ThemedText>
                  </ThemedView>
                  
                  <ThemedText style={styles.updateDescription}>
                    {description}
                  </ThemedText>
                  
                  {update.photos && Array.isArray(update.photos) && update.photos.length > 0 && (
                    <ThemedView style={styles.updatePhotosContainer}>
                      <ThemedText style={styles.photosSectionTitle}>Photos Added:</ThemedText>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
                        {console.log('Photos data structure:', JSON.stringify(update.photos))}
                        {update.photos.map((photo, photoIndex) => {
                          console.log('Processing photo:', photo);
                          if (!photo || !photo.id || !photo.uri) {
                            console.log('Invalid photo data at index', photoIndex);
                            return null;
                          }
                          return (
                            <ThemedView key={photo.id} style={styles.photoThumbnailContainer}>
                              <Image
                                source={{ uri: photo.uri }}
                                style={styles.photoThumbnail}
                                contentFit="cover"
                              />
                            </ThemedView>
                          );
                        })}
                      </ScrollView>
                    </ThemedView>
                  )}
                </ThemedView>
              );
            })}
          </ThemedView>
        )}
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
            styles.updateButton
          ]}
          onPress={() => {
            router.navigate({
              pathname: '/issue/update/[id]', 
              params: { id: issue.id }
            });
          }}
        >
          <IconSymbol size={28} name="pencil-circle" color="#2563EB" />
          <ThemedText style={[styles.buttonText, { color: '#2563EB', marginTop: 2 }]}>Update</ThemedText>
        </Pressable>
        
        <Pressable
          style={[
            styles.actionButton,
            styles.deleteButton
          ]}
          onPress={handleDeleteIssue}
        >
          <IconSymbol size={28} name="delete-circle" color="#E11D48" />
          <ThemedText style={[styles.buttonText, { color: '#E11D48', marginTop: 2 }]}>Delete</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarBackground: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
  headerRight: {
    width: 24, // To balance the layout
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Add extra padding for fixed buttons to match actionsContainer height
    paddingTop: 0, // Reduced top padding since we have the header
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  severityIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    flex: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 6,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
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
  updateButton: {
    // Specific styles for update button
  },
  deleteButton: {
    // Specific styles for delete button
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
  updateContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  dark_updateContainer: {
    borderColor: '#3E4144',
    backgroundColor: 'rgba(30, 31, 32, 0.5)',
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateTimestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  statusChangeContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  dark_statusChangeContainer: {
    backgroundColor: '#2D3033',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  updateDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  updatePhotosContainer: {
    marginTop: 8,
  },
  photosSectionTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  photoScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  photoThumbnailContainer: {
    marginRight: 8,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});
