import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      const issueData = getIssueById(issueId);
      setIssue(issueData || null);
      
      if (!issueData) {
        setError('Issue not found');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load issue details');
    } finally {
      setLoading(false);
    }
  }, [issueId, getIssueById]);
  
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
  
  // Render content based on state
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
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
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
          
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="chart-bar" color={colors.icon} />
            <ThemedText style={styles.metaText}>{issue.status}</ThemedText>
          </ThemedView>
          
          <ThemedView style={[
            styles.severityBadge, 
            { backgroundColor: getSeverityColor(issue.severity) }
          ]}>
            <ThemedText style={styles.severityText}>{issue.severity}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* Description Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Description</ThemedText>
          <ThemedText style={styles.description}>{issue.description}</ThemedText>
        </ThemedView>
        
        {/* Photos Section */}
        <ThemedView style={styles.sectionContainer}>
          <PhotoGallery 
            photos={issue.photos} 
            title="Photos" 
            onPhotoRemove={handleRemovePhoto}
          />
        </ThemedView>

        {/* Update History Section */}
        {issue.updates && issue.updates.length > 0 && (
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle">Update History</ThemedText>
            {issue.updates.map((update, index) => (
              <ThemedView key={index} style={styles.updateContainer}>
                <ThemedView style={styles.updateHeader}>
                  <ThemedText style={styles.updateTimestamp}>
                    {formatTimestamp(update.timestamp)}
                  </ThemedText>
                  <ThemedView style={styles.statusChangeContainer}>
                    <ThemedText style={styles.statusText}>
                      {update.previousStatus} → {update.newStatus}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedText style={styles.updateDescription}>
                  {update.description}
                </ThemedText>
                
                {update.photos.length > 0 && (
                  <ThemedView style={styles.updatePhotosContainer}>
                    <ThemedText style={styles.photosSectionTitle}>Photos Added:</ThemedText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
                      {update.photos.map((photo) => (
                        <ThemedView key={photo.id} style={styles.photoThumbnailContainer}>
                          <Image
                            source={{ uri: photo.uri }}
                            style={styles.photoThumbnail}
                            contentFit="cover"
                          />
                        </ThemedView>
                      ))}
                    </ScrollView>
                  </ThemedView>
                )}
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ScrollView>
      
      {/* Action Buttons - Fixed at bottom */}
      <ThemedView style={styles.actionsContainer}>
        <Pressable
          className="flex-1 py-3 md:py-4 rounded-lg items-center justify-center mx-2 border"
          style={{
            backgroundColor: 'transparent',
            borderColor: '#2563EB'
          }}
          onPress={() => {
            router.navigate({
              pathname: '/issue/update/[id]', 
              params: { id: issue.id }
            });
          }}
        >
          <ThemedView className="flex-row items-center justify-center">
            <IconSymbol size={20} name="pencil" color="#2563EB" />
            <ThemedText className="font-medium md:text-base ml-2" style={{ color: '#2563EB' }}>Update</ThemedText>
          </ThemedView>
        </Pressable>
        
        <Pressable
          className="flex-1 py-3 md:py-4 rounded-lg items-center justify-center mx-2 border"
          style={{
            backgroundColor: 'transparent',
            borderColor: '#E11D48'
          }}
          onPress={handleDeleteIssue}
        >
          <ThemedView className="flex-row items-center justify-center">
            <IconSymbol size={20} name="trash.fill" color="#E11D48" />
            <ThemedText className="font-medium md:text-base ml-2" style={{ color: '#E11D48' }}>
              Delete
            </ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}

// Add necessary imports
import { Image } from 'expo-image';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Add extra padding for fixed buttons
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
    padding: 10,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  actionButton: {
    flex: 1,
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
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateTimestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusChangeContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
