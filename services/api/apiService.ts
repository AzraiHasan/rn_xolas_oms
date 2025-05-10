import { IssueReport } from '@/types/models/Issue';
import { compactJSON, preparePhotoForUpload } from '@/utils/compressionUtils';

// API configuration
const API_CONFIG = {
  baseUrl: 'https://api.xolas.com/v1', // Replace with your actual API endpoint
  timeout: 15000, // 15 seconds
  retryCount: 3,
};

/**
 * API Service for handling network requests
 */
export class ApiService {
  /**
   * Make a network request with automatic retry logic
   */
  private static async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retries = API_CONFIG.retryCount,
    backoff = 300 // Start with 300ms backoff
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {}),
        },
      });

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      // Parse JSON response if available
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      // If we have retries left, retry with exponential backoff
      if (retries > 0) {
        // Apply jitter to backoff to prevent all clients retrying simultaneously
        const jitter = Math.random() * 0.3 + 0.85; // 0.85-1.15
        const nextBackoff = Math.min(backoff * 2 * jitter, 30000); // Cap at 30 seconds
        
        console.log(`Retrying API call in ${backoff}ms, ${retries} retries left`);
        
        // Wait for the backoff period
        await new Promise(resolve => setTimeout(resolve, backoff));
        
        // Retry the request with increased backoff
        return ApiService.fetchWithRetry<T>(url, options, retries - 1, nextBackoff);
      }

      // No retries left, throw the error
      throw error;
    }
  }

  /**
   * Get all issues from the API
   */
  static async getAllIssues(): Promise<IssueReport[]> {
    return ApiService.fetchWithRetry<IssueReport[]>(
      `${API_CONFIG.baseUrl}/issues`,
      { method: 'GET' }
    );
  }

  /**
   * Get issue by ID from the API
   */
  static async getIssueById(id: string): Promise<IssueReport> {
    return ApiService.fetchWithRetry<IssueReport>(
      `${API_CONFIG.baseUrl}/issues/${id}`,
      { method: 'GET' }
    );
  }

  /**
   * Create a new issue on the API
   */
  static async createIssue(issue: Omit<IssueReport, 'id'>): Promise<IssueReport> {
    // Compact the data before sending
    const compactedData = compactJSON(issue);
    
    return ApiService.fetchWithRetry<IssueReport>(
      `${API_CONFIG.baseUrl}/issues`,
      {
        method: 'POST',
        body: JSON.stringify(compactedData),
      }
    );
  }

  /**
   * Update an existing issue on the API
   */
  static async updateIssue(issue: IssueReport): Promise<IssueReport> {
    // Compact the data before sending
    const compactedData = compactJSON(issue);
    
    return ApiService.fetchWithRetry<IssueReport>(
      `${API_CONFIG.baseUrl}/issues/${issue.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(compactedData),
      }
    );
  }

  /**
   * Delete an issue from the API
   */
  static async deleteIssue(id: string): Promise<void> {
    return ApiService.fetchWithRetry<void>(
      `${API_CONFIG.baseUrl}/issues/${id}`,
      { method: 'DELETE' }
    );
  }

  /**
   * Upload a photo to the API
   */
  static async uploadPhoto(
    issueId: string,
    photoUri: string,
    title: string
  ): Promise<{ id: string; uri: string }> {
    // Compress the photo before uploading
    const compressedPhotoData = await preparePhotoForUpload({
      id: 'temp',
      uri: photoUri,
      title,
      timestamp: new Date().toISOString(),
      issueId,
      synced: false
    });
    
    // Create a FormData object for the photo upload
    const formData = new FormData();
    
    // Add the photo file as blob
    const filenameParts = compressedPhotoData.uri.split('/');
    const filename = filenameParts[filenameParts.length - 1];
    
    // @ts-ignore - React Native's FormData type definitions are incomplete
    formData.append('photo', {
      uri: compressedPhotoData.uri,
      name: filename,
      type: 'image/jpeg', // Assuming JPEG, adjust as needed
    });
    
    // Add metadata
    formData.append('issueId', issueId);
    formData.append('title', title);
    
    // Make the request
    return ApiService.fetchWithRetry<{ id: string; uri: string }>(
      `${API_CONFIG.baseUrl}/photos`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      }
    );
  }

  /**
   * Delete a photo from the API
   */
  static async deletePhoto(photoId: string): Promise<void> {
    return ApiService.fetchWithRetry<void>(
      `${API_CONFIG.baseUrl}/photos/${photoId}`,
      { method: 'DELETE' }
    );
  }

  /**
   * Batch synchronize multiple changes
   * Improves efficiency by reducing number of network requests
   */
  static async batchSync(
    changes: Array<{
      entityType: 'issue' | 'photo';
      operation: 'create' | 'update' | 'delete';
      data: any;
    }>
  ): Promise<Record<string, any>> {
    return ApiService.fetchWithRetry<Record<string, any>>(
      `${API_CONFIG.baseUrl}/batch`,
      {
        method: 'POST',
        body: JSON.stringify({ changes }),
      }
    );
  }
}
