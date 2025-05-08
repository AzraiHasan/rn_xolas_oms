import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface StatisticCardProps {
  value: number | string;
  label: string;
  backgroundColor?: string;
  valueColor?: string;
  labelColor?: string;
  iconName?: string;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card component displaying a statistical metric
 */
export function StatisticCard({
  value,
  label,
  backgroundColor = '#F5F5F5',
  valueColor,
  labelColor,
  iconName,
  iconColor,
  style,
}: StatisticCardProps) {
  return (
    <ThemedView style={[styles.container, { backgroundColor }, style]}>
      <ThemedView style={styles.content}>
        <ThemedText style={[styles.value, valueColor ? { color: valueColor } : undefined]}>
          {value}
        </ThemedText>
        
        <ThemedText style={[styles.label, labelColor ? { color: labelColor } : undefined]}>
          {label}
        </ThemedText>
      </ThemedView>
      
      {iconName && (
        <ThemedView style={styles.iconContainer}>
          <IconSymbol name={iconName} size={28} color={iconColor} />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    justifyContent: 'center',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
  },
  iconContainer: {
    justifyContent: 'center',
    opacity: 0.8,
  },
});
