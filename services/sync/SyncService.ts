import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { issueStorage, fileStorage } from '@/services/StorageService';
import { ApiService } from '@/services/api/apiService';
import { SyncState, SyncStatus, SyncQueueItem } from '@/types/services/Sync';
import { IssueReport } from '@/types/models/Issue';

// Storage keys for sync data
const STORAGE_KEYS = {
  SYNC_QUEUE: 'xolas_oms.sync_queue',
  LAST_SYNC_TIME: 'xolas_oms.last_sync_time',
  SYNC_SETTINGS: 'xolas_oms.sync_settings',
};

// Default sync settings
const DEFAULT_SYNC_SETTINGS = {
  syncInterval: 60000, // 1 minute
  networkPreference: 'all', // 'all' | 'wifi' | 'cellular'
  batchSize: 5, // Max items to sync in one batch
  maxRetryAttempts: 5,
};

/**
 * Service for managing synchronization between local storage and server
 * Implements a robust offline-first strategy with conflict resolution
 */
export class SyncService {
  // Singleton instance
  private static instance: SyncService;
  
  // Queue of items to be synced
  private syncQueue: SyncQueueItem[] = [];
  
  // Current sync state
  private state: SyncState = {
    isOnline: false,
    isSyncing: false,
    queueCount: 0,
    lastSyncTime: undefined,
    isPaused: false,
  };
  
  // Sync settings
  private settings = DEFAULT_SYNC_SETTINGS;
  
  // Callbacks for state changes
  private stateChangeCallbacks: ((state: SyncState) => void)[] = [];
  
  // Network subscription
  private netInfoUnsubscribe: (() => void) | undefined;
  
  // Sync timer reference
  private syncTimerId: NodeJS.Timeout | undefined;
  
  // Private constructor (use getInstance)
  private constructor() {
    this.initialize();
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }
  
  /**
   * Initialize the sync service
   */
  private async initialize(): Promise<void> {
    // Load sync settings
    const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_SETTINGS);
    if (settingsJson) {
      this.settings = { ...DEFAULT_SYNC_SETTINGS, ...JSON.parse(settingsJson) };
    }
    
    // Load sync queue from storage
    const queueJson = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    if (queueJson) {
      this.syncQueue = JSON.parse(queueJson);
      this.updateState({ queueCount: this.syncQueue.length });
    }
    
    // Load last sync time
    const lastSyncTime = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
    if (lastSyncTime) {
      this.updateState({ lastSyncTime });
    }
    
    // Set up network state listener
    this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
      const isOnline = !!state.isConnected && !!state.isInternetReachable;
      const networkType = state.type;
      
      // Check if we should sync based on network preference
      let shouldSync = isOnline;
      if (this.settings.networkPreference === 'wifi' && networkType !== 'wifi') {
        shouldSync = false;
      } else if (this.settings.networkPreference === 'cellular' && networkType !== 'cellular') {
        shouldSync = false;
      }
      
      // Only update if status changed
      if (isOnline !== this.state.isOnline) {
        this.updateState({ isOnline });
        
        // If we just came online and have pending items, try to sync
        if (shouldSync && this.syncQueue.length > 0 && !this.state.isPaused) {
          this.scheduleSyncIfNeeded();
        }
      }
    });
    
    // Initial network check
    const netState = await NetInfo.fetch();
    this.updateState({ 
      isOnline: !!netState.isConnected && !!netState.isInternetReachable 
    });
    
    // Start sync timer if needed
    this.scheduleSyncIfNeeded();
  }
  
  /**
   * Schedule sync based on settings
   */
  private scheduleSyncIfNeeded(): void {
    // Clear existing timer
    if (this.syncTimerId) {
      clearTimeout(this.syncTimerId);
      this.syncTimerId = undefined;
    }
    
    // Don't schedule if paused or offline
    if (this.state.isPaused || !this.state.isOnline || this.syncQueue.length === 0) {
      return;
    }
    
    // Schedule sync
    this.syncTimerId = setTimeout(() => {
      this.syncNow();
    }, this.settings.syncInterval);
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
    }
    
    if (this.syncTimerId) {
      clearTimeout(this.syncTimerId);
    }
  }
  
  /**
   * Update the sync state and notify listeners
   */
  private updateState(partialState: Partial<SyncState>): void {
    this.state = { ...this.state, ...partialState };
    
    // Notify all registered callbacks
    this.stateChangeCallbacks.forEach(callback => {
      callback(this.state);
    });
    
    // Persist relevant state
    if (partialState.lastSyncTime) {
      AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, partialState.lastSyncTime);
    }
  }
  
  /**
   * Register a callback for state changes
   */
  public onStateChange(callback: (state: SyncState) => void): () => void {
    this.stateChangeCallbacks.push(callback);
    
    // Call immediately with current state
    callback(this.state);
    
    // Return unsubscribe function
    return () => {
      this.stateChangeCallbacks = this.stateChangeCallbacks.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Get the current sync state
   */
  public getState(): SyncState {
    return { ...this.state };
  }
  
  /**
   * Update sync settings
   */
  public async updateSettings(settings: Partial<typeof DEFAULT_SYNC_SETTINGS>): Promise<void> {
    this.settings = { ...this.settings, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_SETTINGS, JSON.stringify(this.settings));
    
    // Restart sync timer with new settings
    this.scheduleSyncIfNeeded();
  }
  
  /**
   * Get current sync settings
   */
  public getSettings(): typeof DEFAULT_SYNC_SETTINGS {
    return { ...this.settings };
  }
  
  /**
   * Get sync status for a specific issue
   */
  public getIssueStatus(issueId: string): SyncStatus {
    // Find the issue in the sync queue
    const queuedIssue = this.syncQueue.find(
      item => item.entityType === 'issue' && item.entityId === issueId
    );
    
    if (!queuedIssue) {
      return SyncStatus.Synced; // Not in queue = synced
    }
    
    return queuedIssue.status;
  }
  
  /**
   * Add an issue to the sync queue
   */
  public async queueIssueSync(
    issueId: string, 
    operation: 'create' | 'update' | 'delete'
  ): Promise<void> {
    // Check if already in queue
    const existingIndex = this.syncQueue.findIndex(
      item => item.entityType === 'issue' && item.entityId === issueId
    );
    
    // Generate a unique queue ID if it's a new item
    const queueId = existingIndex >= 0 
      ? this.syncQueue[existingIndex].queueId 
      : `issue_${issueId}_${new Date().getTime()}`;
    
    // If already in queue, update the operation
    if (existingIndex >= 0) {
      // Special handling for operation transitions
      if (this.syncQueue[existingIndex].operation === 'create' && operation === 'update') {
        // If current operation is create and new is update, keep as create
        operation = 'create';
      } else if (
        (this.syncQueue[existingIndex].operation === 'create' || 
         this.syncQueue[existingIndex].operation === 'update') && 
        operation === 'delete'
      ) {
        // If record hasn't been created on server yet, just remove from queue
        if (this.syncQueue[existingIndex].operation === 'create') {
          this.syncQueue = this.syncQueue.filter((_, i) => i !== existingIndex);
          await this.persistQueue();
          return;
        }
        // Otherwise, mark for deletion
      }
      
      this.syncQueue[existingIndex].operation = operation;
      this.syncQueue[existingIndex].status = SyncStatus.Pending;
      this.syncQueue[existingIndex].lastModified = new Date().toISOString();
    } else {
      // Add new item to queue
      this.syncQueue.push({
        queueId,
        entityType: 'issue',
        entityId: issueId,
        operation,
        queuedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        attempts: 0,
        status: SyncStatus.Pending,
        retryBackoff: 1000, // Initial retry delay in ms
      });
    }
    
    // Persist queue to storage
    await this.persistQueue();
    
    // Try to sync if online and not paused
    if (this.state.isOnline && !this.state.isPaused && !this.state.isSyncing) {
      this.scheduleSyncIfNeeded();
    }
  }
  
  /**
   * Add a photo to the sync queue
   */
  public async queuePhotoSync(
    photoId: string,
    operation: 'create' | 'delete'
  ): Promise<void> {
    // Check if already in queue
    const existingIndex = this.syncQueue.findIndex(
      item => item.entityType === 'photo' && item.entityId === photoId
    );
    
    // Generate a unique queue ID if it's a new item
    const queueId = existingIndex >= 0 
      ? this.syncQueue[existingIndex].queueId 
      : `photo_${photoId}_${new Date().getTime()}`;
    
    if (existingIndex >= 0) {
      // Special handling for operation transitions
      if (this.syncQueue[existingIndex].operation === 'create' && operation === 'delete') {
        // If photo hasn't been created on server yet, just remove from queue
        this.syncQueue = this.syncQueue.filter((_, i) => i !== existingIndex);
        await this.persistQueue();
        return;
      }
      
      this.syncQueue[existingIndex].operation = operation;
      this.syncQueue[existingIndex].status = SyncStatus.Pending;
      this.syncQueue[existingIndex].lastModified = new Date().toISOString();
    } else {
      // Add new item to queue
      this.syncQueue.push({
        queueId,
        entityType: 'photo',
        entityId: photoId,
        operation,
        queuedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        attempts: 0,
        status: SyncStatus.Pending,
        retryBackoff: 1000, // Initial retry delay in ms
      });
    }
    
    await this.persistQueue();
    
    if (this.state.isOnline && !this.state.isPaused && !this.state.isSyncing) {
      this.scheduleSyncIfNeeded();
    }
  }
  
  /**
   * Group sync items by entity and operation
   * This optimizes syncing by handling dependencies correctly
   */
  private groupSyncItems(items: SyncQueueItem[]): SyncQueueItem[][] {
    // Sort by:
    // 1. Dependencies (photos depend on issues)
    // 2. Operation type (creates before updates before deletes)
    // 3. Queue time (oldest first)
    
    const sorted = [...items].sort((a, b) => {
      // Entity type priority: issues before photos
      if (a.entityType !== b.entityType) {
        return a.entityType === 'issue' ? -1 : 1;
      }
      
      // Operation priority
      const opPriority: Record<string, number> = { 'create': 0, 'update': 1, 'delete': 2 };
      if (a.operation !== b.operation) {
        return opPriority[a.operation] - opPriority[b.operation];
      }
      
      // Timestamp (oldest first)
      return new Date(a.queuedAt).getTime() - new Date(b.queuedAt).getTime();
    });
    
    // Group into batches of configured size
    const batches: SyncQueueItem[][] = [];
    for (let i = 0; i < sorted.length; i += this.settings.batchSize) {
      batches.push(sorted.slice(i, i + this.settings.batchSize));
    }
    
    return batches;
  }
  
  /**
   * Start synchronization process
   */
  public async syncNow(): Promise<void> {
    // If already syncing, offline, or paused, or no items to sync, do nothing
    if (
      this.state.isSyncing || 
      !this.state.isOnline || 
      this.state.isPaused ||
      this.syncQueue.length === 0
    ) {
      return;
    }
    
    try {
      // Mark as syncing
      this.updateState({ isSyncing: true });
      
      // Get pending items (not in error state or already syncing)
      const pendingItems = this.syncQueue.filter(
        item => item.status === SyncStatus.Pending
      );
      
      if (pendingItems.length === 0) {
        return;
      }
      
      // Group items for efficient processing
      const batches = this.groupSyncItems(pendingItems);
      
      // Process each batch
      for (const batch of batches) {
        try {
          // Mark all items in batch as syncing
          for (const item of batch) {
            item.status = SyncStatus.Syncing;
            item.attempts += 1;
          }
          await this.persistQueue();
          
          // Process batch based on types
          if (this.canBatchProcess(batch)) {
            // Process as a batch if all items are of same type and operation
            await this.processBatch(batch);
          } else {
            // Process individually
            for (const item of batch) {
              try {
                if (item.entityType === 'issue') {
                  await this.syncIssue(item);
                } else if (item.entityType === 'photo') {
                  await this.syncPhoto(item);
                }
                
                // Remove from queue on success
                this.syncQueue = this.syncQueue.filter(i => i.queueId !== item.queueId);
              } catch (error) {
                console.error(`Sync failed for ${item.entityType} ${item.entityId}:`, error);
                
                // Update item status based on attempts
                this.handleSyncError(item, error);
              }
            }
          }
          
          await this.persistQueue();
        } catch (error) {
          console.error('Batch sync failed:', error);
          
          // Mark all items in batch for retry
          for (const item of batch) {
            this.handleSyncError(item, error);
          }
          
          await this.persistQueue();
        }
      }
      
      // Update last sync time
      this.updateState({ 
        lastSyncTime: new Date().toISOString(),
        queueCount: this.syncQueue.length
      });
    } finally {
      // Mark as not syncing
      this.updateState({ isSyncing: false });
      
      // Schedule next sync if needed
      this.scheduleSyncIfNeeded();
    }
  }
  
  /**
   * Handle sync error for an item
   */
  private handleSyncError(item: SyncQueueItem, error: any): void {
    // Increase backoff with jitter (random factor between 0.8-1.2)
    const jitter = 0.8 + Math.random() * 0.4;
    item.retryBackoff = Math.min(item.retryBackoff * 2 * jitter, 3600000); // Cap at 1 hour
    
    // Mark as error if max attempts reached
    if (item.attempts >= this.settings.maxRetryAttempts) {
      item.status = SyncStatus.Error;
      item.lastError = error.message || 'Unknown error';
    } else {
      // Mark for retry later
      item.status = SyncStatus.Pending;
      // Schedule retry after backoff period
      setTimeout(() => {
        if (!this.state.isSyncing && !this.state.isPaused && this.state.isOnline) {
          this.syncNow();
        }
      }, item.retryBackoff);
    }
  }
  
  /**
   * Check if items can be processed as a batch
   */
  private canBatchProcess(items: SyncQueueItem[]): boolean {
    // Check if all items are of same type and operation
    if (items.length <= 1) return false;
    
    const firstItem = items[0];
    return items.every(item => 
      item.entityType === firstItem.entityType && 
      item.operation === firstItem.operation
    );
  }
  
  /**
   * Process a batch of items
   */
  private async processBatch(items: SyncQueueItem[]): Promise<void> {
    if (items.length === 0) return;
    
    const firstItem = items[0];
    const changes = await Promise.all(
      items.map(async item => {
        if (item.entityType === 'issue') {
          const issue = await issueStorage.getIssueById(item.entityId);
          return {
            entityType: 'issue',
            operation: item.operation,
            data: issue
          };
        } else {
          // For photos, get the necessary data
          // This would need to be adapted based on your photo storage implementation
          return {
            entityType: 'photo',
            operation: item.operation,
            data: { id: item.entityId }
          };
        }
      })
    );
    
    // Use the batch API
    await ApiService.batchSync(changes);
    
    // On success, remove all items from queue
    this.syncQueue = this.syncQueue.filter(
      item => !items.some(syncItem => syncItem.queueId === item.queueId)
    );
  }
  
  /**
   * Sync a specific issue
   */
  private async syncIssue(item: SyncQueueItem): Promise<void> {
    const { entityId, operation } = item;
    
    switch (operation) {
      case 'create':
      case 'update':
        // Get issue from local storage
        const issue = await issueStorage.getIssueById(entityId);
        if (!issue) {
          throw new Error('Issue not found in local storage');
        }
        
        // Perform API operation
        if (operation === 'create') {
          // Omit the ID when creating - server will assign one
          const { id, ...issueWithoutId } = issue;
          await ApiService.createIssue(issueWithoutId);
        } else {
          await ApiService.updateIssue(issue);
        }
        break;
        
      case 'delete':
        // Delete from API
        await ApiService.deleteIssue(entityId);
        break;
    }
  }
  
  /**
   * Sync a specific photo
   */
  private async syncPhoto(item: SyncQueueItem): Promise<void> {
    const { entityId, operation } = item;
    
    switch (operation) {
      case 'create':
        // Get photo data from storage
        // This would need to be adapted based on your photo storage implementation
        const photoData = await fileStorage.getPhotoData(entityId);
        if (!photoData) {
          throw new Error('Photo not found in local storage');
        }
        
        // Upload to API
        await ApiService.uploadPhoto(
          photoData.issueId,
          photoData.uri,
          photoData.title || 'Untitled'
        );
        break;
        
      case 'delete':
        // Delete from API
        await ApiService.deletePhoto(entityId);
        break;
    }
  }
  
  /**
   * Persist queue to storage
   */
  private async persistQueue(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.syncQueue));
    this.updateState({ queueCount: this.syncQueue.length });
  }
  
  /**
   * Pause sync operations
   */
  public pauseSync(): void {
    this.updateState({ isPaused: true });
    
    // Clear sync timer
    if (this.syncTimerId) {
      clearTimeout(this.syncTimerId);
      this.syncTimerId = undefined;
    }
  }
  
  /**
   * Resume sync operations
   */
  public resumeSync(): void {
    this.updateState({ isPaused: false });
    
    // Try to sync if online and have items
    if (this.state.isOnline && this.syncQueue.length > 0) {
      this.scheduleSyncIfNeeded();
    }
  }
  
  /**
   * Clear sync errors and retry
   */
  public async retryFailedItems(): Promise<void> {
    // Reset error status to pending
    this.syncQueue = this.syncQueue.map(item => {
      if (item.status === SyncStatus.Error) {
        return {
          ...item,
          status: SyncStatus.Pending,
          attempts: 0,
          lastError: undefined,
          retryBackoff: 1000, // Reset backoff
        };
      }
      return item;
    });
    
    await this.persistQueue();
    
    // Try to sync
    if (this.state.isOnline && !this.state.isPaused) {
      this.syncNow();
    }
  }
  
  /**
   * Get items in the sync queue
   */
  public getSyncQueue(): SyncQueueItem[] {
    return [...this.syncQueue];
  }
  
  /**
   * Clear all items from sync queue
   */
  public async clearSyncQueue(): Promise<void> {
    this.syncQueue = [];
    await this.persistQueue();
  }
  
  /**
   * Clear specific items from sync queue
   */
  public async clearSyncItems(queueIds: string[]): Promise<void> {
    this.syncQueue = this.syncQueue.filter(item => !queueIds.includes(item.queueId));
    await this.persistQueue();
  }
}

// Export singleton instance
export const syncService = SyncService.getInstance();
