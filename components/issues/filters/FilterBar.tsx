import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueSeverity } from '@/types/models/Issue';

export interface IssueFilters {
  severity?: IssueSeverity | 'all';
  sortBy?: 'date' | 'severity';
  sortOrder?: 'asc' | 'desc';
}

interface FilterBarProps {
  /**
   * Currently applied filters
   */
  filters: IssueFilters;
  
  /**
   * Called when filters are changed
   */
  onFiltersChange: (filters: IssueFilters) => void;
  
  /**
   * Called when search button is pressed
   */
  onSearchPress: () => void;
}

/**
 * Component for filtering and sorting issues
 */
export function FilterBar({ filters, onFiltersChange, onSearchPress }: FilterBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [expanded, setExpanded] = useState(false);
  
  /**
   * Toggle severity filter
   */
  const toggleSeverity = (severity: IssueSeverity | 'all') => {
    onFiltersChange({
      ...filters,
      severity: filters.severity === severity ? 'all' : severity,
    });
  };
  
  /**
   * Toggle sort order
   */
  const toggleSortOrder = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };
  
  /**
   * Set sort field
   */
  const setSortBy = (sortBy: 'date' | 'severity') => {
    onFiltersChange({
      ...filters,
      sortBy,
    });
  };
  
  /**
   * Clear all filters
   */
  const clearFilters = () => {
    onFiltersChange({
      severity: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };
  
  const isSeveritySelected = (severity: IssueSeverity | 'all') => 
    filters.severity === severity;
    
  const isSortSelected = (sortBy: 'date' | 'severity') => 
    filters.sortBy === sortBy;
  
  const getSeverityColor = (severity: IssueSeverity) => {
    switch (severity) {
      case IssueSeverity.High:
        return '#E11D48';
      case IssueSeverity.Medium:
        return '#F59E0B';
      case IssueSeverity.Low:
        return '#10B981';
      default:
        return colors.text;
    }
  };
  
  const getSeverityIconName = (severity: IssueSeverity) => {
    switch (severity) {
      case IssueSeverity.High:
        return 'exclamationmark.triangle.fill';
      case IssueSeverity.Medium:
        return 'exclamationmark.circle.fill';
      case IssueSeverity.Low:
        return 'info.circle.fill';
      default:
        return 'circle.fill';
    }
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.row}>
        {/* Search Button */}
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' }]}
          onPress={onSearchPress}
        >
          <IconSymbol name="magnifyingglass" size={20} color={colors.text} />
        </TouchableOpacity>
        
        {/* Severity Filter Pills */}
        <ThemedView style={styles.filterPills}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              isSeveritySelected('all') && styles.selectedPill,
              { backgroundColor: isSeveritySelected('all') ? colors.tint + '20' : colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' }
            ]}
            onPress={() => toggleSeverity('all')}
          >
            <ThemedText style={[
              styles.pillText,
              isSeveritySelected('all') && { color: colors.tint }
            ]}>
              All
            </ThemedText>
          </TouchableOpacity>
          
          {Object.values(IssueSeverity).map((severity) => (
            <TouchableOpacity
              key={severity}
              style={[
                styles.filterPill,
                isSeveritySelected(severity) && styles.selectedPill,
                {
                  backgroundColor: isSeveritySelected(severity) 
                    ? `${getSeverityColor(severity)}20` 
                    : colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                }
              ]}
              onPress={() => toggleSeverity(severity)}
            >
              <IconSymbol 
                name={getSeverityIconName(severity)} 
                size={14} 
                color={getSeverityColor(severity)} 
                style={styles.pillIcon} 
              />
              <ThemedText style={[
                styles.pillText,
                isSeveritySelected(severity) && { color: getSeverityColor(severity) }
              ]}>
                {severity}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
        
        {/* Filter Toggle Button */}
        <TouchableOpacity
          style={[
            styles.iconButton, 
            { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' }
          ]}
          onPress={() => setExpanded(!expanded)}
        >
          <IconSymbol 
            name={expanded ? "line.3.horizontal.decrease.circle.fill" : "line.3.horizontal.decrease.circle"} 
            size={20} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </ThemedView>
      
      {/* Expanded Filter Options */}
      {expanded && (
        <ThemedView style={styles.expandedSection}>
          <ThemedView style={styles.sortOptions}>
            <ThemedText style={styles.sectionLabel}>Sort by:</ThemedText>
            
            <TouchableOpacity
              style={[
                styles.sortButton,
                isSortSelected('date') && styles.selectedSortButton,
              ]}
              onPress={() => setSortBy('date')}
            >
              <ThemedText style={isSortSelected('date') ? styles.selectedSortText : undefined}>
                Date
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sortButton,
                isSortSelected('severity') && styles.selectedSortButton,
              ]}
              onPress={() => setSortBy('severity')}
            >
              <ThemedText style={isSortSelected('severity') ? styles.selectedSortText : undefined}>
                Severity
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.sortOrderButton}
              onPress={toggleSortOrder}
            >
              <IconSymbol 
                name={filters.sortOrder === 'asc' ? 'arrow.up' : 'arrow.down'} 
                size={16} 
                color={colors.text} 
              />
            </TouchableOpacity>
          </ThemedView>
          
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearFilters}
          >
            <ThemedText style={styles.clearButtonText}>Clear Filters</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterPills: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedPill: {
    borderWidth: 1,
    borderColor: '#E4E7EB',
  },
  pillIcon: {
    marginRight: 4,
  },
  pillText: {
    fontSize: 13,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E4E7EB',
  },
  sectionLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  sortOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedSortButton: {
    backgroundColor: '#0086C930',
  },
  selectedSortText: {
    color: '#0086C9',
    fontWeight: '500',
  },
  sortOrderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    color: '#0086C9',
    fontSize: 14,
  },
});
