import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

export interface IssueCardProps {
  /**
   * Issue data to display
   */
  issue: IssueReport;
  
  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Optional action to perform when card is pressed
   */
  onPress?: () => void;
}

/**
 * Card component displaying issue information
 */
export function IssueCard({ issue, style, onPress }: IssueCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
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
  
  // Format timestamp to a readable date
  const formattedDate = new Date(issue.timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const cardContent = (
    <>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={1}>
            {issue.title}
          </ThemedText>
          
          <ThemedView
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor() },
            ]}
          >
            <ThemedText style={styles.severityText}>{issue.severity}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.metaContainer}>
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={14} name="mappin.circle.fill" color={colors.icon} />
            <ThemedText style={styles.metaText} numberOfLines={1}>
              {issue.location}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <IconSymbol size={14} name="calendar" color={colors.icon} />
            <ThemedText style={styles.metaText}>{formattedDate}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      <ThemedText style={styles.description} numberOfLines={2}>
        {issue.description}
      </ThemedText>
      
      {issue.photos.length > 0 && (
        <ThemedView style={styles.photosContainer}>
          <Image
            source={{ uri: issue.photos[0].uri }}
            style={styles.thumbnailImage}
            contentFit="cover"
          />
          
          {issue.photos.length > 1 && (
            <ThemedView style={styles.photoCountBadge}>
              <ThemedText style={styles.photoCountText}>+{issue.photos.length - 1}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      )}
    </>
  );
  
  // If there's no onPress handler, render as a Link
  if (!onPress) {
    return (
      <Link href={{ pathname: '/issue/[id]', params: { id: issue.id } }} asChild>
        <Pressable>
          <ThemedView
            style={[
              styles.container,
              { borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB' },
              style,
            ]}
          >
            {cardContent}
          </ThemedView>
        </Pressable>
      </Link>
    );
  }
  
  // Otherwise render as a Pressable
  return (
    <Pressable onPress={onPress}>
      <ThemedView
        style={[
          styles.container,
          { borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB' },
          style,
        ]}
      >
        {cardContent}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  photosContainer: {
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  photoCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
