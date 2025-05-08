import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

// Mock data for demonstration purposes
const MOCK_ISSUES: Record<string, IssueReport> = {
  '1': {
    id: '1',
    title: 'Broken pipe in northeast corner',
    description: 'Water leaking from ceiling in the northeast corner of building A. Damage visible on drywall and carpet is wet.',
    location: 'Building A, Floor 2, Room 203',
    timestamp: new Date(2024, 4, 1).toISOString(),
    severity: IssueSeverity.High,
    photos: [
      {
        id: '1a',
        uri: 'https://picsum.photos/id/26/400/300',
        timestamp: new Date(2024, 4, 1).toISOString(),
        title: 'Ceiling damage',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Window seal broken',
    description: 'Window seal appears to be broken, allowing moisture to enter during rainy weather. Window is located on west wall.',
    location: 'Building B, Floor 1, Room 110',
    timestamp: new Date(2024, 4, 5).toISOString(),
    severity: IssueSeverity.Medium,
    photos: [
      {
        id: '2a',
        uri: 'https://picsum.photos/id/24/400/300',
        timestamp: new Date(2024, 4, 5).toISOString(),
      },
    ],
  },
  '3': {
    id: '3',
    title: 'Chipping paint on exterior wall',
    description: 'Paint is chipping and peeling on the south exterior wall, approximately 3 feet from ground level.',
    location: 'Building C, South Wall',
    timestamp: new Date(2024, 4, 8).toISOString(),
    severity: IssueSeverity.Low,
    photos: [],
  },
};

/**
 * Issue detail screen
 */
export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams();
  const issueId = typeof id === 'string' ? id : '';
  const issue = MOCK_ISSUES[issueId];
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Handle case where issue is not found
  if (!issue) {
    return (
      <ThemedView style={styles.container}>
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
        
        <ThemedView style={styles.notFoundContainer}>
          <IconSymbol size={48} name="exclamationmark.triangle.fill" color={colors.icon} />
          <ThemedText style={styles.notFoundText}>Issue not found</ThemedText>
          <Link href="/(tabs)/issues" asChild>
            <Button label="View All Issues" variant="primary" />
          </Link>
        </ThemedView>
      </ThemedView>
    );
  }
  
  // Format timestamp to a readable date
  const formattedDate = new Date(issue.timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const getSeverityColor = () => {
    switch (issue.severity) {
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
  
  return (
    <ThemedView style={styles.container}>
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
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>{issue.title}</ThemedText>
        
        <ThemedView style={styles.metaContainer}>
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="mappin.circle.fill" color={colors.icon} />
            <ThemedText style={styles.metaText}>{issue.location}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={16} name="calendar" color={colors.icon} />
            <ThemedText style={styles.metaText}>{formattedDate}</ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.severityBadge, { backgroundColor: getSeverityColor() }]}>
            <ThemedText style={styles.severityText}>{issue.severity}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Description</ThemedText>
          <ThemedText style={styles.description}>{issue.description}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Photos ({issue.photos.length})</ThemedText>
          
          {issue.photos.length === 0 ? (
            <ThemedView style={styles.emptyPhotosContainer}>
              <IconSymbol size={32} name="photo.fill" color={colors.icon} />
              <ThemedText style={styles.emptyPhotosText}>No photos available</ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={styles.photosGrid}>
              {issue.photos.map((photo) => (
                <ThemedView key={photo.id} style={styles.photoContainer}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.photo}
                    contentFit="cover"
                  />
                  {photo.title && (
                    <ThemedText style={styles.photoTitle}>{photo.title}</ThemedText>
                  )}
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </ThemedView>
        
        <ThemedView style={styles.actionsContainer}>
          <Button
            label="Edit Issue"
            variant="secondary"
            leftIcon={<IconSymbol size={18} name="pencil" color={colors.tint} />}
            style={styles.actionButton}
          />
          <Button
            label="Delete Issue"
            variant="danger"
            leftIcon={<IconSymbol size={18} name="trash.fill" color="#FFFFFF" />}
            style={styles.actionButton}
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
  emptyPhotosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 8,
    borderStyle: 'dashed',
    marginTop: 16,
  },
  emptyPhotosText: {
    marginTop: 8,
    color: '#687076',
  },
  photosGrid: {
    marginTop: 16,
  },
  photoContainer: {
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  photoTitle: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    marginVertical: 8,
  },
});
