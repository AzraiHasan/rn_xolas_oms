import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export interface TabBadgeProps {
  /**
   * Badge count to display
   */
  count: number;
  
  /**
   * Maximum count to display before showing "+"
   * @default 99
   */
  maxCount?: number;
  
  /**
   * Badge color
   * @default "#E11D48" (red)
   */
  color?: string;
}

/**
 * Badge component for tab bar notifications
 */
export function TabBadge({ 
  count, 
  maxCount = 99, 
  color = "#E11D48" 
}: TabBadgeProps) {
  if (count <= 0) return null;
  
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const isSmall = count < 10;
  
  return (
    <ThemedView
      className={`absolute ${isSmall ? 'w-4 h-4' : 'min-w-5 h-5 px-1'} rounded-full items-center justify-center right-0 top-0 -mt-1 -mr-1 z-10`}
      style={{ backgroundColor: color }}
    >
      <ThemedText className="text-white text-[10px] font-bold">
        {displayCount}
      </ThemedText>
    </ThemedView>
  );
}
