import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, ScrollView, View, StyleSheet, Alert, Pressable, Text, TouchableOpacity, Button as NativeButton } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PhotoGallery } from '@/components/photos';
import { SyncIndicator } from '@/components/layout/SyncIndicator';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSyncContext } from '@/contexts/SyncContext';
import { useIssues } from '@/contexts/IssueContext';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

interface IssueDetailScreenProps {
  issueId: string;
}

export function IssueDetailScreen({ issueId }: IssueDetailScreenProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { getIssueById, loading: issuesLoading, removePhotoFromIssue } = useIssues();
  const { getIssueStatus, syncNow } = useSyncContext();
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
  
  // Handle photo removal with confirmation
  const handlePhotoRemove = useCallback((photoId: string) => {
    console.log('handlePhotoRemove called with photoId:', photoId);
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (issue) {
              try {
                const updatedIssue = await removePhotoFromIssue(issue.id, photoId);
                if (updatedIssue) {
                  setIssue(updatedIssue);
                }
              } catch (err) {
                console.error('Failed to remove photo:', err);
                Alert.alert('Error', 'Failed to remove photo. Please try again.');
              }
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [issue, removePhotoFromIssue]);

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
            <Button label="View All Issues" variant="primary" />
          </Link>
        </ThemedView>
      </SafeAreaView>
    );
  }
  
  // Get sync status
  const syncStatus = getIssueStatus(issue.id);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Removed floating Delete button */}
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
          
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>{issue.title}</ThemedText>
            
            {/* Sync Status */}
            <SyncIndicator 
              entityId={issue.id}
              entityType="issue"
              showLabel
              onPress={() => syncNow()}
            />
          </ThemedView>
        </ThemedView>
        
        {/* Meta Information */}
        <ThemedView style={styles.metaContainer}>
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="mappin.circle.fill" color={colors.icon} />
            <ThemedText style={styles.metaText}>{issue.location}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="calendar.circle" color={colors.icon} />
            <ThemedText style={styles.metaText}>{formatTimestamp(issue.timestamp)}</ThemedText>
          </ThemedView>
          
          <ThemedView style={[
            styles.severityBadge, 
            { backgroundColor: getSeverityColor(issue.severity) }
          ]}>
          <ThemedText style={[styles.severityText, { color: issue.severity === IssueSeverity.High ? '#FFFFFF' : undefined }]}>{issue.severity}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* Description Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Description</ThemedText>
          <ThemedText style={styles.description}>{issue.description}</ThemedText>
        </ThemedView>
        
        {/* Photos Section with PhotoGallery Component */}
        <ThemedView style={{marginBottom: 24}}>
          <PhotoGallery 
            photos={issue.photos} 
            title="Photos"
          />
        </ThemedView>
        
      </ScrollView>
      
      {/* Action Buttons - Fixed positioning at bottom */}
      <View style={styles.actionsContainer}>
        <View style={{width: '48%'}}>
          <Button
            label=""
            variant="secondary"
            leftIcon={<IconSymbol size={22} name="pencil" color={colors.tint} />}
            onPress={() => {
              // In a real app, navigate to edit screen
              alert('Edit functionality would be implemented here');
            }}
          />
        </View>
        <View style={{width: '48%'}}>
          <Button
            label=""
            variant="danger"
            leftIcon={<IconSymbol size={22} name="trash.fill" color="#FFFFFF" />}
            onPress={() => {
              // In a real app, show confirmation dialog and delete
              alert('Issue would be deleted. Navigating back...');
              router.back();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Add extra padding at bottom to account for fixed action buttons
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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
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
  // New styles for improved photo gallery
  photoViewer: {
    marginTop: 12,
    marginBottom: 8,
  },
  photoContainer: {
    width: 200,
    height: 200,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoActions: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    minWidth: 90,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    width: '48%',
    height: 50,
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
