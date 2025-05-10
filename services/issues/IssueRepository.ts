/**
 * Issue Repository Service
 * 
 * This service acts as a central repository for managing issue data,
 * abstracting the underlying storage implementation details from the UI layer.
 * It handles synchronization between local storage and the application state.
 */

import { IssueReport, IssueReportInput, IssueSeverity, Photo } from '@/types/models/Issue';
import { issueStorage, fileStorage } from '@/services/StorageService';
import { CameraService } from '@/services/photos/CameraService';

/**
 * Repository service for managing issue reports
 */
export const IssueRepository = {
  /**
   * Get all issues from storage
   */
  getAllIssues: async (): Promise<IssueReport[]> => {
    try {
      return await issueStorage.getAllIssues();
    } catch (error) {
      console.error('Error in getAllIssues:', error);
      throw new Error('Failed to retrieve issues');
    }
  },

  /**
   * Get issue by ID
   */
  getIssueById: async (id: string): Promise<IssueReport | null> => {
    try {
      return await issueStorage.getIssueById(id);
    } catch (error) {
      console.error(`Error in getIssueById (${id}):`, error);
      throw new Error('Failed to retrieve issue details');
    }
  },

  /**
   * Create a new issue
   */
  createIssue: async (issueInput: IssueReportInput): Promise<IssueReport> => {
    try {
      return await issueStorage.createIssue(issueInput);
    } catch (error) {
      console.error('Error in createIssue:', error);
      throw new Error('Failed to create issue');
    }
  },

  /**
   * Update an existing issue
   */
  updateIssue: async (updatedIssue: IssueReport): Promise<IssueReport> => {
    try {
      return await issueStorage.updateIssue(updatedIssue);
    } catch (error) {
      console.error(`Error in updateIssue (${updatedIssue.id}):`, error);
      throw new Error('Failed to update issue');
    }
  },

  /**
   * Delete an issue and its associated photos
   */
  deleteIssue: async (id: string): Promise<boolean> => {
    try {
      // First, get the issue to delete its photos
      const issue = await issueStorage.getIssueById(id);
      
      if (issue && issue.photos && issue.photos.length > 0) {
        // Delete each photo file
        for (const photo of issue.photos) {
          await CameraService.deletePhoto(photo);
        }
      }
      
      // Delete the issue
      return await issueStorage.deleteIssue(id);
    } catch (error) {
      console.error(`Error in deleteIssue (${id}):`, error);
      throw new Error('Failed to delete issue');
    }
  },

  /**
   * Get issue statistics
   */
  getIssueStatistics: async (): Promise<{
    total: number;
    bySeverity: Record<IssueSeverity, number>;
    recentIssues: IssueReport[];
  }> => {
    try {
      const issues = await issueStorage.getAllIssues();
      
      // Calculate statistics
      const bySeverity = {
        [IssueSeverity.Low]: issues.filter(i => i.severity === IssueSeverity.Low).length,
        [IssueSeverity.Medium]: issues.filter(i => i.severity === IssueSeverity.Medium).length,
        [IssueSeverity.High]: issues.filter(i => i.severity === IssueSeverity.High).length,
      };
      
      // Get 5 most recent issues
      const recentIssues = [...issues]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);
      
      return {
        total: issues.length,
        bySeverity,
        recentIssues
      };
    } catch (error) {
      console.error('Error in getIssueStatistics:', error);
      throw new Error('Failed to calculate issue statistics');
    }
  },

  /**
   * Add a photo to an issue
   */
  addPhotoToIssue: async (issueId: string, photo: Photo): Promise<IssueReport> => {
    try {
      const issue = await issueStorage.getIssueById(issueId);
      
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }
      
      // Add photo to the issue
      const updatedIssue: IssueReport = {
        ...issue,
        photos: [...issue.photos, photo]
      };
      
      // Update the issue in storage
      return await issueStorage.updateIssue(updatedIssue);
    } catch (error) {
      console.error(`Error in addPhotoToIssue (${issueId}):`, error);
      throw new Error('Failed to add photo to issue');
    }
  },

  /**
   * Remove a photo from an issue
   */
  removePhotoFromIssue: async (issueId: string, photoId: string): Promise<IssueReport> => {
    try {
      const issue = await issueStorage.getIssueById(issueId);
      
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }
      
      // Find the photo to remove
      const photoToRemove = issue.photos.find(p => p.id === photoId);
      
      if (!photoToRemove) {
        throw new Error(`Photo with ID ${photoId} not found in issue ${issueId}`);
      }
      
      // Delete the photo file
      await CameraService.deletePhoto(photoToRemove);
      
      // Remove photo from the issue
      const updatedIssue: IssueReport = {
        ...issue,
        photos: issue.photos.filter(p => p.id !== photoId)
      };
      
      // Update the issue in storage
      return await issueStorage.updateIssue(updatedIssue);
    } catch (error) {
      console.error(`Error in removePhotoFromIssue (${issueId}, ${photoId}):`, error);
      throw new Error('Failed to remove photo from issue');
    }
  }
};

// Export the repository type for future use
export type IIssueRepository = typeof IssueRepository;
