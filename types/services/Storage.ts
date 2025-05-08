/**
 * Service interface abstractions for persistent data operations
 * Establishes a contractual interface to enable dependency inversion
 * and facilitate future technology migration or enhancement
 */

import { IssueReport, IssueReportInput } from "../models/Issue";

/**
 * Data persistence interface for issue report metadata
 * Abstracts the implementation details of the storage mechanism
 */
export interface IssueStorageService {
  /**
   * Retrieves all stored issue reports
   * @returns Promise resolving to an array of issue reports
   */
  getAllIssues(): Promise<IssueReport[]>;
  
  /**
   * Retrieves a specific issue report by ID
   * @param id Unique identifier of the issue to retrieve
   * @returns Promise resolving to the issue report or null if not found
   */
  getIssueById(id: string): Promise<IssueReport | null>;
  
  /**
   * Persists a new issue report
   * @param issue Issue report data to store
   * @returns Promise resolving to the created issue with generated ID
   */
  createIssue(issue: IssueReportInput): Promise<IssueReport>;
  
  /**
   * Updates an existing issue report
   * @param issue Issue report with updated data
   * @returns Promise resolving to the updated issue
   */
  updateIssue(issue: IssueReport): Promise<IssueReport>;
  
  /**
   * Removes an issue report by ID
   * @param id Unique identifier of the issue to remove
   * @returns Promise resolving to boolean indicating operation success
   */
  deleteIssue(id: string): Promise<boolean>;
}

/**
 * File system interface for managing photo assets
 * Abstracts operations related to image file handling
 */
export interface FileStorageService {
  /**
   * Persists an image file to local storage
   * @param uri Source URI of the image to store
   * @param title Optional descriptive title for the image
   * @returns Promise resolving to the storage details of the saved file
   */
  saveImage(uri: string, title?: string): Promise<{ id: string; uri: string }>;
  
  /**
   * Removes an image file from storage
   * @param uri Local URI of the image to delete
   * @returns Promise resolving to boolean indicating operation success
   */
  deleteImage(uri: string): Promise<boolean>;
}
