import React, { useEffect, useState } from 'react';
import { ScrollView, Switch, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Header, PageLayout } from '@/components/layouts';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SyncStatusIndicator } from '@/components/ui/SyncStatusIndicator';
import { useSyncContext } from '@/contexts/SyncContext';
import { SyncStatus, SyncQueueItem } from '@/types/services/Sync';
import { formatSyncTime } from '@/utils/syncUtils';

// Component to display a sync queue item
function QueueItem({ item }: { item: SyncQueueItem }) {
  return (
    <ThemedView className="border-b border-gray-200 dark:border-gray-700 py-3 px-4">
      <ThemedView className="flex-row justify-between items-center">
        <ThemedView className="flex-row items-center flex-1">
          <SyncStatusIndicator status={item.status} showLabel={false} size="small" />
          <ThemedText className="ml-2 font-medium">
            {item.entityType === 'issue' ? 'Issue' : 'Photo'} {item.entityId.slice(0, 8)}...
          </ThemedText>
        </ThemedView>
        
        <ThemedText className={`
          ${item.operation === 'create' ? 'text-green-600' : 
            item.operation === 'update' ? 'text-blue-600' : 'text-red-600'} 
          text-sm font-medium
        `}>
          {item.operation.charAt(0).toUpperCase() + item.operation.slice(1)}
        </ThemedText>
      </ThemedView>
      
      <ThemedView className="flex-row justify-between mt-1">
        <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
          Queued: {new Date(item.queuedAt).toLocaleString()}
        </ThemedText>
        <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
          Attempts: {item.attempts}
        </ThemedText>
      </ThemedView>
      
      {item.lastError && (
        <ThemedText className="text-xs text-red-500 mt-1">
          Error: {item.lastError}
        </ThemedText>
      )}
    </ThemedView>
  );
}

export default function SyncSettingsScreen() {
  const { 
    syncState, 
    syncQueue, 
    syncNow, 
    pauseSync, 
    resumeSync, 
    retryFailedItems 
  } = useSyncContext();
  
  const [isPaused, setIsPaused] = useState(syncState.isPaused);
  
  // Update local state when syncState changes
  useEffect(() => {
    setIsPaused(syncState.isPaused);
  }, [syncState.isPaused]);
  
  // Handle toggle pause
  const handleTogglePause = () => {
    if (isPaused) {
      resumeSync();
    } else {
      pauseSync();
    }
    setIsPaused(!isPaused);
  };
  
  // Handle retry failed items
  const handleRetryFailed = () => {
    retryFailedItems();
  };
  
  // Handle force sync
  const handleForceSync = () => {
    if (!syncState.isOnline) {
      Alert.alert(
        'Offline Mode',
        'Unable to sync while offline. Please connect to the internet and try again.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    syncNow();
  };
  
  // Group queue items by status
  const pendingItems = syncQueue.filter(item => item.status === SyncStatus.Pending);
  const syncingItems = syncQueue.filter(item => item.status === SyncStatus.Syncing);
  const errorItems = syncQueue.filter(item => item.status === SyncStatus.Error);
  
  return (
    <PageLayout header={<Header title="Sync Settings" />}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView className="flex-1">
        <ThemedView className="p-4">
          {/* Sync Status */}
          <ThemedView className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <ThemedText type="subtitle" className="mb-2">Sync Status</ThemedText>
            
            <ThemedView className="flex-row items-center justify-between mb-2">
              <ThemedText>Network Status:</ThemedText>
              {syncState.isOnline ? (
                <ThemedView className="flex-row items-center">
                  <IconSymbol name="wifi" size={16} color="#10B981" />
                  <ThemedText className="text-green-600 font-medium ml-1">Online</ThemedText>
                </ThemedView>
              ) : (
                <ThemedView className="flex-row items-center">
                  <IconSymbol name="wifi.slash" size={16} color="#6B7280" />
                  <ThemedText className="text-gray-500 font-medium ml-1">Offline</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
            
            <ThemedView className="flex-row items-center justify-between mb-2">
              <ThemedText>Pending Changes:</ThemedText>
              <ThemedText className="font-medium">
                {syncState.queueCount} {syncState.queueCount === 1 ? 'item' : 'items'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView className="flex-row items-center justify-between mb-4">
              <ThemedText>Last Sync:</ThemedText>
              <ThemedText className="font-medium">
                {formatSyncTime(syncState.lastSyncTime)}
              </ThemedText>
            </ThemedView>
            
            <ThemedView className="flex-row items-center justify-between mb-2">
              <ThemedText>Auto-Sync:</ThemedText>
              <Switch
                value={!isPaused}
                onValueChange={handleTogglePause}
                trackColor={{ false: '#767577', true: '#10B981' }}
              />
            </ThemedView>
            
            <ThemedText className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {isPaused 
                ? 'Auto-sync is disabled. Changes will not be synchronized automatically.'
                : 'Auto-sync is enabled. Changes will be synchronized when online.'}
            </ThemedText>
            
            <Button
              label={syncState.isSyncing ? 'Syncing...' : 'Sync Now'}
              variant="primary"
              disabled={!syncState.isOnline || syncState.isSyncing || syncState.queueCount === 0}
              onPress={handleForceSync}
            />
          </ThemedView>
          
          {/* Sync Queue */}
          <ThemedText type="subtitle" className="mb-2">Sync Queue</ThemedText>
          
          {/* Queue is empty */}
          {syncQueue.length === 0 && (
            <ThemedView className="items-center justify-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
              <IconSymbol size={40} name="checkmark.circle.fill" color="#10B981" />
              <ThemedText className="mt-2 text-gray-500">All changes are synced</ThemedText>
            </ThemedView>
          )}
          
          {/* Syncing Items */}
          {syncingItems.length > 0 && (
            <ThemedView className="mb-4">
              <ThemedText className="font-medium mb-1">Currently Syncing</ThemedText>
              <ThemedView className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {syncingItems.map(item => (
                  <QueueItem key={`${item.entityType}-${item.entityId}`} item={item} />
                ))}
              </ThemedView>
            </ThemedView>
          )}
          
          {/* Error Items */}
          {errorItems.length > 0 && (
            <ThemedView className="mb-4">
              <ThemedView className="flex-row justify-between items-center mb-1">
                <ThemedText className="font-medium">Failed Items</ThemedText>
                
                <Pressable
                  onPress={handleRetryFailed}
                  className="py-1 px-2 rounded-md bg-red-100 dark:bg-red-900"
                >
                  <ThemedText className="text-red-600 dark:text-red-300 text-xs">
                    Retry All
                  </ThemedText>
                </Pressable>
              </ThemedView>
              
              <ThemedView className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {errorItems.map(item => (
                  <QueueItem key={`${item.entityType}-${item.entityId}`} item={item} />
                ))}
              </ThemedView>
            </ThemedView>
          )}
          
          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <ThemedView className="mb-4">
              <ThemedText className="font-medium mb-1">Pending Changes</ThemedText>
              <ThemedView className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {pendingItems.map(item => (
                  <QueueItem key={`${item.entityType}-${item.entityId}`} item={item} />
                ))}
              </ThemedView>
            </ThemedView>
          )}
          
          {/* Advanced Settings */}
          <ThemedView className="mt-4">
            <ThemedText type="subtitle" className="mb-2">Advanced Settings</ThemedText>
            
            <Pressable 
              className="py-3 border-b border-gray-200 dark:border-gray-700"
              onPress={() => Alert.alert(
                'Clear All Pending Changes',
                'This will remove all pending changes from the sync queue. This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear All', style: 'destructive' }
                ]
              )}
            >
              <ThemedText className="text-red-600">Clear All Pending Changes</ThemedText>
            </Pressable>
            
            <Pressable 
              className="py-3 border-b border-gray-200 dark:border-gray-700"
              onPress={() => Alert.alert(
                'Sync Time Interval',
                'Choose how often automatic sync should occur when changes are detected.',
                [
                  { text: 'Immediately', style: 'default' },
                  { text: 'Every 15 minutes', style: 'default' },
                  { text: 'Every hour', style: 'default' },
                  { text: 'Manually only', style: 'default' },
                  { text: 'Cancel', style: 'cancel' }
                ]
              )}
            >
              <ThemedText>Set Sync Interval</ThemedText>
            </Pressable>
            
            <Pressable 
              className="py-3"
              onPress={() => Alert.alert(
                'Network Preferences',
                'Choose when to sync data based on network conditions.',
                [
                  { text: 'WiFi and Mobile Data', style: 'default' },
                  { text: 'WiFi Only', style: 'default' },
                  { text: 'Cancel', style: 'cancel' }
                ]
              )}
            >
              <ThemedText>Network Preferences</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </PageLayout>
  );
}
