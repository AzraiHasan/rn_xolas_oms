import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Stack, Tabs } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Header, PageLayout } from '@/components/layouts';
import { NetworkStatusBar } from '@/components/layout/NetworkStatusBar';
import { SyncAnalyticsView } from '@/components/sync/SyncAnalyticsView';
import { useSyncContext } from '@/contexts/SyncContext';
import { SyncQueueItem, SyncStatus } from '@/types/services/Sync';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatSyncTime } from '@/utils/syncUtils';

export default function SyncDashboardScreen() {
  const { 
    syncState, 
    syncQueue, 
    syncNow, 
    pauseSync, 
    resumeSync, 
    retryFailedItems,
    clearSyncItems 
  } = useSyncContext();
  
  const [activeTab, setActiveTab] = useState<'status' | 'queue' | 'analytics'>('status');
  
  // Group queue by status
  const pendingItems = syncQueue.filter(item => item.status === SyncStatus.Pending);
  const syncingItems = syncQueue.filter(item => item.status === SyncStatus.Syncing);
  const errorItems = syncQueue.filter(item => item.status === SyncStatus.Error);
  
  return (
    <PageLayout header={<Header title="Sync Dashboard" />}>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs.Screen options={{ tabBarIcon: ({ color }) => <IconSymbol name="arrow.triangle.2.circlepath" color={color} /> }} />
      
      <NetworkStatusBar showDetails />
      
      {/* Tabs */}
      <ThemedView className="flex-row border-b border-gray-200 dark:border-gray-700">
        <TabButton 
          label="Status" 
          isActive={activeTab === 'status'} 
          onPress={() => setActiveTab('status')} 
        />
        <TabButton 
          label={`Queue (${syncQueue.length})`} 
          isActive={activeTab === 'queue'} 
          onPress={() => setActiveTab('queue')} 
        />
        <TabButton 
          label="Analytics" 
          isActive={activeTab === 'analytics'} 
          onPress={() => setActiveTab('analytics')} 
        />
      </ThemedView>
      
      <ScrollView className="flex-1">
        {activeTab === 'status' && (
          <ThemedView className="p-4">
            {/* Global Sync Status */}
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
                <ThemedText>Status:</ThemedText>
                {syncState.isSyncing ? (
                  <ThemedText className="text-blue-500 font-medium">Syncing...</ThemedText>
                ) : syncState.queueCount > 0 ? (
                  <ThemedText className="text-amber-500 font-medium">
                    {syncState.queueCount} items pending
                  </ThemedText>
                ) : (
                  <ThemedText className="text-green-600 font-medium">All synced</ThemedText>
                )}
              </ThemedView>
              
              <ThemedView className="flex-row items-center justify-between mb-4">
                <ThemedText>Last Sync:</ThemedText>
                <ThemedText>
                  {formatSyncTime(syncState.lastSyncTime)}
                </ThemedText>
              </ThemedView>
              
              <ThemedView className="flex-row items-center justify-between mb-4">
                <ThemedText>Auto-Sync:</ThemedText>
                <Button 
                  label={syncState.isPaused ? "Paused" : "Enabled"}
                  variant={syncState.isPaused ? "secondary" : "primary"}
                  size="small"
                  onPress={() => syncState.isPaused ? resumeSync() : pauseSync()}
                />
              </ThemedView>
              
              <Button
                label={syncState.isSyncing ? "Syncing..." : "Sync Now"}
                variant="primary"
                disabled={!syncState.isOnline || syncState.isSyncing || syncState.queueCount === 0}
                onPress={() => syncNow()}
              />
            </ThemedView>
            
            {/* Sync Stats */}
            <ThemedView className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <ThemedText type="subtitle" className="mb-2">Sync Queue</ThemedText>
              
              <ThemedView className="flex-row flex-wrap -mx-1">
                <ThemedView className="w-1/3 px-1 mb-2">
                  <ThemedView className="bg-white dark:bg-gray-700 rounded-lg p-3 items-center">
                    <ThemedText className="text-amber-500 font-bold text-xl">
                      {pendingItems.length}
                    </ThemedText>
                    <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
                      Pending
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedView className="w-1/3 px-1 mb-2">
                  <ThemedView className="bg-white dark:bg-gray-700 rounded-lg p-3 items-center">
                    <ThemedText className="text-blue-500 font-bold text-xl">
                      {syncingItems.length}
                    </ThemedText>
                    <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
                      Syncing
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedView className="w-1/3 px-1 mb-2">
                  <ThemedView className="bg-white dark:bg-gray-700 rounded-lg p-3 items-center">
                    <ThemedText className="text-red-500 font-bold text-xl">
                      {errorItems.length}
                    </ThemedText>
                    <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
                      Errors
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
              
              {/* Show retry button if there are errors */}
              {errorItems.length > 0 && (
                <Button
                  label="Retry Failed Items"
                  variant="danger"
                  className="mt-2"
                  onPress={() => retryFailedItems()}
                />
              )}
            </ThemedView>
            
            {/* Sync Tips */}
            <ThemedView className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <ThemedText type="subtitle" className="mb-2">Sync Tips</ThemedText>
              
              <ThemedView className="mb-3">
                <ThemedView className="flex-row items-center mb-1">
                  <IconSymbol name="lightbulb.fill" size={16} color="#F59E0B" />
                  <ThemedText className="font-medium ml-2">Low Battery?</ThemedText>
                </ThemedView>
                <ThemedText className="text-sm ml-6">
                  Disable auto-sync to conserve battery when below 20%.
                </ThemedText>
              </ThemedView>
              
              <ThemedView className="mb-3">
                <ThemedView className="flex-row items-center mb-1">
                  <IconSymbol name="lightbulb.fill" size={16} color="#F59E0B" />
                  <ThemedText className="font-medium ml-2">Unstable Connection?</ThemedText>
                </ThemedView>
                <ThemedText className="text-sm ml-6">
                  Wait for a stable WiFi connection before syncing large reports.
                </ThemedText>
              </ThemedView>
              
              <ThemedView>
                <ThemedView className="flex-row items-center mb-1">
                  <IconSymbol name="lightbulb.fill" size={16} color="#F59E0B" />
                  <ThemedText className="font-medium ml-2">Sync Failing?</ThemedText>
                </ThemedView>
                <ThemedText className="text-sm ml-6">
                  Try smaller batches or check server status in settings.
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
        
        {activeTab === 'queue' && (
          <ThemedView className="p-4">
            {/* Sync Queue Display */}
            {syncQueue.length === 0 ? (
              <ThemedView className="items-center justify-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                <IconSymbol size={40} name="checkmark.circle.fill" color="#10B981" />
                <ThemedText className="mt-2 text-gray-500">All changes are synced</ThemedText>
              </ThemedView>
            ) : (
              <ThemedView>
                {/* Currently Syncing Items */}
                {syncingItems.length > 0 && (
                  <QueueItemsSection
                    title="Currently Syncing"
                    items={syncingItems}
                    onClearItems={() => {}}
                    showClearButton={false}
                  />
                )}
                
                {/* Error Items */}
                {errorItems.length > 0 && (
                  <QueueItemsSection
                    title="Failed Items"
                    items={errorItems}
                    onClearItems={(ids) => clearSyncItems(ids)}
                    showClearButton={true}
                    buttonLabel="Clear"
                  />
                )}
                
                {/* Pending Items */}
                {pendingItems.length > 0 && (
                  <QueueItemsSection
                    title="Pending Changes"
                    items={pendingItems}
                    onClearItems={(ids) => clearSyncItems(ids)}
                    showClearButton={true}
                    buttonLabel="Cancel"
                  />
                )}
              </ThemedView>
            )}
          </ThemedView>
        )}
        
        {activeTab === 'analytics' && <SyncAnalyticsView />}
      </ScrollView>
    </PageLayout>
  );
}

// Tab button component
function TabButton({ 
  label, 
  isActive, 
  onPress 
}: { 
  label: string; 
  isActive: boolean; 
  onPress: () => void;
}) {
  return (
    <TouchableOpacity 
      className={`flex-1 py-3 items-center border-b-2 ${
        isActive 
          ? 'border-blue-500 dark:border-blue-400' 
          : 'border-transparent'
      }`}
      onPress={onPress}
    >
      <ThemedText 
        className={isActive ? 'font-medium text-blue-500 dark:text-blue-400' : ''}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

// Queue items section component
function QueueItemsSection({ 
  title, 
  items, 
  onClearItems,
  showClearButton = true,
  buttonLabel = "Clear"
}: { 
  title: string; 
  items: SyncQueueItem[];
  onClearItems: (ids: string[]) => void;
  showClearButton?: boolean;
  buttonLabel?: string;
}) {
  return (
    <ThemedView className="mb-4">
      <ThemedView className="flex-row justify-between items-center mb-1">
        <ThemedText className="font-medium">{title}</ThemedText>
        
        {showClearButton && items.length > 0 && (
          <TouchableOpacity
            onPress={() => onClearItems(items.map(item => item.queueId))}
            className="py-1 px-2 rounded-md bg-gray-200 dark:bg-gray-700"
          >
            <ThemedText className="text-xs">
              {buttonLabel} All
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
      
      <ThemedView className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {items.map(item => (
          <QueueItem key={item.queueId} item={item} />
        ))}
      </ThemedView>
    </ThemedView>
  );
}

// Individual queue item component
function QueueItem({ item }: { item: SyncQueueItem }) {
  // Determine status color
  const getStatusColor = () => {
    switch (item.status) {
      case SyncStatus.Syncing:
        return 'text-blue-600';
      case SyncStatus.Pending:
        return 'text-amber-600';
      case SyncStatus.Error:
        return 'text-red-600';
      default:
        return '';
    }
  };
  
  // Determine operation color
  const getOperationColor = () => {
    switch (item.operation) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      default:
        return '';
    }
  };
  
  return (
    <ThemedView className="border-b border-gray-200 dark:border-gray-700 py-3 px-4">
      <ThemedView className="flex-row justify-between items-center">
        <ThemedView className="flex-row items-center flex-1">
          <IconSymbol 
            size={16} 
            name={item.entityType === 'issue' ? 'doc.text.fill' : 'photo.fill'}
            color={item.entityType === 'issue' ? '#3B82F6' : '#10B981'}
          />
          <ThemedText className="ml-2 font-medium">
            {item.entityType === 'issue' ? 'Issue' : 'Photo'} {item.entityId.slice(0, 8)}...
          </ThemedText>
        </ThemedView>
        
        <ThemedText className={`${getOperationColor()} text-sm font-medium`}>
          {item.operation.charAt(0).toUpperCase() + item.operation.slice(1)}
        </ThemedText>
      </ThemedView>
      
      <ThemedView className="flex-row justify-between mt-1">
        <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(item.queuedAt).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </ThemedText>
        <ThemedText className={`text-xs ${getStatusColor()} font-medium`}>
          {item.status}
          {item.status === SyncStatus.Error && ` (${item.attempts})`}
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
