import React from 'react';
import { StyleProp, ViewStyle, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { IssueSeverity, IssueStatus } from '@/types/models/Issue';

interface StatisticCardProps {
  value: number | string;
  label: string;
  backgroundColor?: string;
  borderColor?: string;
  valueColor?: string;
  labelColor?: string;
  iconName?: string;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
  navigateToFilter?: {
    type: 'severity' | 'status';
    value: IssueSeverity | IssueStatus;
  };
  onPress?: () => void;
}

/**
 * Card component displaying a statistical metric
 */
export function StatisticCard({
  value,
  label,
  backgroundColor = 'transparent',
  borderColor = '#E5E5E5',
  valueColor,
  labelColor,
  iconName,
  iconColor,
  style,
  className,
  navigateToFilter,
  onPress,
}: StatisticCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    
    if (navigateToFilter) {
      // Create the query parameters for the filter
      const params = new URLSearchParams();
      
      if (navigateToFilter === null) {
        // Special case: navigate to unfiltered issues list
        router.push('/(tabs)/issues');
        return;
      }
      
      // Add filter type and value (single filter only)
      params.append('filterType', navigateToFilter.type);
      params.append('filterValue', navigateToFilter.value);
      // Add a timestamp to ensure we always trigger the useEffect on the Issues screen
      // This prevents issues with navigating between filters of the same type
      params.append('_t', Date.now().toString());
      
      // Navigate to issues screen with filter params
      router.push(`/(tabs)/issues?${params.toString()}`);
    }
  };
  
  // Determine if the card is pressable
  const isPressable = !!navigateToFilter || !!onPress;
  
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isPressable) {
      return (
        <Pressable 
          className={`flex-1 min-w-[45%] md:min-w-[30%] lg:min-w-0 rounded-xl p-4 md:p-5 min-h-[100px] md:min-h-[120px] flex-row justify-between border active:opacity-70 ${className || ''}`}
          style={[{ backgroundColor, borderColor, borderWidth: 1 }, style]}
          onPress={handlePress}
        >
          {children}
        </Pressable>
      );
    }
    
    return (
      <ThemedView 
        className={`flex-1 min-w-[45%] md:min-w-[30%] lg:min-w-0 rounded-xl p-4 md:p-5 min-h-[100px] md:min-h-[120px] flex-row justify-between border ${className || ''}`}
        style={[{ backgroundColor, borderColor, borderWidth: 1 }, style]}
      >
        {children}
      </ThemedView>
    );
  };
  
  return (
    <CardWrapper>
      <ThemedView className="justify-center">
        <ThemedText 
          className="text-3xl md:text-4xl font-bold mb-1"
          style={valueColor ? { color: valueColor } : undefined}
        >
          {value}
        </ThemedText>
        
        <ThemedText 
          className="text-sm md:text-base"
          style={labelColor ? { color: labelColor } : undefined}
        >
          {label}
        </ThemedText>
      </ThemedView>
      
      {iconName && (
        <ThemedView className="justify-center opacity-80">
          <IconSymbol name={iconName} size={28} color={iconColor || '#000000'} />
        </ThemedView>
      )}
    </CardWrapper>
  );
}
