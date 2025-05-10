/**
 * Types related to the synchronization service
 */

/**
 * Represents the current sync state for an issue report
 */
export enum SyncStatus {
  /** Item is synced with server */
  Synced = "synced",
  /** Item is currently being synced */
  Syncing = "syncing",
  /** Item has local changes waiting to be synced */
  Pending = "pending",
  /** Item failed to sync due to an error */
  Error = "error",
  /** Network is offline, sync not possible */
  Offline = "offline"
}

/**
 * Represents an item in the sync queue
 */
export interface SyncQueueItem {
  /** Type of entity to sync */
  entityType: "issue" | "photo";
  /** Unique identifier of the entity */
  entityId: string;
  /** Operation to perform */
  operation: "create" | "update" | "delete";
  /** Timestamp when the item was added to queue */
  queuedAt: string;
  /** Number of sync attempts */
  attempts: number;
  /** Last error message if failed */
  lastError?: string;
  /** Current sync status */
  status: SyncStatus;
}

/**
 * Global sync state of the application
 */
export interface SyncState {
  /** Whether the device is currently online */
  isOnline: boolean;
  /** Whether sync is currently in progress */
  isSyncing: boolean;
  /** Number of items in sync queue */
  queueCount: number;
  /** Last successful sync timestamp */
  lastSyncTime?: string;
  /** Whether sync is paused */
  isPaused: boolean;
}
