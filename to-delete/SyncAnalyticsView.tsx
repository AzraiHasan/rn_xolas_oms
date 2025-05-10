import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSyncContext } from '@/contexts/SyncContext';
import { SyncStatus } from '@/types/services/Sync';
import { formatSyncTime } from '@/utils/syncUtils';

const { width } = Dimensions.get('window');

// Sync analytics component to display statistics about sync operations
export function SyncAnalyticsView() {
  const { syncState, syncQueue } = useSyncContext();
  const [stats, setStats] = useState({
    totalSynced: 0,
    totalPending: 0,
    totalError: 0,
    issueCount: 0,
    photoCount: 0,
    averageSyncTime: 0,
    syncHistory: [] as {date: string, count: number}[]
  });

  // Calculate statistics whenever the sync queue changes
  useEffect(() => {
    // Count by type
    const issueCount = syncQueue.filter(item => item.entityType === 'issue').length;
    const photoCount = syncQueue.filter(item => item.entityType === 'photo').length;

    // Count by status
    const byStatus = {
      pending: syncQueue.filter(item => item.status === SyncStatus.Pending).length,
      error: syncQueue.filter(item => item.status === SyncStatus.Error).length,
      syncing: syncQueue.filter(item => item.status === SyncStatus.Syncing).length
    };

    // Generate fake history data (in a real app, this would come from persistent storage)
    const today = new Date();
    const syncHistory = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 20) + 1 // Random value for demo
      };
    });

    setStats({
      totalSynced: 85, // Demo value
      totalPending: byStatus.pending,
      totalError: byStatus.error,
      issueCount,
      photoCount,
      averageSyncTime: 1.8, // Demo value in seconds
      syncHistory
    });
  }, [syncQueue]);

  // Find the maximum count for scaling the chart
  const maxCount = Math.max(...stats.syncHistory.map(item => item.count));

  return (
    <ScrollView>
      <ThemedView className="p-4">
        <ThemedText type="title" className="mb-4">Sync Analytics</ThemedText>
        
        {/* Summary Cards */}
        <ThemedView className="flex-row flex-wrap mb-6">
          <StatCard 
            title="Total Synced"
            value={stats.totalSynced}
            icon="checkmark.circle.fill"
            iconColor="#10B981"
          />
          <StatCard 
            title="Pending"
            value={stats.totalPending}
            icon="clock.fill"
            iconColor="#F59E0B"
          />
          <StatCard 
            title="Errors"
            value={stats.totalError}
            icon="exclamationmark.triangle.fill"
            iconColor="#EF4444"
          />
        </ThemedView>
        
        {/* Last Sync Info */}
        <ThemedView className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <ThemedText type="subtitle" className="mb-2">Last Sync</ThemedText>
          <ThemedView className="flex-row justify-between">
            <ThemedText>Time:</ThemedText>
            <ThemedText>{formatSyncTime(syncState.lastSyncTime)}</ThemedText>
          </ThemedView>
          <ThemedView className="flex-row justify-between mt-1">
            <ThemedText>Average Duration:</ThemedText>
            <ThemedText>{stats.averageSyncTime.toFixed(1)}s</ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* Sync Chart */}
        <ThemedView className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <ThemedText type="subtitle" className="mb-2">Sync Activity (Last 7 Days)</ThemedText>
          <ThemedView className="h-[180px] flex-row items-end justify-between mt-4">
            {stats.syncHistory.map((day, index) => (
              <ThemedView key={day.date} className="items-center">
                <ThemedView 
                  className="bg-blue-500 rounded-t-md w-8" 
                  style={{ height: (day.count / maxCount) * 120 }}
                />
                <ThemedText className="text-xs mt-1">{day.date}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
        
        {/* Entity Distribution */}
        <ThemedView className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <ThemedText type="subtitle" className="mb-2">Entity Distribution</ThemedText>
          
          <ThemedView className="mt-2">
            <ThemedView className="flex-row justify-between mb-1">
              <ThemedText>Issues:</ThemedText>
              <ThemedText>{stats.issueCount}</ThemedText>
            </ThemedView>
            <ThemedView className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-3">
              <ThemedView 
                className="bg-green-500 h-full"
                style={{ width: `${stats.issueCount * 100 / (stats.issueCount + stats.photoCount || 1)}%` }}
              />
            </ThemedView>
            
            <ThemedView className="flex-row justify-between mb-1">
              <ThemedText>Photos:</ThemedText>
              <ThemedText>{stats.photoCount}</ThemedText>
            </ThemedView>
            <ThemedView className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <ThemedView 
                className="bg-blue-500 h-full"
                style={{ width: `${stats.photoCount * 100 / (stats.issueCount + stats.photoCount || 1)}%` }}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

// Reusable stat card component
function StatCard({ title, value, icon, iconColor }: { 
  title: string; 
  value: number; 
  icon: string; 
  iconColor: string;
}) {
  return (
    <ThemedView className="bg-white dark:bg-gray-800 p-4 rounded-lg mr-2 mb-2 shadow-sm" style={{ width: (width - 32) / 2 - 4 }}>
      <ThemedView className="flex-row items-center justify-between">
        <ThemedText className="text-gray-500 dark:text-gray-400">{title}</ThemedText>
        <IconSymbol name={icon} size={20} color={iconColor} />
      </ThemedView>
      <ThemedText className="text-2xl font-bold mt-2">{value}</ThemedText>
    </ThemedView>
  );
}
