import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueSeverity } from '@/types/models/Issue';

interface IssueBarChartProps {
  data: Record<IssueSeverity, number>;
  total: number;
}

/**
 * Component for visualizing issue statistics as a horizontal bar chart
 */
export function IssueBarChart({ data, total }: IssueBarChartProps) {
  const colorScheme = useColorScheme();
  
  // Calculate percentages for each severity
  const getPercentage = (count: number): number => {
    if (total === 0) return 0;
    return (count / total) * 100;
  };
  
  const highPercentage = getPercentage(data[IssueSeverity.High]);
  const mediumPercentage = getPercentage(data[IssueSeverity.Medium]);
  const lowPercentage = getPercentage(data[IssueSeverity.Low]);
  
  return (
    <ThemedView className="rounded-xl p-4 mb-6 border border-[#E4E7EB] dark:border-gray-700 md:p-5 lg:p-6">
      <ThemedText type="defaultSemiBold" className="mb-4 md:text-lg">
        Issue Breakdown
      </ThemedText>
      
      <ThemedView className="gap-4 md:gap-5">
        <ThemedView className="h-6 md:h-8 flex-row rounded overflow-hidden bg-slate-100 dark:bg-gray-800">
          <ThemedView 
            className={`h-full bg-[#E11D48] ${highPercentage > 0 ? (mediumPercentage === 0 && lowPercentage === 0 ? 'rounded' : 'rounded-l') : ''}`}
            style={{ width: `${highPercentage}%` }}
          />
          
          <ThemedView 
            className={`h-full bg-[#F59E0B] ${mediumPercentage > 0 ? (lowPercentage === 0 ? 'rounded-r' : '') : ''}`}
            style={{ width: `${mediumPercentage}%` }}
          />
          
          <ThemedView 
            className={`h-full bg-[#10B981] ${lowPercentage > 0 ? 'rounded-r' : ''}`}
            style={{ width: `${lowPercentage}%` }}
          />
        </ThemedView>
        
        <ThemedView className="flex-row flex-wrap gap-4 md:gap-6">
          <ThemedView className="flex-row items-center md:min-w-24">
            <ThemedView className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#E11D48] mr-2" />
            <ThemedText className="text-xs md:text-sm">
              High: {data[IssueSeverity.High]} ({Math.round(highPercentage)}%)
            </ThemedText>
          </ThemedView>
          
          <ThemedView className="flex-row items-center md:min-w-24">
            <ThemedView className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#F59E0B] mr-2" />
            <ThemedText className="text-xs md:text-sm">
              Medium: {data[IssueSeverity.Medium]} ({Math.round(mediumPercentage)}%)
            </ThemedText>
          </ThemedView>
          
          <ThemedView className="flex-row items-center md:min-w-24">
            <ThemedView className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#10B981] mr-2" />
            <ThemedText className="text-xs md:text-sm">
              Low: {data[IssueSeverity.Low]} ({Math.round(lowPercentage)}%)
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
