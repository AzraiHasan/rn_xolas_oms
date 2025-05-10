import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueStatus } from '@/types/models/Issue';

interface StatusBarChartProps {
  data: Record<IssueStatus, number>;
  total: number;
}

/**
 * Component for visualizing issue status distribution as a horizontal bar chart
 */
export function StatusBarChart({ data, total }: StatusBarChartProps) {
  const colorScheme = useColorScheme();
  
  // Calculate percentages for each status
  const getPercentage = (count: number): number => {
    if (total === 0) return 0;
    return (count / total) * 100;
  };
  
  const newPercentage = getPercentage(data[IssueStatus.New]);
  const assignedPercentage = getPercentage(data[IssueStatus.Assigned]);
  const inProgressPercentage = getPercentage(data[IssueStatus.InProgress]);
  const resolvedPercentage = getPercentage(data[IssueStatus.Resolved]);
  
  // Style values
  const barHeight = 28;
  const chartBackground = colorScheme === 'dark' ? '#1F2937' : '#F9FAFB';
  const barBackgroundColor = colorScheme === 'dark' ? '#374151' : '#E5E7EB';
  
  // Status colors
  const statusColors = {
    [IssueStatus.New]: '#3B82F6', // Blue
    [IssueStatus.Assigned]: '#8B5CF6', // Purple
    [IssueStatus.InProgress]: '#F97316', // Orange
    [IssueStatus.Resolved]: '#10B981', // Green
  };
  
  return (
    <ThemedView 
      className="rounded-xl p-4 mb-6 border-[1px] md:p-5 lg:p-6"
      style={{ borderColor: colorScheme === 'dark' ? '#FFFFFF' : '#444444' }}
    >
      <ThemedText type="defaultSemiBold" className="mb-4 md:text-lg">
        Issue Status
      </ThemedText>
      
      <ThemedView 
        className="rounded-xl overflow-hidden p-4 mb-4"
        style={{ backgroundColor: chartBackground }}
      >
        {/* New Status Bar */}
        <ThemedView className="mb-4">
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">New</ThemedText>
            <ThemedText className="text-sm md:text-base">
              {data[IssueStatus.New]} ({Math.round(newPercentage)}%)
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
                width: `${newPercentage}%`, 
                backgroundColor: statusColors[IssueStatus.New],
                minWidth: newPercentage > 0 ? 20 : 0,
              }}
            />
          </ThemedView>
        </ThemedView>
        
        {/* Assigned Status Bar */}
        <ThemedView className="mb-4">
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">Assigned</ThemedText>
            <ThemedText className="text-sm md:text-base">
              {data[IssueStatus.Assigned]} ({Math.round(assignedPercentage)}%)
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
                width: `${assignedPercentage}%`, 
                backgroundColor: statusColors[IssueStatus.Assigned],
                minWidth: assignedPercentage > 0 ? 20 : 0,
              }}
            />
          </ThemedView>
        </ThemedView>
        
        {/* In Progress Status Bar */}
        <ThemedView className="mb-4">
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">In Progress</ThemedText>
            <ThemedText className="text-sm md:text-base">
              {data[IssueStatus.InProgress]} ({Math.round(inProgressPercentage)}%)
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
                width: `${inProgressPercentage}%`, 
                backgroundColor: statusColors[IssueStatus.InProgress],
                minWidth: inProgressPercentage > 0 ? 20 : 0,
              }}
            />
          </ThemedView>
        </ThemedView>
        
        {/* Resolved Status Bar */}
        <ThemedView>
          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm md:text-base font-bold">Resolved</ThemedText>
            <ThemedText className="text-sm md:text-base">
              {data[IssueStatus.Resolved]} ({Math.round(resolvedPercentage)}%)
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
                width: `${resolvedPercentage}%`, 
                backgroundColor: statusColors[IssueStatus.Resolved],
                minWidth: resolvedPercentage > 0 ? 20 : 0,
              }}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      <ThemedView className="flex-row flex-wrap justify-center gap-3 md:gap-4">
        <ThemedView className="flex-row items-center">
          <ThemedView className="w-4 h-4 md:w-5 md:h-5 rounded-full mr-2" style={{ backgroundColor: statusColors[IssueStatus.New] }} />
          <ThemedText className="text-xs md:text-sm">New</ThemedText>
        </ThemedView>
        
        <ThemedView className="flex-row items-center">
          <ThemedView className="w-4 h-4 md:w-5 md:h-5 rounded-full mr-2" style={{ backgroundColor: statusColors[IssueStatus.Assigned] }} />
          <ThemedText className="text-xs md:text-sm">Assigned</ThemedText>
        </ThemedView>
        
        <ThemedView className="flex-row items-center">
          <ThemedView className="w-4 h-4 md:w-5 md:h-5 rounded-full mr-2" style={{ backgroundColor: statusColors[IssueStatus.InProgress] }} />
          <ThemedText className="text-xs md:text-sm">In Progress</ThemedText>
        </ThemedView>
        
        <ThemedView className="flex-row items-center">
          <ThemedView className="w-4 h-4 md:w-5 md:h-5 rounded-full mr-2" style={{ backgroundColor: statusColors[IssueStatus.Resolved] }} />
          <ThemedText className="text-xs md:text-sm">Resolved</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
