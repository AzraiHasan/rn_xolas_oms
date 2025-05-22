import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueCategory } from '@/types/models/Issue';
import { useIssues } from '@/contexts/IssueContext';
import { colors } from '@/constants/theme';

interface IssueBarChartProps {
  data?: any; // For future compatibility
  total?: number; // For future compatibility
}

/**
 * Component for visualizing issue statistics as a horizontal bar chart
 */
export function IssueBarChart({ data, total }: IssueBarChartProps) {
  const colorScheme = useColorScheme();
  const { issues } = useIssues();
  
  // Calculate category statistics from actual issues
  const categoryStats = React.useMemo(() => {
    if (!issues || issues.length === 0) {
      return {
        [IssueCategory.Docket]: 0,
        [IssueCategory.Vandalism]: 0,
        [IssueCategory.Corrective]: 0,
        [IssueCategory.Preventive]: 0,
        [IssueCategory.Audit]: 0,
        total: 0
      };
    }
    
    const stats = {
      [IssueCategory.Docket]: issues.filter(i => i.category === IssueCategory.Docket).length,
      [IssueCategory.Vandalism]: issues.filter(i => i.category === IssueCategory.Vandalism).length,
      [IssueCategory.Corrective]: issues.filter(i => i.category === IssueCategory.Corrective).length,
      [IssueCategory.Preventive]: issues.filter(i => i.category === IssueCategory.Preventive).length,
      [IssueCategory.Audit]: issues.filter(i => i.category === IssueCategory.Audit).length,
      total: issues.length
    };
    
    return stats;
  }, [issues]);
  
  // Calculate percentage and width for each category
  const getBarData = (category: IssueCategory) => {
    const count = categoryStats[category];
    const percentage = categoryStats.total > 0 ? Math.round((count / categoryStats.total) * 100) : 0;
    const width = percentage;
    return { count, percentage, width };
  };
  
  // Style values
  const barHeight = 28;
  const chartBackground = colorScheme === 'dark' ? '#1F2937' : '#F9FAFB';
  const barBackgroundColor = colorScheme === 'dark' ? '#374151' : '#E5E7EB';
  
  // Category colors
  const categoryColors = {
    [IssueCategory.Docket]: '#3B82F6',
    [IssueCategory.Vandalism]: '#EF4444',
    [IssueCategory.Corrective]: '#F59E0B',
    [IssueCategory.Preventive]: '#10B981',
    [IssueCategory.Audit]: '#8B5CF6',
  };

  const renderBar = (category: IssueCategory, label: string) => {
    const { count, percentage, width } = getBarData(category);
    const color = colorScheme === 'dark' ? colors.dark[900] : colors.neutral[900];
    
    return (
      <ThemedView className="mb-4" key={category}>
        <ThemedView className="flex-row justify-between mb-2">
          <ThemedText className="text-sm md:text-base font-bold">{label}</ThemedText>
          <ThemedText className="text-sm md:text-base">
            {count} ({percentage}%)
          </ThemedText>
        </ThemedView>
        <ThemedView 
          className="rounded-full overflow-hidden"
          style={{ height: barHeight, backgroundColor: barBackgroundColor }}
        >
          {width > 0 && (
            <ThemedView 
              className="rounded-full h-full"
              style={{ 
                width: `${width}%`, 
                backgroundColor: color 
              }}
            />
          )}
        </ThemedView>
      </ThemedView>
    );
  };
  
  return (
    <ThemedView 
      className="rounded-xl mb-6 w-full"
    >
      <ThemedView 
        className="rounded-xl overflow-hidden mb-4 w-full"
        style={{ backgroundColor: chartBackground }}
      >
        {renderBar(IssueCategory.Docket, 'Docket')}
        {renderBar(IssueCategory.Vandalism, 'Vandalism')}
        {renderBar(IssueCategory.Corrective, 'Corrective')}
        {renderBar(IssueCategory.Preventive, 'Preventive')}
        {renderBar(IssueCategory.Audit, 'Audit')}
      </ThemedView>
    </ThemedView>
  );
}
