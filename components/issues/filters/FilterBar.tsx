import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

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
    <ThemedView className="mb-3">
      <ThemedView className="flex-row items-center gap-2">
        {/* Search Button */}
        <TouchableOpacity
          className="w-9 h-9 rounded-full items-center justify-center md:w-10 md:h-10"
          style={{ backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' }}
          onPress={onSearchPress}
        >
          <IconSymbol name="magnifyingglass" size={20} color={colors.text} />
        </TouchableOpacity>
        
        {/* Severity Filter Pills */}
        <ThemedView className="flex-1 flex-row items-center gap-2 flex-wrap">
          <TouchableOpacity
            className={`flex-row items-center px-2.5 py-1.5 rounded-full ${isSeveritySelected('all') ? 'border border-[#E4E7EB]' : ''}`}
            style={{ 
              backgroundColor: isSeveritySelected('all') ? 
                colors.tint + '20' : 
                colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' 
            }}
            onPress={() => toggleSeverity('all')}
          >
            <ThemedText 
              className="text-xs md:text-sm" 
              style={isSeveritySelected('all') ? { color: colors.tint } : undefined}
            >
              All
            </ThemedText>
          </TouchableOpacity>
          
          {Object.values(IssueSeverity).map((severity) => (
            <TouchableOpacity
              key={severity}
              className={`flex-row items-center px-2.5 py-1.5 rounded-full ${isSeveritySelected(severity) ? 'border border-[#E4E7EB]' : ''}`}
              style={{
                backgroundColor: isSeveritySelected(severity) 
                  ? `${getSeverityColor(severity)}20` 
                  : colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
              }}
              onPress={() => toggleSeverity(severity)}
            >
              <IconSymbol 
                name={getSeverityIconName(severity)} 
                size={14} 
                color={getSeverityColor(severity)} 
                style={{ marginRight: 4 }} 
              />
              <ThemedText 
                className="text-xs md:text-sm"
                style={isSeveritySelected(severity) ? { color: getSeverityColor(severity) } : undefined}
              >
                {severity}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
        
        {/* Filter Toggle Button */}
        <TouchableOpacity
          className="w-9 h-9 rounded-full items-center justify-center md:w-10 md:h-10"
          style={{ backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' }}
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
        <ThemedView className="mt-3 pt-3 border-t border-[#E4E7EB] dark:border-gray-700">
          <ThemedView className="flex-row items-center mb-3">
            <ThemedText className="text-sm mr-2">Sort by:</ThemedText>
            
            <TouchableOpacity
              className={`px-3 py-1.5 rounded ${isSortSelected('date') ? 'bg-[#0086C930]' : ''} mr-2`}
              onPress={() => setSortBy('date')}
            >
              <ThemedText className={isSortSelected('date') ? 'text-[#0086C9] font-medium' : ''}>
                Date
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`px-3 py-1.5 rounded ${isSortSelected('severity') ? 'bg-[#0086C930]' : ''} mr-2`}
              onPress={() => setSortBy('severity')}
            >
              <ThemedText className={isSortSelected('severity') ? 'text-[#0086C9] font-medium' : ''}>
                Severity
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center"
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
            className="self-start"
            onPress={clearFilters}
          >
            <ThemedText className="text-[#0086C9] text-sm">Clear Filters</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}


