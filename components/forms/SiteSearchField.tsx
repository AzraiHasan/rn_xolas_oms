import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { Input } from '@/components/ui/Input/Input';
import { Site } from '@/types/models/Site';
import { IssueService } from '@/services/issues/issueService';

export interface SiteSearchFieldProps {
  /**
   * Currently selected site
   */
  selectedSite?: Site | null;
  
  /**
   * Callback when site is selected
   */
  onSiteSelect: (site: Site | null) => void;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Whether the field is required
   */
  required?: boolean;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Whether the field has an error
   */
  isError?: boolean;
  
  /**
   * Search only active sites
   */
  activeOnly?: boolean;
  
  /**
   * Maximum number of search results
   */
  maxResults?: number;
}

export const SiteSearchField: React.FC<SiteSearchFieldProps> = ({
  selectedSite,
  onSiteSelect,
  placeholder = "Search for a site...",
  required = false,
  error,
  isError = false,
  activeOnly = true,
  maxResults = 8
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Site[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update search query when selected site changes
  useEffect(() => {
    if (selectedSite) {
      setSearchQuery(selectedSite.siteName);
      setShowResults(false);
      setJustSelected(true);
    } else {
      setSearchQuery('');
      setJustSelected(false);
    }
  }, [selectedSite]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if we just selected a site
    if (justSelected) {
      setJustSelected(false);
      return;
    }

    if (searchQuery.length >= 2) {
      setIsSearching(true);
      
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = activeOnly 
            ? await IssueService.searchActiveSites(searchQuery, maxResults)
            : await IssueService.searchSites(searchQuery, maxResults);
          
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('Site search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, activeOnly, maxResults, justSelected]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    // Clear selection if user modifies the text
    if (selectedSite && text !== selectedSite.siteName) {
      onSiteSelect(null);
    }
  };

  const handleSiteSelect = (site: Site) => {
    onSiteSelect(site);
    setShowResults(false);
    setSearchResults([]);
  };

  const handleClearSelection = () => {
    onSiteSelect(null);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <View className="relative z-10">
      <Input
        value={searchQuery}
        onChangeText={handleSearchChange}
        placeholder={placeholder}
        required={required}
        error={error}
        isError={isError}
      />
      
      {showResults && searchResults.length > 0 && (
        <View 
          className="absolute top-full left-0 right-0 border border-gray-200 rounded-lg shadow-lg z-50"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {searchResults.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={item.siteId}
              onPress={() => handleSiteSelect(item)}
              className="flex-row items-center px-4 py-3 border-b border-gray-100 last:border-b-0"
            >
              <Text className="text-gray-500 mr-2 text-xs">📍</Text>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium" numberOfLines={1}>
                  {item.siteName}
                </Text>
                <Text className="text-gray-500 text-sm" numberOfLines={1}>
                  {item.siteId} • {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 2 && (
        <View 
          className="absolute top-full left-0 right-0 border border-gray-200 rounded-lg shadow-lg z-50"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <View className="px-4 py-3">
            <Text className="text-gray-500 text-center">
              No sites found for "{searchQuery}"
            </Text>
          </View>
        </View>
      )}
      
      {isSearching && (
        <View 
          className="absolute top-full left-0 right-0 border border-gray-200 rounded-lg shadow-lg z-50"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <View className="px-4 py-3">
            <Text className="text-gray-500 text-center">Searching...</Text>
          </View>
        </View>
      )}
    </View>
  );
};