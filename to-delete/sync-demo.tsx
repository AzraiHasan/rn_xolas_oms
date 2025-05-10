import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Header, PageLayout } from '@/components/layouts';
import { SyncStatusBar } from '@/components/layout/SyncStatusBar';
import { SyncStatusDemo } from '@/components/ui/SyncStatusIndicator/SyncStatusDemo';
import { EnhancedIssueCard } from '@/components/issues/EnhancedIssueCard';
import { IssueService } from '@/services/issues/issueService';
import { SyncStatus } from '@/types/services/Sync';
import { Button } from '@/components/ui/Button';

export default function SyncDemoScreen() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load mock issues on component mount
  React.useEffect(() => {
    IssueService.getAllIssues().then(data => {
      setIssues(data);
      setLoading(false);
    });
  }, []);
  
  // Mock issue sync statuses for demonstration
  const syncStatuses = {
    '1': SyncStatus.Synced,
    '2': SyncStatus.Pending,
    '3': SyncStatus.Syncing,
    '4': SyncStatus.Error,
    '5': SyncStatus.Offline,
    '6': SyncStatus.Synced,
    '7': SyncStatus.Pending,
    '8': SyncStatus.Synced,
  };
  
  const [globalSyncState, setGlobalSyncState] = useState({
    isOnline: true,
    isSyncing: false,
    queueCount: 3,
    lastSyncTime: new Date().toISOString(),
    isPaused: false,
  });
  
  const handleSyncNow = () => {
    setGlobalSyncState(prev => ({
      ...prev,
      isSyncing: true
    }));
    
    // Simulate sync completion after 2 seconds
    setTimeout(() => {
      setGlobalSyncState(prev => ({
        ...prev,
        isSyncing: false,
        queueCount: 0,
        lastSyncTime: new Date().toISOString()
      }));
    }, 2000);
  };
  
  const handleToggleOffline = () => {
    setGlobalSyncState(prev => ({
      ...prev,
      isOnline: !prev.isOnline
    }));
  };
  
  const [expandStatusBar, setExpandStatusBar] = useState(false);

  return (
    <PageLayout header={<Header title="Sync Status Demo" />}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SyncStatusBar 
        syncState={globalSyncState}
        expanded={expandStatusBar}
        onToggleExpand={() => setExpandStatusBar(!expandStatusBar)}
        onSyncNow={handleSyncNow}
      />
      
      <ScrollView className="flex-1">
        <ThemedView className="p-4">
          <ThemedText type="title" className="mb-4">Sync Status Indicator Demo</ThemedText>
          
          {/* Global Sync Status Display */}
          <ThemedView className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <ThemedText type="subtitle" className="mb-2">Global Sync Status</ThemedText>
            
            <ThemedView className="flex-row items-center justify-between mb-2">
              <ThemedText>Network Status:</ThemedText>
              {globalSyncState.isOnline ? (
                <ThemedText className="text-green-600 font-medium">Online</ThemedText>
              ) : (
                <ThemedText className="text-gray-500 font-medium">Offline</ThemedText>
              )}
            </ThemedView>
            
            <ThemedView className="flex-row items-center justify-between mb-2">
              <ThemedText>Sync Status:</ThemedText>
              {globalSyncState.isSyncing ? (
                <ThemedText className="text-blue-500 font-medium">Syncing...</ThemedText>
              ) : globalSyncState.queueCount > 0 ? (
                <ThemedText className="text-amber-500 font-medium">
                  {globalSyncState.queueCount} items pending
                </ThemedText>
              ) : (
                <ThemedText className="text-green-600 font-medium">All synced</ThemedText>
              )}
            </ThemedView>
            
            <ThemedView className="flex-row items-center justify-between mb-4">
              <ThemedText>Last Sync:</ThemedText>
              <ThemedText>
                {new Date(globalSyncState.lastSyncTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </ThemedText>
            </ThemedView>
            
            <ThemedView className="flex-row gap-3">
              <Button
                label="Sync Now"
                variant="primary"
                className="flex-1"
                disabled={!globalSyncState.isOnline || globalSyncState.isSyncing}
                onPress={handleSyncNow}
              />
              
              <Button
                label={globalSyncState.isOnline ? "Go Offline" : "Go Online"}
                variant="secondary"
                className="flex-1"
                onPress={handleToggleOffline}
              />
            </ThemedView>
          </ThemedView>
          
          {/* Individual Component Demo */}
          <ThemedText type="subtitle" className="mb-2">Component Variations</ThemedText>
          <SyncStatusDemo />
          
          {/* Issue Cards with Sync Status */}
          <ThemedText type="subtitle" className="mt-6 mb-2">Issues with Sync Status</ThemedText>
          
          {!loading && issues.slice(0, 4).map(issue => (
            <EnhancedIssueCard
              key={issue.id}
              issue={issue}
              syncStatus={syncStatuses[issue.id] || SyncStatus.Synced}
              onSyncPress={() => {
                // Handle sync press for this specific issue
                console.log(`Sync pressed for issue ${issue.id}`);
              }}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </PageLayout>
  );
}
