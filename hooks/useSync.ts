import { useState, useEffect, useCallback } from 'react';
import { syncService } from '@/services/sync/SyncService';
import { SyncState, SyncStatus, SyncQueueItem } from '@/types/services/Sync';

/**
 * Hook for accessing sync functionality and state in components
 */
export function useSync() {
  // Track sync state
  const [syncState, setSyncState] = useState<SyncState>(syncService.getState());
  
  // Track sync queue
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(syncService.getSyncQueue());
  
  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = syncService.onStateChange((newState) => {
      setSyncState(newState);
      setSyncQueue(syncService.getSyncQueue());
    });
    
    return unsubscribe;
  }, []);
  
  // Callback to queue an issue for sync
  const queueIssueSync = useCallback(
    (issueId: string, operation: 'create' | 'update' | 'delete') => {
      return syncService.queueIssueSync(issueId, operation);
    },
    []
  );
  
  // Callback to queue a photo for sync
  const queuePhotoSync = useCallback(
    (photoId: string, operation: 'create' | 'delete') => {
      return syncService.queuePhotoSync(photoId, operation);
    },
    []
  );
  
  // Callback to start sync manually
  const syncNow = useCallback(() => {
    return syncService.syncNow();
  }, []);
  
  // Callback to pause sync
  const pauseSync = useCallback(() => {
    syncService.pauseSync();
  }, []);
  
  // Callback to resume sync
  const resumeSync = useCallback(() => {
    syncService.resumeSync();
  }, []);
  
  // Callback to retry failed items
  const retryFailedItems = useCallback(() => {
    return syncService.retryFailedItems();
  }, []);
  
  // Helper to get sync status for a specific issue
  const getIssueStatus = useCallback(
    (issueId: string): SyncStatus => {
      return syncService.getIssueStatus(issueId);
    },
    []
  );
  
  // Callback to clear all sync items
  const clearSyncQueue = useCallback(() => {
    return syncService.clearSyncQueue();
  }, []);
  
  // Callback to clear specific sync items
  const clearSyncItems = useCallback((queueIds: string[]) => {
    return syncService.clearSyncItems(queueIds);
  }, []);
  
  // Callback to update sync settings
  const updateSyncSettings = useCallback((settings: any) => {
    return syncService.updateSettings(settings);
  }, []);
  
  // Helper to get sync settings
  const getSyncSettings = useCallback(() => {
    return syncService.getSettings();
  }, []);
  
  // Register for sync errors
  const onSyncError = useCallback((callback: (error: any) => void) => {
    // This would need to be implemented in SyncService
    // For now, let's just return a no-op cleanup function
    return () => {};
  }, []);
  
  return {
    syncState,
    syncQueue,
    queueIssueSync,
    queuePhotoSync,
    syncNow,
    pauseSync,
    resumeSync,
    retryFailedItems,
    getIssueStatus,
    clearSyncQueue,
    clearSyncItems,
    updateSyncSettings,
    getSyncSettings,
    onSyncError,
  };
}
