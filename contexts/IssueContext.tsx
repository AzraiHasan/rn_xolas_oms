import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { IssueReport, IssueReportInput } from '@/types/models/Issue';
import { IssueRepository } from '@/services/issues/IssueRepository';
import { Photo } from '@/types/models/Issue';

type IssueContextType = {
  issues: IssueReport[];
  loading: boolean;
  error: string | null;
  refreshIssues: () => Promise<void>;
  getIssueById: (id: string) => IssueReport | undefined;
  createIssue: (issueInput: IssueReportInput) => Promise<IssueReport>;
  updateIssue: (updatedIssue: IssueReport) => Promise<IssueReport>;
  deleteIssue: (id: string) => Promise<boolean>;
  addPhotoToIssue: (issueId: string, photo: Photo) => Promise<IssueReport | null>;
  removePhotoFromIssue: (issueId: string, photoId: string) => Promise<IssueReport | null>;
};

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load issues on mount
  useEffect(() => {
    refreshIssues();
  }, []);

  // Refresh issues from repository
  const refreshIssues = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await IssueRepository.getAllIssues();
      setIssues(data);
    } catch (err) {
      console.error('Failed to load issues:', err);
      setError('Failed to load issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get a specific issue by ID from local state
  const getIssueById = (id: string): IssueReport | undefined => {
    return issues.find(issue => issue.id === id);
  };

  // Create a new issue
  const createIssue = async (issueInput: IssueReportInput): Promise<IssueReport> => {
    try {
      const newIssue = await IssueRepository.createIssue(issueInput);
      
      // Update local state
      setIssues(currentIssues => [...currentIssues, newIssue]);
      
      return newIssue;
    } catch (err) {
      console.error('Failed to create issue:', err);
      throw new Error('Failed to create issue');
    }
  };

  // Update an existing issue
  const updateIssue = async (updatedIssue: IssueReport): Promise<IssueReport> => {
    try {
      const result = await IssueRepository.updateIssue(updatedIssue);
      
      // Update local state
      setIssues(currentIssues => 
        currentIssues.map(issue => 
          issue.id === updatedIssue.id ? updatedIssue : issue
        )
      );
      
      return result;
    } catch (err) {
      console.error('Failed to update issue:', err);
      throw new Error('Failed to update issue');
    }
  };

  // Delete an issue
  const deleteIssue = async (id: string): Promise<boolean> => {
    try {
      const success = await IssueRepository.deleteIssue(id);
      
      if (success) {
        // Update local state if deletion was successful
        setIssues(currentIssues => currentIssues.filter(issue => issue.id !== id));
      }
      
      return success;
    } catch (err) {
      console.error('Failed to delete issue:', err);
      return false;
    }
  };

  // Add a photo to an issue
  const addPhotoToIssue = async (issueId: string, photo: Photo): Promise<IssueReport | null> => {
    try {
      const updatedIssue = await IssueRepository.addPhotoToIssue(issueId, photo);
      
      // Update local state
      setIssues(currentIssues => 
        currentIssues.map(issue => 
          issue.id === issueId ? updatedIssue : issue
        )
      );
      
      return updatedIssue;
    } catch (err) {
      console.error('Failed to add photo to issue:', err);
      return null;
    }
  };

  // Remove a photo from an issue
  const removePhotoFromIssue = async (issueId: string, photoId: string): Promise<IssueReport | null> => {
    try {
      const updatedIssue = await IssueRepository.removePhotoFromIssue(issueId, photoId);
      
      // Update local state
      setIssues(currentIssues => 
        currentIssues.map(issue => 
          issue.id === issueId ? updatedIssue : issue
        )
      );
      
      return updatedIssue;
    } catch (err) {
      console.error('Failed to remove photo from issue:', err);
      return null;
    }
  };

  const value = {
    issues,
    loading,
    error,
    refreshIssues,
    getIssueById,
    createIssue,
    updateIssue,
    deleteIssue,
    addPhotoToIssue,
    removePhotoFromIssue,
  };

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
};

// Custom hook to use the issue context
export const useIssues = (): IssueContextType => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};
