import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { SyncStatus } from '@/types/services/Sync';

/**
 * Demo component to showcase all possible states of the SyncStatusIndicator
 */
export function SyncStatusDemo() {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <ScrollView>
      <ThemedView className="p-4 gap-6">
        <ThemedText type="title">Sync Status Indicators</ThemedText>
        
        <ThemedView className="gap-2">
          <ThemedText type="subtitle">All States</ThemedText>
          <ThemedView className="gap-2">
            <SyncStatusIndicator status={SyncStatus.Synced} />
            <SyncStatusIndicator status={SyncStatus.Syncing} />
            <SyncStatusIndicator status={SyncStatus.Pending} pendingCount={3} />
            <SyncStatusIndicator status={SyncStatus.Error} />
            <SyncStatusIndicator status={SyncStatus.Offline} />
          </ThemedView>
        </ThemedView>
        
        <ThemedView className="gap-2">
          <ThemedText type="subtitle">Size Variants</ThemedText>
          <ThemedView className="flex-row flex-wrap gap-2">
            <SyncStatusIndicator status={SyncStatus.Synced} size="small" />
            <SyncStatusIndicator status={SyncStatus.Synced} size="medium" />
            <SyncStatusIndicator status={SyncStatus.Synced} size="large" />
          </ThemedView>
        </ThemedView>
        
        <ThemedView className="gap-2">
          <ThemedText type="subtitle">Icon Only</ThemedText>
          <ThemedView className="flex-row flex-wrap gap-2">
            <SyncStatusIndicator status={SyncStatus.Synced} showLabel={false} />
            <SyncStatusIndicator status={SyncStatus.Syncing} showLabel={false} />
            <SyncStatusIndicator status={SyncStatus.Pending} showLabel={false} />
            <SyncStatusIndicator status={SyncStatus.Error} showLabel={false} />
            <SyncStatusIndicator status={SyncStatus.Offline} showLabel={false} />
          </ThemedView>
        </ThemedView>
        
        <ThemedView className="gap-2">
          <ThemedText type="subtitle">Interactive</ThemedText>
          <ThemedView className="gap-2">
            <SyncStatusIndicator 
              status={SyncStatus.Pending} 
              pendingCount={3}
              interactive 
              onPress={() => setShowDetails(!showDetails)} 
            />
            
            {showDetails && (
              <ThemedView className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <ThemedText className="font-medium">Pending Items</ThemedText>
                <ThemedText>• Water pump malfunction report (created)</ThemedText>
                <ThemedText>• Electrical panel photo (uploaded)</ThemedText>
                <ThemedText>• Safety rail damage report (updated)</ThemedText>
                
                <Button 
                  label="Sync Now" 
                  variant="primary" 
                  className="mt-3" 
                  onPress={() => setShowDetails(false)} 
                />
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
        
        <ThemedView className="gap-2">
          <ThemedText type="subtitle">In Card Context</ThemedText>
          <ThemedView className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <ThemedView className="p-4 border-b border-gray-300 dark:border-gray-700">
              <ThemedView className="flex-row justify-between items-center">
                <ThemedText className="font-semibold">Water Pump Malfunction</ThemedText>
                <SyncStatusIndicator status={SyncStatus.Pending} size="small" />
              </ThemedView>
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Main water pump making unusual noise
              </ThemedText>
            </ThemedView>
            
            <ThemedView className="p-4 border-b border-gray-300 dark:border-gray-700">
              <ThemedView className="flex-row justify-between items-center">
                <ThemedText className="font-semibold">Roof Drainage Blockage</ThemedText>
                <SyncStatusIndicator status={SyncStatus.Synced} size="small" />
              </ThemedView>
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Partial blockage in roof drainage system
              </ThemedText>
            </ThemedView>
            
            <ThemedView className="p-4">
              <ThemedView className="flex-row justify-between items-center">
                <ThemedText className="font-semibold">HVAC Filter Replacement</ThemedText>
                <SyncStatusIndicator status={SyncStatus.Error} size="small" />
              </ThemedView>
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Scheduled maintenance for HVAC filters
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
