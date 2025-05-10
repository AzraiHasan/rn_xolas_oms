import React from 'react';
import { StyleProp, ViewStyle, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { SyncState, SyncStatus } from '@/types/services/Sync';
import { formatSyncTime } from '@/utils/syncUtils';

interface GlobalSyncStatusProps {
  /** Current sync state */
  syncState: SyncState;
  /** Whether indicator is clickable to open sync details */
  interactive?: boolean;
  /** Callback when indicator is pressed */
  onPress?: () => void;
  /** Optional style for container */
  style?: StyleProp<ViewStyle>;
  /** Sync now callback */
  onSyncNow?: () => void;
  /** Compact mode shows only icon */
  compact?: boolean;
}

/**
 * Global sync status component for app header or footer
 */
export function GlobalSyncStatus({
  syncState,
  interactive = true,
  onPress,
  style,
  onSyncNow,
  compact = false
}: GlobalSyncStatusProps) {
  // Determine current sync status based on state
  const getCurrentStatus = (): SyncStatus => {
    if (!syncState.isOnline) return SyncStatus.Offline;
    if (syncState.isSyncing) return SyncStatus.Syncing;
    if (syncState.queueCount > 0) return SyncStatus.Pending;
    return SyncStatus.Synced;
  };
  
  const status = getCurrentStatus();
  
  // If compact mode, just show the indicator
  if (compact) {
    return (
      <SyncStatusIndicator 
        status={status} 
        showLabel={false} 
        size="small" 
        interactive={interactive}
        onPress={onPress}
        pendingCount={syncState.queueCount > 0 ? syncState.queueCount : undefined}
      />
    );
  }
  
  // Container for full display mode
  const content = (
    <ThemedView
      className="flex-row items-center rounded-lg border border-gray-200 dark:border-gray-700 p-2"
      style={style}
    >
      <SyncStatusIndicator 
        status={status} 
        showLabel={false} 
        size="medium" 
        pendingCount={syncState.queueCount}
      />
      
      <ThemedView className="ml-2 flex-1">
        <ThemedText className="text-sm font-medium">
          {status === SyncStatus.Synced ? 'All changes synced' : 
           status === SyncStatus.Syncing ? 'Syncing...' :
           status === SyncStatus.Pending ? `${syncState.queueCount} changes pending` :
           status === SyncStatus.Offline ? 'Offline mode' : 'Sync error'}
        </ThemedText>
        <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
          Last sync: {formatSyncTime(syncState.lastSyncTime)}
        </ThemedText>
      </ThemedView>
      
      {/* Show sync button only when there are pending changes and device is online */}
      {status === SyncStatus.Pending && onSyncNow && (
        <Pressable
          onPress={onSyncNow}
          className="ml-2 p-2 rounded-full active:opacity-70 bg-gray-100 dark:bg-gray-800"
        >
          <IconSymbol name="arrow.counterclockwise" size={18} color="#3B82F6" />
        </Pressable>
      )}
    </ThemedView>
  );
  
  // If interactive and has onPress, wrap in Pressable
  if (interactive && onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-80">
        {content}
      </Pressable>
    );
  }
  
  return content;
}
