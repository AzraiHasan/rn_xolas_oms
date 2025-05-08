import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

interface RecentActivityItemProps {
  issue: IssueReport;
}

/**
 * Component displaying a recent activity item for the dashboard
 */
export function RecentActivityItem({ issue }: RecentActivityItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Format timestamp to a readable relative time
  const getRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };
  
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
  
  const getSeverityIconName = () => {
    switch (issue.severity) {
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
  
  return (
    <Link href={{ pathname: '/issue/[id]', params: { id: issue.id } }} asChild>
      <TouchableOpacity activeOpacity={0.7}>
        <ThemedView style={styles.container}>
          <ThemedView style={[styles.iconContainer, { backgroundColor: `${getSeverityColor()}20` }]}>
            <IconSymbol 
              name={getSeverityIconName()} 
              size={18} 
              color={getSeverityColor()} 
            />
          </ThemedView>
          
          <ThemedView style={styles.contentContainer}>
            <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.title}>
              {issue.title}
            </ThemedText>
            
            <ThemedView style={styles.detailsRow}>
              <ThemedView style={styles.locationContainer}>
                <IconSymbol name="mappin.circle.fill" size={12} color={colors.icon} />
                <ThemedText style={styles.locationText} numberOfLines={1}>
                  {issue.location}
                </ThemedText>
              </ThemedView>
              
              <ThemedText style={styles.timestamp}>
                {getRelativeTime(issue.timestamp)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          
          {issue.photos.length > 0 && (
            <Image
              source={{ uri: issue.photos[0].uri }}
              style={styles.thumbnail}
              contentFit="cover"
            />
          )}
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7EB',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#687076',
  },
  timestamp: {
    fontSize: 12,
    color: '#687076',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
});
