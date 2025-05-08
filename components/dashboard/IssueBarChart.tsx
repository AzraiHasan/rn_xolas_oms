import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
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
  const colors = Colors[colorScheme ?? 'light'];
  
  // Calculate percentages for each severity
  const getPercentage = (count: number): number => {
    if (total === 0) return 0;
    return (count / total) * 100;
  };
  
  const highPercentage = getPercentage(data[IssueSeverity.High]);
  const mediumPercentage = getPercentage(data[IssueSeverity.Medium]);
  const lowPercentage = getPercentage(data[IssueSeverity.Low]);
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.title}>
        Issue Breakdown
      </ThemedText>
      
      <ThemedView style={styles.barContainer}>
        <ThemedView style={styles.barChart}>
          <ThemedView style={[styles.barSegment, { 
            width: `${highPercentage}%`, 
            backgroundColor: '#E11D48',
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            borderTopRightRadius: mediumPercentage === 0 && lowPercentage === 0 ? 4 : 0,
            borderBottomRightRadius: mediumPercentage === 0 && lowPercentage === 0 ? 4 : 0,
          }]} />
          
          <ThemedView style={[styles.barSegment, { 
            width: `${mediumPercentage}%`, 
            backgroundColor: '#F59E0B',
            borderTopRightRadius: lowPercentage === 0 ? 4 : 0,
            borderBottomRightRadius: lowPercentage === 0 ? 4 : 0,
          }]} />
          
          <ThemedView style={[styles.barSegment, { 
            width: `${lowPercentage}%`, 
            backgroundColor: '#10B981',
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
          }]} />
        </ThemedView>
        
        <ThemedView style={styles.labelContainer}>
          <ThemedView style={styles.labelGroup}>
            <ThemedView style={[styles.colorIndicator, { backgroundColor: '#E11D48' }]} />
            <ThemedText style={styles.labelText}>
              High: {data[IssueSeverity.High]} ({Math.round(highPercentage)}%)
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.labelGroup}>
            <ThemedView style={[styles.colorIndicator, { backgroundColor: '#F59E0B' }]} />
            <ThemedText style={styles.labelText}>
              Medium: {data[IssueSeverity.Medium]} ({Math.round(mediumPercentage)}%)
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.labelGroup}>
            <ThemedView style={[styles.colorIndicator, { backgroundColor: '#10B981' }]} />
            <ThemedText style={styles.labelText}>
              Low: {data[IssueSeverity.Low]} ({Math.round(lowPercentage)}%)
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E4E7EB',
  },
  title: {
    marginBottom: 16,
  },
  barContainer: {
    gap: 16,
  },
  barChart: {
    height: 24,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  barSegment: {
    height: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  labelText: {
    fontSize: 12,
  },
});
