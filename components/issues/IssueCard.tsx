import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { findSiteById } from '@/constants/Sites';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueReport, IssueSeverity, IssueStatus } from '@/types/models/Issue';

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
  
  // Get site information
  const siteInfo = findSiteById(issue.siteId);
  
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
  
  const getStatusColor = () => {
    switch (issue.status) {
      case IssueStatus.New:
        return '#3B82F6';
      case IssueStatus.Assigned:
        return '#8B5CF6';
      case IssueStatus.InProgress:
        return '#F97316';
      case IssueStatus.Resolved:
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
      <ThemedView className="mb-0">
        <ThemedView className="flex-row justify-between items-center mb-1">
          <ThemedText 
            type="defaultSemiBold" 
            className="text-base flex-1 mr-2" 
            numberOfLines={1}
          >
            {issue.title}
          </ThemedText>
          
          <ThemedView
            className="px-2 py-0.5 rounded-xl"
            style={{ backgroundColor: getSeverityColor() }}
          >
            <ThemedText className="text-xs font-medium" style={{ color: issue.severity === IssueSeverity.High ? '#FFFFFF' : undefined }}>{issue.severity}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView className="flex-row flex-wrap">
          <ThemedView className="flex-row items-center mr-3 mb-1 w-full">
            <IconSymbol size={14} name="folder.fill" color={colors.icon} />
            <ThemedText className="text-xs ml-1" numberOfLines={1}>
              {issue.category}
            </ThemedText>
          </ThemedView>
          
          <ThemedView className="flex-row items-center mr-3 mb-1">
            <IconSymbol size={14} name="mappin.circle.fill" color={colors.icon} />
            <ThemedText className="text-xs ml-1" numberOfLines={1}>
              {siteInfo?.siteName || 'Unknown Site'}
            </ThemedText>
          </ThemedView>
          
          <ThemedView className="flex-row items-center mr-3 mb-1">
            <IconSymbol size={14} name="checkmark.circle.fill" color={colors.icon} />
            <ThemedText className="text-xs ml-1" numberOfLines={1}>
              {siteInfo?.status || 'Unknown Status'}
            </ThemedText>
          </ThemedView>
          
          <ThemedView className="flex-row items-center mr-3 mb-1">
            <IconSymbol size={14} name="calendar-month" color={colors.icon} />
            <ThemedText className="text-xs ml-1">{getRelativeTime(issue.timestamp)}</ThemedText>
          </ThemedView>
          
          <ThemedView className="flex-row items-center mr-3 mb-1">
            <IconSymbol size={14} name="chart-bar" color={colors.icon} />
            <ThemedText className="text-xs ml-1">
              {/* Show status history if exists, otherwise just current status */}
              {issue.updates && issue.updates.length > 0 ? 
              `${issue.updates[issue.updates.length - 1].previousStatus} → ${issue.status}` : 
              issue.status
              }
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      <ThemedText className="text-sm mb-3" numberOfLines={2}>
        {issue.description}
      </ThemedText>
      
      {issue.photos.length > 0 && (
        <ThemedView className="relative">
          <Image
            source={{ uri: issue.photos[0].uri }}
            className="w-full h-[140px] md:h-[180px] rounded-lg"
            contentFit="cover"
          />
          
          {issue.photos.length > 1 && (
            <ThemedView className="absolute bottom-2 right-2 bg-black/75 rounded-xl px-2 py-1">
              <ThemedText className="text-white text-xs font-medium">+{issue.photos.length - 1}</ThemedText>
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
          className="rounded-xl border p-4 md:p-5 mb-4"
          style={[{ borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB' }, style]}
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
        className="rounded-xl border p-4 md:p-5 mb-4"
        style={[{ borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB' }, style]}
      >
        {cardContent}
      </ThemedView>
    </Pressable>
  );
}

// NativeWind classes replace StyleSheet
