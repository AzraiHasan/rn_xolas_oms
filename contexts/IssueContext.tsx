import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { IssueReport } from '@/types/models/Issue';
import { issueStorage } from '@/services/StorageService';

type IssueContextType = {
  issues: IssueReport[];
  loading: boolean;
  error: string | null;
  refreshIssues: () => Promise<void>;
  getIssueById: (id: string) => IssueReport | undefined;
  deleteIssue: (id: string) => Promise<boolean>;
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

  // Refresh issues from storage
  const refreshIssues = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await issueStorage.getAllIssues();
      setIssues(data);
    } catch (err) {
      console.error('Failed to load issues:', err);
      setError('Failed to load issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get a specific issue by ID
  const getIssueById = (id: string): IssueReport | undefined => {
    return issues.find(issue => issue.id === id);
  };

  // Delete an issue
  const deleteIssue = async (id: string): Promise<boolean> => {
    try {
      const success = await issueStorage.deleteIssue(id);
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

  const value = {
    issues,
    loading,
    error,
    refreshIssues,
    getIssueById,
    deleteIssue,
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
