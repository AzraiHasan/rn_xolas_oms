import React from 'react';
import { Pressable, View } from 'react-native';
import { useSyncContext } from '@/contexts/SyncContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatSyncTime } from '@/utils/syncUtils';

type NetworkStatusBarProps = {
  showDetails?: boolean;
  onPress?: () => void;
};

/**
 * Component to display network status and sync information
 * Appears as a mini bar at the top of the screen
 */
export function NetworkStatusBar({ showDetails = false, onPress }: NetworkStatusBarProps) {
  const { syncState, syncNow } = useSyncContext();
  const { isOnline, isSyncing, queueCount, lastSyncTime } = syncState;

  // Determine color based on status
  const getBgColor = () => {
    if (!isOnline) return 'bg-gray-500';
    if (isSyncing) return 'bg-blue-500';
    if (queueCount > 0) return 'bg-amber-500';
    return 'bg-green-600';
  };

  // Determine icon based on status
  const getIcon = () => {
    if (!isOnline) return 'wifi.slash';
    if (isSyncing) return 'arrow.2.circlepath';
    if (queueCount > 0) return 'exclamationmark.circle';
    return 'checkmark.circle';
  };

  // Determine status text
  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Syncing...';
    if (queueCount > 0) return `${queueCount} pending`;
    return 'All synced';
  };

  return (
    <Pressable onPress={onPress}>
      <ThemedView className={`px-3 py-1.5 ${getBgColor()}`}>
        <ThemedView className="flex-row items-center justify-between">
          <ThemedView className="flex-row items-center">
            <IconSymbol 
              name={getIcon()} 
              size={16} 
              color="#FFFFFF" 
              className={isSyncing ? 'animate-spin' : ''}
            />
            <ThemedText className="text-white font-medium ml-1.5">
              {getStatusText()}
            </ThemedText>
          </ThemedView>

          {showDetails && (
            <ThemedView className="flex-row items-center">
              <ThemedText className="text-white text-xs mr-2">
                Last sync: {formatSyncTime(lastSyncTime)}
              </ThemedText>
              
              {isOnline && queueCount > 0 && !isSyncing && (
                <Pressable 
                  onPress={(e) => {
                    e.stopPropagation();
                    syncNow();
                  }}
                  className="bg-white bg-opacity-20 rounded-full px-2 py-0.5"
                >
                  <ThemedText className="text-white text-xs font-medium">
                    Sync now
                  </ThemedText>
                </Pressable>
              )}
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}
