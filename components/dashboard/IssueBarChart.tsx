import React from 'react';
import { Dimensions } from 'react-native';

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
  
  // Style values
  const barHeight = 28;
  const chartBackground = colorScheme === 'dark' ? '#1F2937' : '#F9FAFB';
  const barBackgroundColor = colorScheme === 'dark' ? '#374151' : '#E5E7EB';
  
  return (
    <ThemedView 
      className="rounded-xl p-4 mb-6 border-[1px] md:p-5 lg:p-6"
      style={{ borderColor: colorScheme === 'dark' ? '#FFFFFF' : '#444444' }}
    >
      <ThemedText type="defaultSemiBold" className="mb-4 md:text-lg">
        Issue Breakdown
      </ThemedText>
      
      <ThemedView 
        className="rounded-xl overflow-hidden p-4 mb-4"
        style={{ backgroundColor: chartBackground }}
      >
        {/* High Severity Bar */}
        <ThemedView className="mb-4">
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">High</ThemedText>
            <ThemedText className="text-sm md:text-base">
              {data[IssueSeverity.High]} ({Math.round(highPercentage)}%)
            </ThemedText>
          </ThemedView>
          <ThemedView 
            className="rounded-full overflow-hidden"
            style={{ height: barHeight, backgroundColor: barBackgroundColor }}
          >
            <ThemedView 
              className="rounded-full"
              style={{
                height: barHeight, 
                width: `${highPercentage}%`, 
                backgroundColor: '#E11D48',
                minWidth: highPercentage > 0 ? 20 : 0,
              }}
            />
          </ThemedView>
        </ThemedView>
        
        {/* Medium Severity Bar */}
        <ThemedView className="mb-4">
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">Medium</ThemedText>
            <ThemedText className="text-sm md:text-base">
              {data[IssueSeverity.Medium]} ({Math.round(mediumPercentage)}%)
            </ThemedText>
          </ThemedView>
          <ThemedView 
            className="rounded-full overflow-hidden"
            style={{ height: barHeight, backgroundColor: barBackgroundColor }}
          >
            <ThemedView 
              className="rounded-full"
              style={{
                height: barHeight, 
                width: `${mediumPercentage}%`, 
                backgroundColor: '#F59E0B',
                minWidth: mediumPercentage > 0 ? 20 : 0,
              }}
            />
          </ThemedView>
        </ThemedView>
        
        {/* Low Severity Bar */}
        <ThemedView>
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">Low</ThemedText>
            <ThemedText className="text-sm md:text-base">
              {data[IssueSeverity.Low]} ({Math.round(lowPercentage)}%)
            </ThemedText>
          </ThemedView>
          <ThemedView 
            className="rounded-full overflow-hidden"
            style={{ height: barHeight, backgroundColor: barBackgroundColor }}
          >
            <ThemedView 
              className="rounded-full"
              style={{
                height: barHeight, 
                width: `${lowPercentage}%`, 
                backgroundColor: '#10B981',
                minWidth: lowPercentage > 0 ? 20 : 0,
              }}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      <ThemedView className="flex-row flex-wrap justify-center gap-5 md:gap-6">
        <ThemedView className="flex-row items-center">
          <ThemedView className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#E11D48] mr-2" />
          <ThemedText className="text-xs md:text-sm">High</ThemedText>
        </ThemedView>
        
        <ThemedView className="flex-row items-center">
          <ThemedView className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#F59E0B] mr-2" />
          <ThemedText className="text-xs md:text-sm">Medium</ThemedText>
        </ThemedView>
        
        <ThemedView className="flex-row items-center">
          <ThemedView className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#10B981] mr-2" />
          <ThemedText className="text-xs md:text-sm">Low</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
