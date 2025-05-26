import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';

import { FormField, TextAreaField, SeveritySelector, SiteSearchField } from '@/components/forms';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Site } from '@/types/models/Site';
import { IssueCategory, IssueSeverity, IssueStatus, IssueReportInput } from '@/types/models/Issue';

export interface IssueFormProps {
  onSubmit: (issue: IssueReportInput) => void;
  loading?: boolean;
}

export const IssueForm: React.FC<IssueFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: IssueCategory.Corrective,
    severity: IssueSeverity.Medium,
  });
  
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!selectedSite) {
      newErrors.site = 'Site selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }

    const issueData: IssueReportInput = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      severity: formData.severity,
      siteId: selectedSite!.siteId,
      timestamp: new Date().toISOString(),
      status: IssueStatus.New,
      photos: []
    };

    onSubmit(issueData);
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      <ThemedView className="space-y-6">
        
        {/* Site Selection */}
        <View>
          <ThemedText className="text-base font-medium mb-2">Site *</ThemedText>
          <SiteSearchField
            selectedSite={selectedSite}
            onSiteSelect={setSelectedSite}
            placeholder="Search for a site..."
            required
            error={errors.site}
            isError={!!errors.site}
            activeOnly={true}
          />
        </View>

        {/* Title */}
        <View>
          <ThemedText className="text-base font-medium mb-2">Issue Title *</ThemedText>
          <FormField
            name="title"
            value={formData.title}
            onChangeValue={handleFieldChange}
            placeholder="Brief description of the issue"
            required
            error={errors.title}
            isError={!!errors.title}
          />
        </View>

        {/* Category */}
        <View>
          <ThemedText className="text-base font-medium mb-2">Category</ThemedText>
          <View className="flex-row flex-wrap gap-2">
            {Object.values(IssueCategory).map((category) => (
              <Button
                key={category}
                variant={formData.category === category ? "default" : "outline"}
                size="sm"
                onPress={() => handleFieldChange('category', category)}
              >
                {category}
              </Button>
            ))}
          </View>
        </View>

        {/* Severity */}
        <View>
          <ThemedText className="text-base font-medium mb-2">Severity</ThemedText>
          <SeveritySelector
            value={formData.severity}
            onValueChange={(severity) => handleFieldChange('severity', severity)}
          />
        </View>

        {/* Description */}
        <View>
          <ThemedText className="text-base font-medium mb-2">Description *</ThemedText>
          <TextAreaField
            name="description"
            value={formData.description}
            onChangeValue={handleFieldChange}
            placeholder="Detailed description of the issue..."
            required
            error={errors.description}
            isError={!!errors.description}
            numberOfLines={4}
          />
        </View>

        {/* Selected Site Info */}
        {selectedSite && (
          <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <ThemedText className="font-medium mb-1">Selected Site</ThemedText>
            <ThemedText className="text-sm opacity-70">
              {selectedSite.siteName}
            </ThemedText>
            <ThemedText className="text-xs opacity-50">
              {selectedSite.siteId} • {selectedSite.status}
            </ThemedText>
          </View>
        )}

        {/* Submit Button */}
        <Button
          onPress={handleSubmit}
          disabled={loading}
          className="mt-6"
        >
          {loading ? 'Creating Issue...' : 'Create Issue'}
        </Button>
      </ThemedView>
    </ScrollView>
  );
};