import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

interface RecentActivityItemProps {
  issue: IssueReport;
  style?: StyleProp<ViewStyle>;
}

/**
 * Component displaying a recent activity item for the dashboard
 */
export function RecentActivityItem({ issue, style }: RecentActivityItemProps) {
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
        <ThemedView 
          className="py-4 px-4 md:py-5 md:px-5 border-b"
          style={[{ borderColor: colorScheme === 'dark' ? '#3E4144' : '#E4E7EB' }, style]}
        >
          <ThemedView className="flex-row">
          <ThemedView className="flex-1 mr-3">
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
              <ThemedView className="flex-row items-center mr-3 mb-1">
                <IconSymbol name="mappin.circle.fill" size={12} color={colors.icon} />
                <ThemedText 
                  numberOfLines={1}
                  className="text-xs ml-1"
                >
                  {issue.location}
                </ThemedText>
              </ThemedView>
              
              <ThemedView className="flex-row items-center mr-3 mb-1">
                <IconSymbol name="calendar-month" size={12} color={colors.icon} />
                <ThemedText className="text-xs ml-1">
                  {getRelativeTime(issue.timestamp)}
                </ThemedText>
              </ThemedView>
              
              <ThemedView className="flex-row items-center mr-3 mb-1">
                <IconSymbol name="chart-bar" size={12} color={colors.icon} />
                <ThemedText className="text-xs ml-1">
                  {/* Show status history if exists, otherwise just current status */}
                  {issue.updates && issue.updates.length > 0 ? 
                  `${issue.updates[issue.updates.length - 1].previousStatus} → ${issue.status}` : 
                  issue.status
                  }
                </ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedText className="text-sm mb-3 mt-3" numberOfLines={2}>
              {issue.description}
            </ThemedText>
          </ThemedView>
          
        </ThemedView>
        
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
      </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}

// Apply last-child no border styling in the index.tsx wrapper
