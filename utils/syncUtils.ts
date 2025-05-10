import { SyncStatus } from '@/types/services/Sync';

/**
 * Utility functions and constants for sync operations
 */

/**
 * Get visual representation info for a sync status
 */
export function getSyncStatusInfo(status: SyncStatus) {
  switch(status) {
    case SyncStatus.Synced:
      return {
        icon: 'checkmark.circle.fill',
        color: '#10B981', // Green
        label: 'Synced',
        description: 'All changes have been synchronized with the server'
      };
    case SyncStatus.Syncing:
      return {
        icon: 'arrow.counterclockwise',
        color: '#3B82F6', // Blue
        label: 'Syncing',
        description: 'Currently synchronizing changes with the server'
      };
    case SyncStatus.Pending:
      return {
        icon: 'clock.fill',
        color: '#F59E0B', // Amber
        label: 'Pending',
        description: 'Changes are waiting to be synchronized'
      };
    case SyncStatus.Error:
      return {
        icon: 'exclamationmark.circle.fill',
        color: '#E11D48', // Red
        label: 'Error',
        description: 'Failed to synchronize changes with the server'
      };
    case SyncStatus.Offline:
      return {
        icon: 'wifi.slash',
        color: '#6B7280', // Gray
        label: 'Offline',
        description: 'Device is offline, changes will sync when reconnected'
      };
    default:
      return {
        icon: 'questionmark.circle',
        color: '#6B7280', // Gray
        label: 'Unknown',
        description: 'Unknown synchronization status'
      };
  }
}

/**
 * Format a sync timestamp in a user-friendly way
 */
export function formatSyncTime(timestamp: string | undefined): string {
  if (!timestamp) return 'Never';
  
  const syncDate = new Date(timestamp);
  const now = new Date();
  
  // Check if it's today
  if (syncDate.toDateString() === now.toDateString()) {
    return `Today at ${syncDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (syncDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${syncDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Otherwise return the full date
  return syncDate.toLocaleDateString([], { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Determine if a sync is required based on last sync time
 * @param lastSyncTime - Last successful sync timestamp
 * @param maxAge - Maximum age in milliseconds before sync is required
 */
export function isSyncRequired(lastSyncTime: string | undefined, maxAge: number = 3600000): boolean {
  if (!lastSyncTime) return true;
  
  const lastSync = new Date(lastSyncTime).getTime();
  const now = Date.now();
  
  return now - lastSync > maxAge;
}
