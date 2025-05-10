import React from 'react';
import { Animated, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GlobalSyncStatus } from '@/components/ui/SyncStatusIndicator';
import { SyncState } from '@/types/services/Sync';

interface SyncStatusBarProps {
  /**
   * Current sync state of the application
   */
  syncState: SyncState;
  
  /**
   * Callback to trigger manual sync
   */
  onSyncNow?: () => void;
  
  /**
   * Whether the bar is expanded with details
   */
  expanded?: boolean;
  
  /**
   * Callback to toggle expanded state
   */
  onToggleExpand?: () => void;
}

/**
 * Status bar that shows the current sync state and allows initiating a sync
 */
export function SyncStatusBar({
  syncState,
  onSyncNow,
  expanded = false,
  onToggleExpand
}: SyncStatusBarProps) {
  const navigation = useNavigation();
  const [animatedHeight] = React.useState(new Animated.Value(0));
  
  // Animate height changes
  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [expanded]);
  
  const height = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 48] // Expanded height
  });
  
  return (
    <ThemedView>
      {/* Compact always-visible bar */}
      <Pressable onPress={onToggleExpand}>
        <ThemedView 
          className="px-4 py-2 flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800"
        >
          <GlobalSyncStatus 
            syncState={syncState} 
            compact={false}
            onSyncNow={onSyncNow}
            interactive={false}
            style={{ flex: 1 }}
          />
          
          <Pressable 
            onPress={() => navigation.navigate('sync-demo')}
            className="ml-2"
          >
            <ThemedText className="text-blue-500 text-sm font-medium">
              Details
            </ThemedText>
          </Pressable>
        </ThemedView>
      </Pressable>
      
      {/* Expandable details section */}
      <Animated.View style={{ height, overflow: 'hidden' }}>
        <ThemedView className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
          <ThemedView className="flex-row justify-between mb-1">
            <ThemedText className="text-xs">Pending uploads:</ThemedText>
            <ThemedText className="text-xs font-medium">{syncState.queueCount}</ThemedText>
          </ThemedView>
          
          <ThemedView className="flex-row justify-between">
            <ThemedText className="text-xs">Network status:</ThemedText>
            <ThemedText className="text-xs font-medium">
              {syncState.isOnline ? 'Online' : 'Offline'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </Animated.View>
    </ThemedView>
  );
}
