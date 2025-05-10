import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, View, Pressable } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IssueCard } from '@/components/issues/IssueCard';
import { Header, PageLayout } from '@/components/layouts';
import { useIssues } from '@/contexts/IssueContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { IssueSeverity, IssueStatus, IssueReport } from '@/types/models/Issue';
import { useColorScheme } from '@/hooks/useColorScheme';



// Filter type definitions
type FilterState = {
  severity: IssueSeverity | null;
  status: IssueStatus | null;
};

export default function IssuesScreen() {
  const { issues, loading, error, refreshIssues } = useIssues();
  const colorScheme = useColorScheme();
  const searchParams = useLocalSearchParams();
  
  // Parse filter params from URL if present
  const initialFilterType = searchParams.filterType as 'severity' | 'status' | undefined;
  const initialFilterValue = searchParams.filterValue as string | undefined;
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    severity: null,
    status: null,
  });
  
  // Apply initial filters from URL parameters
  useEffect(() => {
    if (initialFilterType && initialFilterValue) {
      // Reset all filters first
      const resetFilters = {
        severity: null,
        status: null,
      };
      
      // Apply only the specific filter that was requested
      if (initialFilterType === 'severity' && 
          Object.values(IssueSeverity).includes(initialFilterValue as IssueSeverity)) {
        setFilters({
          ...resetFilters,
          severity: initialFilterValue as IssueSeverity
        });
        setShowFilters(true); // Automatically show filters when navigating with a filter
      } else if (initialFilterType === 'status' && 
                Object.values(IssueStatus).includes(initialFilterValue as IssueStatus)) {
        setFilters({
          ...resetFilters,
          status: initialFilterValue as IssueStatus
        });
        setShowFilters(true); // Automatically show filters when navigating with a filter
      }
    }
  }, [initialFilterType, initialFilterValue, searchParams._t]); // Include timestamp to force re-evaluation
  
  // Filter visibility state
  const [showFilters, setShowFilters] = useState(false);
  
  // Toggle filter visibility
  const toggleFilters = () => setShowFilters(!showFilters);
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      severity: null,
      status: null,
    });
  };
  
  // Handle severity filter selection
  const handleSeverityFilter = (severity: IssueSeverity | null) => {
    setFilters(prev => ({
      ...prev,
      severity: prev.severity === severity ? null : severity,
    }));
  };
  
  // Handle status filter selection
  const handleStatusFilter = (status: IssueStatus | null) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? null : status,
    }));
  };
  
  // Apply filters to issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      // Apply severity filter if set
      if (filters.severity && issue.severity !== filters.severity) {
        return false;
      }
      
      // Apply status filter if set
      if (filters.status && issue.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  }, [issues, filters]);
  
  // Get severity color
  const getSeverityColor = (severity: IssueSeverity): string => {
    switch (severity) {
      case IssueSeverity.High:
        return '#E11D48';
      case IssueSeverity.Medium:
        return '#F59E0B';
      case IssueSeverity.Low:
        return '#10B981';
      default:
        return '#6B7280';
    }
  };
  
  // Get status color
  const getStatusColor = (status: IssueStatus): string => {
    switch (status) {
      case IssueStatus.New:
        return '#3B82F6';
      case IssueStatus.Assigned:
        return '#8B5CF6';
      case IssueStatus.InProgress:
        return '#F97316';
      case IssueStatus.Resolved:
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderItem = ({ item }: { item: IssueReport }) => {
    return <IssueCard issue={item} />;
  };

  const renderEmptyComponent = () => (
    <ThemedView className="p-6 items-center justify-center h-[300px]">
      <ThemedText type="title" className="mb-2 text-center">No Issues Found</ThemedText>
      <ThemedText className="text-center opacity-70">
        {filters.severity || filters.status 
          ? "No issues match the selected filters. Try changing or resetting the filters."
          : "There are no issues currently assigned to you. Create a new issue or check back later."}
      </ThemedText>
      
      {(filters.severity || filters.status) && (
        <Pressable
          className="mt-4 py-2 px-4 rounded-lg flex-row items-center"
          style={{
            backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
          }}
          onPress={resetFilters}
        >
          <IconSymbol 
            name="arrow.counterclockwise" 
            size={16} 
            color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} 
          />
          <ThemedText className="ml-2">Reset Filters</ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );

  return (
    <PageLayout
      header={<Header title="Issues" />}
    >
      <Stack.Screen options={{ 
        headerShown: false,
      }} />
      
      {/* Filter bar */}
      <ThemedView className="px-4 py-2 flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <ThemedView className="flex-row items-center">
          <ThemedText className="font-medium">{filteredIssues.length} Issues</ThemedText>
          {(filters.severity || filters.status) && (
            <ThemedView className="ml-2 px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
              <ThemedText className="text-xs">Filtered</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
        
        <Pressable
          className="flex-row items-center"
          onPress={toggleFilters}
        >
          <IconSymbol 
            name="line.3.horizontal.decrease.circle" 
            size={20} 
            color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} 
          />
          <ThemedText className="ml-1">{showFilters ? 'Hide Filters' : 'Show Filters'}</ThemedText>
        </Pressable>
      </ThemedView>
      
      {/* Filter options */}
      {showFilters && (
        <ThemedView className="p-4 border-b border-gray-200 dark:border-gray-800">
          <ThemedView className="mb-4">
            <ThemedText className="mb-2 font-bold">Severity</ThemedText>
            <ThemedView className="flex-row flex-wrap gap-2">
              {Object.values(IssueSeverity).map((severity) => (
                <Pressable
                  key={severity}
                  className="px-3 py-1 rounded-full flex-row items-center"
                  style={{
                    backgroundColor: filters.severity === severity 
                      ? getSeverityColor(severity) 
                      : colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                  }}
                  onPress={() => handleSeverityFilter(severity)}
                >
                  <ThemedText 
                    style={{
                      color: filters.severity === severity 
                        ? '#FFFFFF' 
                        : colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                      fontWeight: filters.severity === severity ? 'bold' : 'normal',
                    }}
                  >
                    {severity}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </ThemedView>
          
          <ThemedView className="mb-2">
            <ThemedText className="mb-2 font-bold">Status</ThemedText>
            <ThemedView className="flex-row flex-wrap gap-2">
              {Object.values(IssueStatus).map((status) => (
                <Pressable
                  key={status}
                  className="px-3 py-1 rounded-full flex-row items-center"
                  style={{
                    backgroundColor: filters.status === status 
                      ? getStatusColor(status) 
                      : colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                  }}
                  onPress={() => handleStatusFilter(status)}
                >
                  <ThemedText 
                    style={{
                      color: filters.status === status 
                        ? '#FFFFFF' 
                        : colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                      fontWeight: filters.status === status ? 'bold' : 'normal',
                    }}
                  >
                    {status}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </ThemedView>
          
          {(filters.severity || filters.status) && (
            <Pressable
              className="mt-2 py-2 px-4 self-start rounded-lg flex-row items-center"
              style={{
                backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              }}
              onPress={resetFilters}
            >
              <IconSymbol 
                name="arrow.counterclockwise" 
                size={16} 
                color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} 
              />
              <ThemedText className="ml-2">Reset Filters</ThemedText>
            </Pressable>
          )}
        </ThemedView>
      )}
      
      {loading ? (
        <ThemedView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <ThemedText className="mt-4">Loading issues...</ThemedText>
        </ThemedView>
      ) : error ? (
        <ThemedView className="p-6 items-center justify-center h-[300px]">
          <ThemedText type="title" className="mb-2 text-center">Error Loading Issues</ThemedText>
          <ThemedText className="text-center opacity-70">{error}</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={filteredIssues}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshIssues} />
          }
        />
      )}
    </PageLayout>
  );
}


