import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSync } from '@/hooks/useSync';
import { SyncState, SyncStatus, SyncQueueItem } from '@/types/services/Sync';

// Define context type
interface SyncContextType {
  // Current sync state
  syncState: SyncState;
  
  // Items in the sync queue
  syncQueue: SyncQueueItem[];
  
  // Queue an issue for sync
  queueIssueSync: (issueId: string, operation: 'create' | 'update' | 'delete') => Promise<void>;
  
  // Queue a photo for sync
  queuePhotoSync: (photoId: string, operation: 'create' | 'delete') => Promise<void>;
  
  // Start sync manually
  syncNow: () => Promise<void>;
  
  // Pause sync
  pauseSync: () => void;
  
  // Resume sync
  resumeSync: () => void;
  
  // Retry failed items
  retryFailedItems: () => Promise<void>;
  
  // Get sync status for a specific issue
  getIssueStatus: (issueId: string) => SyncStatus;
  
  // Clear all sync items
  clearSyncQueue: () => Promise<void>;
  
  // Clear specific sync items
  clearSyncItems: (queueIds: string[]) => Promise<void>;
  
  // Update sync settings
  updateSyncSettings: (settings: {
    syncInterval?: number;
    networkPreference?: 'all' | 'wifi' | 'cellular';
    batchSize?: number;
    maxRetryAttempts?: number;
  }) => Promise<void>;
  
  // Get current sync settings
  getSyncSettings: () => {
    syncInterval: number;
    networkPreference: 'all' | 'wifi' | 'cellular';
    batchSize: number;
    maxRetryAttempts: number;
  };
}

// Create context
const SyncContext = createContext<SyncContextType | undefined>(undefined);

// Context provider component
export function SyncProvider({ children }: { children: ReactNode }) {
  // Use the sync hook
  const sync = useSync();
  
  // Register a warning listener for sync errors
  useEffect(() => {
    const handleSyncError = (error: any) => {
      console.warn('Sync error:', error);
      // Could add error reporting or user notifications here
    };
    
    // Add listener and store cleanup function
    const cleanup = sync.onSyncError(handleSyncError);
    
    return cleanup;
  }, [sync]);
  
  return (
    <SyncContext.Provider value={sync}>
      {children}
    </SyncContext.Provider>
  );
}

// Custom hook to use the context
export function useSyncContext() {
  const context = useContext(SyncContext);
  
  if (context === undefined) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  
  return context;
}
