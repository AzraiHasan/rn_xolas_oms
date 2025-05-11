/**
 * Core domain model representing a field issue report
 * Establishes the contract for all issue-related operations in the application
 */

export enum IssueSeverity {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

export enum IssueStatus {
  New = "New",
  Assigned = "Assigned",
  InProgress = "In Progress",
  Resolved = "Resolved"
}

export interface Photo {
  /** Unique identifier for the photo asset */
  id: string;
  /** Local URI pointing to the stored image file */
  uri: string;
  /** Timestamp recording when the photo was captured */
  timestamp: string;
  /** Optional human-readable title/description for the photo */
  title?: string;
}

export interface IssueUpdate {
  /** Timestamp when the update was made */
  timestamp: string;
  /** Description of the update */
  description: string;
  /** Photos added with this update */
  photos: Photo[];
  /** Previous status before update */
  previousStatus?: IssueStatus;
  /** Updated status */
  newStatus: IssueStatus;
  /** Technician who made the update (future enhancement) */
  technician?: string;
}

export interface IssueReport {
  /** Unique identifier for the issue report */
  id: string;
  /** Concise title describing the issue */
  title: string;
  /** Detailed description of the issue */
  description: string;
  /** Technician-reported location of the issue */
  location: string;
  /** Timestamp when the issue was reported */
  timestamp: string;
  /** Issue criticality classification */
  severity: IssueSeverity;
  /** Current status of the issue */
  status: IssueStatus;
  /** Collection of photos documenting the issue */
  photos: Photo[];
  /** History of updates to this issue */
  updates?: IssueUpdate[];
}

/**
 * Type representing an issue report being created that doesn't yet have an ID
 * Facilitates streamlined creation workflow while maintaining type safety
 */
export type IssueReportInput = Omit<IssueReport, "id">;
