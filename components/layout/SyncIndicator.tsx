import React from 'react';
import { View } from 'react-native';
import { useSyncContext } from '@/contexts/SyncContext';
import { SyncStatus } from '@/types/services/Sync';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/Colors';

type SyncIndicatorProps = {
  entityId: string;
  entityType: 'issue' | 'photo';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  onPress?: () => void;
};

/**
 * Component to display sync status for an individual entity
 */
export function SyncIndicator({
  entityId,
  entityType,
  size = 'medium',
  showLabel = false,
  onPress
}: SyncIndicatorProps) {
  const { syncQueue } = useSyncContext();
  
  // Find item in sync queue
  const queueItem = syncQueue.find(
    item => item.entityType === entityType && item.entityId === entityId
  );
  
  // Determine status
  const status = queueItem ? queueItem.status : SyncStatus.Synced;
  
  // Icon and color mappings
  const getIconName = (status: SyncStatus) => {
    switch (status) {
      case SyncStatus.Synced:
        return 'checkmark.circle.fill';
      case SyncStatus.Syncing:
        return 'arrow.triangle.2.circlepath';
      case SyncStatus.Pending:
        return 'clock.fill';
      case SyncStatus.Error:
        return 'exclamationmark.triangle.fill';
      case SyncStatus.Offline:
        return 'wifi.slash';
      default:
        return 'questionmark.circle.fill';
    }
  };
  
  const getColor = (status: SyncStatus) => {
    switch (status) {
      case SyncStatus.Synced:
        return colors.success; 
      case SyncStatus.Syncing:
        return colors.info;
      case SyncStatus.Pending:
        return colors.warning;
      case SyncStatus.Error:
        return colors.error;
      case SyncStatus.Offline:
        return colors.muted;
      default:
        return colors.muted;
    }
  };
  
  const getLabel = (status: SyncStatus) => {
    switch (status) {
      case SyncStatus.Synced:
        return 'Synced';
      case SyncStatus.Syncing:
        return 'Syncing';
      case SyncStatus.Pending:
        return 'Pending';
      case SyncStatus.Error:
        return 'Error';
      case SyncStatus.Offline:
        return 'Offline';
      default:
        return 'Unknown';
    }
  };
  
  // Size mapping
  const getSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 22;
      case 'medium':
      default:
        return 18;
    }
  };
  
  return (
    <ThemedView 
      className="flex-row items-center"
      onTouchEnd={onPress}
    >
      <IconSymbol
        name={getIconName(status)}
        size={getSize()}
        color={getColor(status)}
        className={status === SyncStatus.Syncing ? 'animate-spin' : ''}
      />
      
      {showLabel && (
        <ThemedText 
          className="ml-1 text-xs"
          style={{ color: getColor(status) }}
        >
          {getLabel(status)}
        </ThemedText>
      )}
    </ThemedView>
  );
}
