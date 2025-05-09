import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

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
        <ThemedView className="flex-row items-center py-3 px-1 md:py-4 md:px-3 border-b border-[#E4E7EB] dark:border-gray-700">
          <ThemedView 
            className="w-9 h-9 md:w-12 md:h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${getSeverityColor()}20` }}
          >
            <IconSymbol 
              name={getSeverityIconName()} 
              size={18} 
              className="md:scale-125"
              color={getSeverityColor()} 
            />
          </ThemedView>
          
          <ThemedView className="flex-1 mr-3">
            <ThemedText 
              type="defaultSemiBold" 
              numberOfLines={1} 
              className="text-[15px] md:text-base mb-1"
            >
              {issue.title}
            </ThemedText>
            
            <ThemedView className="flex-row items-center justify-between">
              <ThemedView className="flex-row items-center flex-1">
                <IconSymbol name="mappin.circle.fill" size={12} color={colors.icon} />
                <ThemedText 
                  numberOfLines={1}
                  className="text-xs md:text-sm ml-1 text-[#687076] dark:text-gray-400"
                >
                  {issue.location}
                </ThemedText>
              </ThemedView>
              
              <ThemedText className="text-xs md:text-sm text-[#687076] dark:text-gray-400">
                {getRelativeTime(issue.timestamp)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          
          {issue.photos.length > 0 && (
            <Image
              source={{ uri: issue.photos[0].uri }}
              className="w-12 h-12 md:w-16 md:h-16 rounded-md"
              contentFit="cover"
            />
          )}
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}
