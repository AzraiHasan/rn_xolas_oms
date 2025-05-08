import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

import { PhotoGallery } from '@/components/photos';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueService } from '@/services/issues/issueService';
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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issue, setIssue] = useState<IssueReport | null>(null);
  
  // Fetch issue data
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const issueData = await IssueService.getIssueById(issueId);
        
        if (issueData) {
          setIssue(issueData);
        } else {
          setError('Issue not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load issue details');
      } finally {
        setLoading(false);
      }
    };
    
    if (issueId) {
      fetchIssue();
    } else {
      setError('Invalid issue ID');
      setLoading(false);
    }
  }, [issueId]);
  
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
  
  // Render the back button
  const renderBackButton = () => (
    <ThemedView style={styles.header}>
      <Link href="/(tabs)/issues" asChild>
        <Button
          label="Back to Issues"
          variant="ghost"
          leftIcon={<IconSymbol size={18} name="chevron.left" color={colors.text} />}
          textStyle={{ color: colors.text }}
        />
      </Link>
    </ThemedView>
  );
  
  // Render content based on state
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        {renderBackButton()}
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
        {renderBackButton()}
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
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      {renderBackButton()}
      
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
          <PhotoGallery photos={issue.photos} title="Photos" />
        </ThemedView>
        
        {/* Action Buttons */}
        <ThemedView style={styles.actionsContainer}>
          <Button
            label="Edit Issue"
            variant="secondary"
            leftIcon={<IconSymbol size={18} name="pencil" color={colors.tint} />}
            style={styles.actionButton}
            onPress={() => {
              // In a real app, navigate to edit screen
              // For now, just show a message
              alert('Edit functionality would be implemented in Sprint 3');
            }}
          />
          <Button
            label="Delete Issue"
            variant="danger"
            leftIcon={<IconSymbol size={18} name="trash.fill" color="#FFFFFF" />}
            style={styles.actionButton}
            onPress={() => {
              // In a real app, show confirmation dialog and delete
              // For now, just navigate back
              alert('Issue would be deleted. Navigating back...');
              router.back();
            }}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
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
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
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
});
