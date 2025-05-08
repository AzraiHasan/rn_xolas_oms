import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { FilterBar, IssueCard, IssueFilters, SearchBar } from '@/components/issues';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueService } from '@/services/issues/issueService';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

/**
 * Screen for displaying and filtering issues
 */
export default function IssuesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  // State for issues data
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and searching
  const [filters, setFilters] = useState<IssueFilters>({
    severity: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch issues on component mount
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await IssueService.getAllIssues();
        setIssues(data);
      } catch (err) {
        setError('Failed to load issues');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssues();
  }, []);
  
  // Apply filters and search to issues
  const filteredIssues = useMemo(() => {
    let result = [...issues];
    
    // Apply severity filter
    if (filters.severity && filters.severity !== 'all') {
      result = result.filter(issue => issue.severity === filters.severity);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'date') {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (filters.sortBy === 'severity') {
        // Convert severity to a numeric value for sorting
        const severityMap = {
          [IssueSeverity.High]: 3,
          [IssueSeverity.Medium]: 2,
          [IssueSeverity.Low]: 1,
        };
        
        const severityA = severityMap[a.severity];
        const severityB = severityMap[b.severity];
        
        return filters.sortOrder === 'asc' ? severityA - severityB : severityB - severityA;
      }
      
      return 0;
    });
    
    return result;
  }, [issues, filters, searchQuery]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: IssueFilters) => {
    setFilters(newFilters);
  };
  
  // Toggle search mode
  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    if (searchMode) {
      setSearchQuery('');
    }
  };
  
  // Render list item
  const renderItem = ({ item }: { item: IssueReport }) => (
    <IssueCard issue={item} />
  );
  
  // Render empty state
  const renderEmptyState = () => {
    if (loading) {
      return (
        <ThemedView style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Loading issues...</ThemedText>
        </ThemedView>
      );
    }
    
    if (error) {
      return (
        <ThemedView style={styles.emptyContainer}>
          <IconSymbol size={48} name="exclamationmark.circle" color="#E11D48" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Button
            label="Retry"
            variant="primary"
            size="small"
            style={styles.emptyButton}
            onPress={() => {
              setLoading(true);
              IssueService.getAllIssues()
                .then(data => {
                  setIssues(data);
                  setError(null);
                })
                .catch(err => {
                  console.error(err);
                  setError('Failed to load issues');
                })
                .finally(() => setLoading(false));
            }}
          />
        </ThemedView>
      );
    }
    
    if (searchQuery.trim() || filters.severity !== 'all') {
      return (
        <ThemedView style={styles.emptyContainer}>
          <IconSymbol size={48} name="magnifyingglass" color={colors.icon} />
          <ThemedText style={styles.emptyText}>No issues match your search</ThemedText>
          <Button
            label="Clear Filters"
            variant="primary"
            size="small"
            style={styles.emptyButton}
            onPress={() => {
              setSearchQuery('');
              setFilters({
                severity: 'all',
                sortBy: 'date',
                sortOrder: 'desc',
              });
            }}
          />
        </ThemedView>
      );
    }
    
    return (
      <ThemedView style={styles.emptyContainer}>
        <IconSymbol size={48} name="exclamationmark.circle" color={colors.icon} />
        <ThemedText style={styles.emptyText}>No issues reported yet</ThemedText>
        <Button
          label="Report an Issue"
          variant="primary"
          size="small"
          style={styles.emptyButton}
        />
      </ThemedView>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <IconSymbol size={20} name="chevron.left" color={colors.text} />
          </TouchableOpacity>

          <ThemedText type="title">Issues</ThemedText>
        </ThemedView>
        
        {!searchMode && (
          <ThemedText style={styles.issueCount}>
            {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'}
          </ThemedText>
        )}
      </ThemedView>
      
      {searchMode ? (
        <ThemedView style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onCancel={toggleSearchMode}
            autoFocus
          />
        </ThemedView>
      ) : (
        <ThemedView style={styles.filtersContainer}>
          <FilterBar
            filters={filters}
            onFiltersChange={handleFilterChange}
            onSearchPress={toggleSearchMode}
          />
        </ThemedView>
      )}
      
      <FlatList
        data={filteredIssues}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  issueCount: {
    marginTop: 4,
    color: '#687076',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    minHeight: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 12,
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 12,
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
    color: '#E11D48',
  },
  emptyButton: {
    minWidth: 160,
  },
});
