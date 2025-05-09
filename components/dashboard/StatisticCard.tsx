import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

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
  className?: string;
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
  className,
}: StatisticCardProps) {
  return (
    <ThemedView 
      className={`flex-1 min-w-[45%] md:min-w-[30%] lg:min-w-0 rounded-xl p-4 md:p-5 min-h-[100px] md:min-h-[120px] flex-row justify-between ${className || ''}`}
      style={[{ backgroundColor }, style]}
    >
      <ThemedView className="justify-center">
        <ThemedText 
          className="text-3xl md:text-4xl font-bold mb-1"
          style={valueColor ? { color: valueColor } : undefined}
        >
          {value}
        </ThemedText>
        
        <ThemedText 
          className="text-sm md:text-base"
          style={labelColor ? { color: labelColor } : undefined}
        >
          {label}
        </ThemedText>
      </ThemedView>
      
      {iconName && (
        <ThemedView className="justify-center opacity-80">
          <IconSymbol name={iconName} size={28} color={iconColor} />
        </ThemedView>
      )}
    </ThemedView>
  );
}
