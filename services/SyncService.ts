/**
 * Synchronization Service
 * 
 * Responsible for managing the synchronization of data between the local device
 * and the remote server. Implements a robust offline-first strategy with
 * conflict resolution.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IssueReport, Photo } from '@/types/models/Issue';
import { SyncQueueItem, SyncStatus } from '@/types/services/Sync';
import { issueStorage, fileStorage } from '@/services/StorageService';

// Storage key for sync queue
const SYNC_QUEUE_KEY = 'xolas_oms.sync_queue';
const SYNC_STATE_KEY = 'xolas_oms.sync_state';

/**
 * Service responsible for managing data synchronization
 */
export class SyncService {
  private apiBaseUrl: string;
  
  constructor(apiBaseUrl: string = 'https://api.example.com/v1') {
    this.apiBaseUrl = apiBaseUrl;
  }
  
  /**
   * Load the sync queue from storage
   */
  async loadSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const queueJson = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      if (!queueJson) return [];
      return JSON.parse(queueJson) as SyncQueueItem[];
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      return [];
    }
  }
  
  /**
   * Save the sync queue to storage
   */
  async saveSyncQueue(queue: SyncQueueItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }
  
  /**
   * Add an item to the sync queue
   */
  async addToSyncQueue(item: Omit<SyncQueueItem, 'queuedAt' | 'attempts' | 'status'>): Promise<void> {
    try {
      const queue = await this.loadSyncQueue();
      
      // Check if item already exists in queue
      const existingIndex = queue.findIndex(
        queueItem => queueItem.entityType === item.entityType && queueItem.entityId === item.entityId
      );
      
      if (existingIndex !== -1) {
        // Update existing item
        queue[existingIndex] = {
          ...item,
          queuedAt: new Date().toISOString(),
          attempts: 0,
          status: SyncStatus.Pending
        };
      } else {
        // Add new item
        queue.push({
          ...item,
          queuedAt: new Date().toISOString(),
          attempts: 0,
          status: SyncStatus.Pending
        });
      }
      
      await this.saveSyncQueue(queue);
    } catch (error) {
      console.error('Failed to add item to sync queue:', error);
    }
  }
  
  /**
   * Remove an item from the sync queue
   */
  async removeFromSyncQueue(entityType: string, entityId: string): Promise<void> {
    try {
      let queue = await this.loadSyncQueue();
      queue = queue.filter(item => !(item.entityType === entityType && item.entityId === entityId));
      await this.saveSyncQueue(queue);
    } catch (error) {
      console.error('Failed to remove item from sync queue:', error);
    }
  }
  
  /**
   * Update an item's status in the sync queue
   */
  async updateSyncQueueItemStatus(
    entityType: string,
    entityId: string,
    status: SyncStatus,
    error?: string
  ): Promise<void> {
    try {
      const queue = await this.loadSyncQueue();
      const itemIndex = queue.findIndex(
        item => item.entityType === entityType && item.entityId === entityId
      );
      
      if (itemIndex !== -1) {
        queue[itemIndex] = {
          ...queue[itemIndex],
          status,
          ...(status === SyncStatus.Error ? { lastError: error } : {}),
          ...(status === SyncStatus.Error ? { attempts: queue[itemIndex].attempts + 1 } : {})
        };
        
        await this.saveSyncQueue(queue);
      }
    } catch (error) {
      console.error('Failed to update sync queue item status:', error);
    }
  }
  
  /**
   * Save the last sync time to storage
   */
  async saveLastSyncTime(): Promise<void> {
    try {
      const syncState = await this.getSyncState();
      await AsyncStorage.setItem(SYNC_STATE_KEY, JSON.stringify({
        ...syncState,
        lastSyncTime: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save last sync time:', error);
    }
  }
  
  /**
   * Get the current sync state from storage
   */
  async getSyncState(): Promise<{
    lastSyncTime?: string;
    isPaused: boolean;
  }> {
    try {
      const stateJson = await AsyncStorage.getItem(SYNC_STATE_KEY);
      if (!stateJson) {
        return {
          lastSyncTime: undefined,
          isPaused: false
        };
      }
      
      return JSON.parse(stateJson);
    } catch (error) {
      console.error('Failed to get sync state:', error);
      return {
        lastSyncTime: undefined,
        isPaused: false
      };
    }
  }
  
  /**
   * Set the sync pause state
   */
  async setSyncPaused(isPaused: boolean): Promise<void> {
    try {
      const syncState = await this.getSyncState();
      await AsyncStorage.setItem(SYNC_STATE_KEY, JSON.stringify({
        ...syncState,
        isPaused
      }));
    } catch (error) {
      console.error('Failed to set sync pause state:', error);
    }
  }
  
  /**
   * Get the current sync status of an entity
   */
  async getSyncStatus(entityType: string, entityId: string): Promise<SyncStatus> {
    try {
      const queue = await this.loadSyncQueue();
      const item = queue.find(
        item => item.entityType === entityType && item.entityId === entityId
      );
      
      return item ? item.status : SyncStatus.Synced;
    } catch (error) {
      console.error('Failed to get sync status:', error);
      return SyncStatus.Synced;
    }
  }
  
  /**
   * Sync all pending items in the queue
   */
  async syncAll(isOnline: boolean): Promise<{
    successful: number;
    failed: number;
    remaining: number;
  }> {
    if (!isOnline) {
      return { successful: 0, failed: 0, remaining: 0 };
    }
    
    try {
      // Sync mechanism would typically:
      // 1. Fetch items from queue
      // 2. For each item, attempt to sync with server
      // 3. On success, remove from queue
      // 4. On failure, update status and increment attempts
      
      // For this demo, we'll simulate a successful sync
      // In a real app, this would make API calls
      
      const queue = await this.loadSyncQueue();
      const syncState = await this.getSyncState();
      
      if (syncState.isPaused) {
        return { 
          successful: 0, 
          failed: 0, 
          remaining: queue.length 
        };
      }
      
      let successful = 0;
      let failed = 0;
      
      // Process each item in the queue
      for (const item of queue) {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // 10% chance of failure for demo purposes
          if (Math.random() < 0.1) {
            throw new Error('Simulated sync failure');
          }
          
          // If successful, remove from queue
          await this.removeFromSyncQueue(item.entityType, item.entityId);
          successful++;
        } catch (error) {
          // If failed, update status
          await this.updateSyncQueueItemStatus(
            item.entityType,
            item.entityId,
            SyncStatus.Error,
            error instanceof Error ? error.message : 'Unknown error'
          );
          failed++;
        }
      }
      
      // Update last sync time
      await this.saveLastSyncTime();
      
      const updatedQueue = await this.loadSyncQueue();
      
      return {
        successful,
        failed,
        remaining: updatedQueue.length
      };
    } catch (error) {
      console.error('Failed to sync all:', error);
      return { successful: 0, failed: 0, remaining: 0 };
    }
  }
  
  /**
   * Queue an issue for sync
   */
  async queueIssueForSync(issue: IssueReport, operation: 'create' | 'update' | 'delete'): Promise<void> {
    await this.addToSyncQueue({
      entityType: 'issue',
      entityId: issue.id,
      operation
    });
  }
  
  /**
   * Queue a photo for sync
   */
  async queuePhotoForSync(issueId: string, photo: Photo, operation: 'create' | 'update' | 'delete'): Promise<void> {
    await this.addToSyncQueue({
      entityType: 'photo',
      entityId: photo.id,
      operation
    });
  }
  
  /**
   * Apply server changes to local data
   * Handles conflict resolution
   */
  async applyServerChanges(serverData: any): Promise<void> {
    // In a real implementation, this would:
    // 1. Compare server data with local data
    // 2. Determine conflicts
    // 3. Apply resolution strategy (server wins, client wins, merge, etc.)
    // 4. Update local data accordingly
    
    // For this demo, we'll just log
    console.log('Applying server changes:', serverData);
  }
}

// Export singleton instance
export const syncService = new SyncService();
