import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Alert, Pressable, Platform, Modal, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { PhotoGallery } from '@/components/photos';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Header, PageLayout } from '@/components/layouts';
import { Colors } from '@/constants/Colors';
import { findSiteById } from '@/constants/Sites';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useIssues } from '@/contexts/IssueContext';
import { IssueReport, IssueSeverity, Photo } from '@/types/models/Issue';

/**
 * Enhanced issue detail screen with photo gallery
 */
export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams();
  const issueId = typeof id === 'string' ? id : '';
  const router = useRouter();
  
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
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  
  // Get site information
  const siteInfo = issue ? findSiteById(issue.siteId) : null;
  
  // Fetch issue data from context
  useEffect(() => {
    if (!issueId) {
      setError('Invalid issue ID');
      setLoading(false);
      return;
    }
    
    try {
      const issueData = getIssueById(issueId);
      setIssue(issueData || null);
      
      if (!issueData) {
        setError('Issue not found');
      }
    } catch (err) {
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
      <PageLayout
        header={<Header title="Issue Details" showBackButton={true} />}
      >
        <ThemedView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText className="mt-4 text-base">Loading issue details...</ThemedText>
        </ThemedView>
      </PageLayout>
    );
  }
  
  if (error || !issue) {
    return (
      <PageLayout
        header={<Header title="Issue Details" showBackButton={true} />}
      >
        <ThemedView className="flex-1 items-center justify-center px-6">
          <IconSymbol 
            size={48} 
            name="exclamationmark.triangle.fill" 
            color="#E11D48" 
          />
          <ThemedText className="text-red-600 text-base text-center my-4">{error || 'Issue not found'}</ThemedText>
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
      </PageLayout>
    );
  }
  
  return (
    <PageLayout
      header={<Header title="Issue Details" showBackButton={true} />}
      disableSafeArea={true}
      disableScrolling={true}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Issue Header */}
        <ThemedView style={styles.issueHeader}>
          <ThemedText type="title" style={styles.title}>{issue.title}</ThemedText>
          <ThemedView style={[
            styles.severityBadge, 
            { backgroundColor: getSeverityColor(issue.severity) }
          ]}>
            <ThemedText style={[styles.severityText, { color: '#FFFFFF' }]}>{issue.severity}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* Meta Information */}
        <ThemedView style={styles.metaContainer}>
          <ThemedView style={[styles.metaItem, { width: '100%' }]}>
            <IconSymbol size={16} name="folder.fill" color={colors.icon} />
            <ThemedText style={styles.metaText}>{issue.category}</ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.metaItem, { width: '100%' }]}>
            <MaterialCommunityIcons name="antenna" size={16} color={colors.icon} />
            <ThemedText style={styles.metaText}>{issue.siteId}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="mappin.circle.fill" color={colors.icon} />
            <ThemedText style={styles.metaText}>{siteInfo?.siteName || 'Unknown Site'}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="checkmark.circle.fill" color={colors.icon} />
            <ThemedText style={styles.metaText}>{siteInfo?.status || 'Unknown Status'}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="calendar" color={colors.icon} />
            <ThemedText style={styles.metaText}>{formatTimestamp(issue.timestamp)}</ThemedText>
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
        <ThemedView style={[styles.sectionContainer, { marginBottom: 0 }]}>
          <PhotoGallery 
            photos={issue.photos.filter(photo => {
              // Filter out photos that appear in updates
              if (!issue.updates || !Array.isArray(issue.updates)) return true;
              
              // Check if this photo appears in any update
              for (const update of issue.updates) {
                if (!update.photos || !Array.isArray(update.photos)) continue;
                
                // Look for matching photo ID
                if (update.photos.some(updatePhoto => updatePhoto.id === photo.id)) {
                  return false; // Filter out this photo
                }
              }
              
              return true; // Include photos not found in updates
            })} 
            title="Photos" 
            onPhotoRemove={handleRemovePhoto}
          />
        </ThemedView>

        {/* Update History Section */}
        <ThemedView style={[styles.sectionContainer, { marginTop: -30 }]}>
          <ThemedText type="subtitle">Update History</ThemedText>
          
          {!issue.updates || issue.updates.length === 0 ? (
            <ThemedView className="items-center justify-center p-6 border border-[#E4E7EB] dark:border-gray-700 border-dashed rounded-lg mt-4">
              <IconSymbol name="history" size={24} color={colors.icon} />
              <ThemedText className="mt-2 text-[#687076] dark:text-gray-400">No updates yet</ThemedText>
            </ThemedView>
          ) : (
            issue.updates.map((update, index) => {
              // Skip if update is not a valid object
              if (!update || typeof update !== 'object') {
                return null;
              }
              
              // Make sure timestamp exists
              const timestamp = update.timestamp || new Date().toISOString();
              const description = update.description || 'No description';
              const previousStatus = update.previousStatus || 'Unknown';
              const newStatus = update.newStatus || 'Unknown';
              
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
                        {update.photos.map((photo, photoIndex) => {
                          if (!photo || !photo.id || !photo.uri) {
                            return null;
                          }
                          return (
                            <TouchableOpacity 
                              key={photo.id} 
                              style={styles.photoThumbnailContainer}
                              onPress={() => {
                                setSelectedPhoto(photo);
                                setPhotoModalVisible(true);
                              }}
                            >
                              <Image
                                source={{ uri: photo.uri }}
                                style={styles.photoThumbnail}
                                contentFit="cover"
                              />
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </ThemedView>
                  )}
                </ThemedView>
              );
            })
          )}
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
            styles.updateButton
          ]}
          onPress={() => {
            router.navigate({
              pathname: '/issue/update/[id]', 
              params: { id: issue.id }
            });
          }}
        >
          <IconSymbol size={28} name="pencil-circle" color="#FF5A1F" />
          <ThemedText style={[styles.buttonText, { color: '#FF5A1F', marginTop: 2 }]}>Update</ThemedText>
        </Pressable>
        
        <Pressable
          style={[
            styles.actionButton,
            styles.deleteButton
          ]}
          onPress={() => router.navigate('/(tabs)')}
        >
          <IconSymbol size={28} name="close-circle" color="#000000" />
          <ThemedText style={[styles.buttonText, { color: '#000000', marginTop: 2 }]}>Cancel</ThemedText>
        </Pressable>
      </ThemedView>
      
      {/* Photo Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={photoModalVisible}
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <Pressable 
          style={styles.photoModalContainer}
          onPress={() => setPhotoModalVisible(false)}
        >
          <ThemedView style={styles.photoModalContent}>
            {selectedPhoto && (
              <Image
                source={{ uri: selectedPhoto.uri }}
                style={styles.photoModalImage}
                contentFit="contain"
              />
            )}
            <Pressable 
              style={styles.photoModalCloseButton}
              onPress={() => setPhotoModalVisible(false)}
            >
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </Pressable>
          </ThemedView>
        </Pressable>
      </Modal>
    </PageLayout>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Add extra padding for fixed buttons to match actionsContainer height
    paddingTop: 16, // Added padding at the top for spacing below header
    marginTop: 8, // Extra margin between header and content
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
  photoModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoModalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  photoModalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoModalCloseButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    backgroundColor: 'transparent',
    padding: 8,
  },
});
