import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

interface IssueBarChartProps {
  // Empty props for now - we'll use different data later
}

/**
 * Component for visualizing issue statistics as a horizontal bar chart
 */
export function IssueBarChart({}: IssueBarChartProps) {
  const colorScheme = useColorScheme();
  
  // Style values
  const barHeight = 28;
  const chartBackground = colorScheme === 'dark' ? '#1F2937' : '#F9FAFB';
  const barBackgroundColor = colorScheme === 'dark' ? '#374151' : '#E5E7EB';
  
  return (
    <ThemedView 
      className="rounded-xl mb-6 w-full"
    >
      <ThemedView 
        className="rounded-xl overflow-hidden mb-4 w-full"
        style={{ backgroundColor: chartBackground }}
      >
        {/* Docket Bar */}
        <ThemedView className="mb-4">
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">Docket</ThemedText>
            <ThemedText className="text-sm md:text-base">
              0 (0%)
            </ThemedText>
          </ThemedView>
          <ThemedView 
            className="rounded-full overflow-hidden"
            style={{ height: barHeight, backgroundColor: barBackgroundColor }}
          >
            {/* Empty bar */}
          </ThemedView>
        </ThemedView>
        
        {/* Vandalism Bar */}
        <ThemedView className="mb-4">
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">Vandalism</ThemedText>
            <ThemedText className="text-sm md:text-base">
              0 (0%)
            </ThemedText>
          </ThemedView>
          <ThemedView 
            className="rounded-full overflow-hidden"
            style={{ height: barHeight, backgroundColor: barBackgroundColor }}
          >
            {/* Empty bar */}
          </ThemedView>
        </ThemedView>
        
        {/* Corrective Bar */}
        <ThemedView className="mb-4">
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">Corrective</ThemedText>
            <ThemedText className="text-sm md:text-base">
              0 (0%)
            </ThemedText>
          </ThemedView>
          <ThemedView 
            className="rounded-full overflow-hidden"
            style={{ height: barHeight, backgroundColor: barBackgroundColor }}
          >
            {/* Empty bar */}
          </ThemedView>
        </ThemedView>
        
        {/* Preventive Bar */}
        <ThemedView className="mb-4">
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">Preventive</ThemedText>
            <ThemedText className="text-sm md:text-base">
              0 (0%)
            </ThemedText>
          </ThemedView>
          <ThemedView 
            className="rounded-full overflow-hidden"
            style={{ height: barHeight, backgroundColor: barBackgroundColor }}
          >
            {/* Empty bar */}
          </ThemedView>
        </ThemedView>
        
        {/* Audit Bar */}
        <ThemedView>
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">Audit</ThemedText>
            <ThemedText className="text-sm md:text-base">
              0 (0%)
            </ThemedText>
          </ThemedView>
          <ThemedView 
            className="rounded-full overflow-hidden"
            style={{ height: barHeight, backgroundColor: barBackgroundColor }}
          >
            {/* Empty bar */}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
