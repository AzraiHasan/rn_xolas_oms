/**
 * Strategic Data Persistence Layer
 * 
 * This implementation represents a mission-critical component that enables 
 * field technicians to operate effectively in environments with inconsistent connectivity.
 * By implementing a robust local-first architecture, we create a resilient foundation
 * for field operations that prioritizes data integrity while optimizing for the realities
 * of on-site work conditions.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { getDeviceId } from '../utils/deviceId';

// Pure JavaScript UUID v4 generation
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

import { 
  IssueReport, 
  IssueReportInput, 
  Photo 
} from '../types/models/Issue';
import { 
  IssueStorageService, 
  FileStorageService 
} from '../types/services/Storage';

// Storage key constants
const STORAGE_KEYS = {
  ISSUES: 'xolas_oms.issues',
};

// Web-compatible AsyncStorage adapter
const storage = Platform.OS === 'web' && typeof window !== 'undefined' ? {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
} : Platform.OS === 'web' ? {
  getItem: (key: string) => Promise.resolve(null),
  setItem: (key: string, value: string) => Promise.resolve(),
  removeItem: (key: string) => Promise.resolve(),
} : AsyncStorage;

/**
 * AsyncStorage-based issue persistence service
 * Implements a strategic offline-first approach to data management
 */
export class AsyncStorageIssueService implements IssueStorageService {
  /**
   * Retrieve all issues from local storage
   */
  async getAllIssues(): Promise<IssueReport[]> {
    try {
      const issuesJson = await storage.getItem(STORAGE_KEYS.ISSUES);
      if (!issuesJson) return [];
      return JSON.parse(issuesJson) as IssueReport[];
    } catch (error) {
      console.error('Failed to retrieve issues:', error);
      return [];
    }
  }

  /**
   * Retrieve a specific issue by ID
   */
  async getIssueById(id: string): Promise<IssueReport | null> {
    try {
      const issues = await this.getAllIssues();
      const issue = issues.find(issue => issue.id === id);
      return issue || null;
    } catch (error) {
      console.error(`Failed to retrieve issue with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Create a new issue with a generated unique identifier
   */
  async createIssue(issueInput: IssueReportInput): Promise<IssueReport> {
    try {
      const issues = await this.getAllIssues();
      const deviceId = await getDeviceId();
      
      // Create a new issue with a unique ID and sync fields
      const newIssue: IssueReport = {
        ...issueInput,
        id: generateId(),
        sync_status: 'pending',
        device_id: deviceId,
      };
      
      // Add to the collection and persist
      issues.push(newIssue);
      await storage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
      
      return newIssue;
    } catch (error) {
      console.error('Failed to create issue:', error);
      throw new Error('Failed to create issue');
    }
  }

  /**
   * Update an existing issue report
   */
  async updateIssue(updatedIssue: IssueReport): Promise<IssueReport> {
    try {
      const issues = await this.getAllIssues();
      const issueIndex = issues.findIndex(issue => issue.id === updatedIssue.id);
      
      if (issueIndex === -1) {
        throw new Error(`Issue with ID ${updatedIssue.id} not found`);
      }
      
      // Update the issue in the collection
      issues[issueIndex] = updatedIssue;
      await AsyncStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
      
      return updatedIssue;
    } catch (error) {
      console.error(`Failed to update issue with ID ${updatedIssue.id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an issue by ID
   */
  async deleteIssue(id: string): Promise<boolean> {
    try {
      const issues = await this.getAllIssues();
      const filteredIssues = issues.filter(issue => issue.id !== id);
      
      // If no issues were removed, the ID didn't exist
      if (filteredIssues.length === issues.length) {
        return false;
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(filteredIssues));
      return true;
    } catch (error) {
      console.error(`Failed to delete issue with ID ${id}:`, error);
      return false;
    }
  }
}

/**
 * Web-compatible storage service for images
 */
class WebFileStorageService implements FileStorageService {
  async saveImage(uri: string, title?: string): Promise<{ id: string; uri: string }> {
    const id = generateId();
    // On web, we just return the original URI since we can't save to filesystem
    return { id, uri };
  }
  
  async deleteImage(uri: string): Promise<boolean> {
    // On web, we can't actually delete files, so always return true
    return true;
  }
  
  async getPhotoData(photoId: string): Promise<{ issueId: string; uri: string; title?: string } | null> {
    try {
      // Get all issues to find the photo
      const issues = await issueStorage.getAllIssues();
      
      for (const issue of issues) {
        const photo = issue.photos.find(p => p.id === photoId);
        if (photo) {
          return {
            issueId: issue.id,
            uri: photo.uri,
            title: photo.title
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to get photo data for ID ${photoId}:`, error);
      return null;
    }
  }
}

/**
 * FileSystem-based image storage service
 * Manages persistent storage of photographic evidence captured in the field
 */
export class ExpoFileSystemService implements FileStorageService {
  // Base directory for storing images
  private readonly imagesDirectory: string;
  
  constructor() {
    if (Platform.OS === 'web') {
      throw new Error('ExpoFileSystemService should not be used on web');
    }
    // Create a dedicated directory for our app's images
    this.imagesDirectory = `${FileSystem.documentDirectory}xolas_images/`;
    this.ensureDirectoryExists();
  }
  
  /**
   * Ensure the images directory exists
   */
  private async ensureDirectoryExists(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    const dirInfo = await FileSystem.getInfoAsync(this.imagesDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.imagesDirectory, { 
        intermediates: true 
      });
    }
  }
  
  /**
   * Save an image from a URI to local storage
   */
  async saveImage(uri: string, title?: string): Promise<{ id: string; uri: string }> {
    try {
      await this.ensureDirectoryExists();
      
      // Generate a unique ID and filename
      const id = generateId();
      const fileExtension = uri.split('.').pop() || 'jpg';
      const fileName = `${id}.${fileExtension}`;
      const destinationUri = `${this.imagesDirectory}${fileName}`;
      
      // Copy the image to our app's directory
      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri,
      });
      
      return { id, uri: destinationUri };
    } catch (error) {
      console.error('Failed to save image:', error);
      throw new Error('Failed to save image');
    }
  }
  
  /**
   * Delete an image from local storage
   */
  async deleteImage(uri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Failed to delete image at ${uri}:`, error);
      return false;
    }
  }
  
  /**
   * Get photo data for sync operations
   */
  async getPhotoData(photoId: string): Promise<{ issueId: string; uri: string; title?: string } | null> {
    try {
      // Get all issues to find the photo
      const issues = await issueStorage.getAllIssues();
      
      for (const issue of issues) {
        const photo = issue.photos.find(p => p.id === photoId);
        if (photo) {
          return {
            issueId: issue.id,
            uri: photo.uri,
            title: photo.title
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to get photo data for ID ${photoId}:`, error);
      return null;
    }
  }
}

// Export singleton instances for app-wide use
export const issueStorage = new AsyncStorageIssueService();
export const fileStorage = Platform.OS === 'web' 
  ? new WebFileStorageService() 
  : new ExpoFileSystemService();
