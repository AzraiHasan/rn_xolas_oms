import React from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SyncStatus } from '@/types/services/Sync';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface SyncStatusIndicatorProps {
  /** Current sync status */
  status: SyncStatus;
  /** Whether to show the label */
  showLabel?: boolean;
  /** Label size - for compact or full display */
  size?: 'small' | 'medium' | 'large';
  /** Whether the indicator is clickable */
  interactive?: boolean;
  /** Optional action when tapped */
  onPress?: () => void;
  /** Optional count of pending items */
  pendingCount?: number;
  /** Additional className for styling */
  className?: string;
}

/**
 * Visual indicator showing the current sync status for reports
 * Can be used as a standalone indicator or embedded in cards/lists
 */
export function SyncStatusIndicator({
  status,
  showLabel = true,
  size = 'medium',
  interactive = false,
  onPress,
  pendingCount,
  className = '',
}: SyncStatusIndicatorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Determine icon, color and label based on status
  const getStatusInfo = (status: SyncStatus) => {
    switch(status) {
      case SyncStatus.Synced:
        return {
          icon: 'checkmark.circle.fill',
          color: '#10B981', // Green
          label: 'Synced'
        };
      case SyncStatus.Syncing:
        return {
          icon: 'arrow.counterclockwise',
          color: '#3B82F6', // Blue
          label: 'Syncing...'
        };
      case SyncStatus.Pending:
        return {
          icon: 'clock.fill',
          color: '#F59E0B', // Amber
          label: pendingCount ? `Pending (${pendingCount})` : 'Pending'
        };
      case SyncStatus.Error:
        return {
          icon: 'exclamationmark.circle.fill',
          color: '#E11D48', // Red
          label: 'Sync failed'
        };
      case SyncStatus.Offline:
        return {
          icon: 'wifi.slash',
          color: '#6B7280', // Gray
          label: 'Offline'
        };
      default:
        return {
          icon: 'questionmark.circle',
          color: colors.text,
          label: 'Unknown'
        };
    }
  };
  
  const { icon, color, label } = getStatusInfo(status);
  
  // Determine size values
  const sizeValues = {
    small: {
      iconSize: 16,
      textSize: 'text-xs',
      containerClass: 'py-0.5 px-1.5 gap-1'
    },
    medium: {
      iconSize: 18,
      textSize: 'text-sm',
      containerClass: 'py-1 px-2 gap-1.5'
    },
    large: {
      iconSize: 20,
      textSize: 'text-base',
      containerClass: 'py-1.5 px-2.5 gap-2'
    }
  };
  
  const { iconSize, textSize, containerClass } = sizeValues[size];
  
  // Render component
  const content = (
    <View className={`flex-row items-center ${containerClass} rounded-full border ${className}`}
          style={{ borderColor: color }}>
      {status === SyncStatus.Syncing ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <IconSymbol name={icon} size={iconSize} color={color} />
      )}
      
      {showLabel && (
        <ThemedText className={`${textSize} font-medium`} style={{ color }}>
          {label}
        </ThemedText>
      )}
    </View>
  );
  
  // If interactive, wrap in a Pressable
  if (interactive && onPress) {
    return (
      <Pressable 
        onPress={onPress}
        className="active:opacity-70"
      >
        {content}
      </Pressable>
    );
  }
  
  return content;
}
