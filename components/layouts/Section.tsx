import React, { ReactNode } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface SectionProps {
  /**
   * Section title
   */
  title?: string;
  
  /**
   * Section subtitle
   */
  subtitle?: string;
  
  /**
   * Section content
   */
  children: ReactNode;
  
  /**
   * Right content to display next to the title
   */
  rightContent?: ReactNode;
  
  /**
   * Whether to add a border
   */
  bordered?: boolean;
  
  /**
   * Additional classes for the container
   */
  className?: string;
}

/**
 * Section component for consistent content grouping
 */
export function Section({
  title,
  subtitle,
  children,
  rightContent,
  bordered = false,
  className,
}: SectionProps) {
  return (
    <ThemedView 
      className={`
        mb-6 
        ${bordered ? 'border border-[#E4E7EB] dark:border-gray-700 rounded-xl p-4 md:p-5' : ''} 
        ${className || ''}
      `}
    >
      {(title || rightContent) && (
        <ThemedView className="flex-row justify-between items-center mb-3">
          <ThemedView className="flex-1">
            {title && (
              <ThemedText type="subtitle" className="md:text-lg">
                {title}
              </ThemedText>
            )}
            
            {subtitle && (
              <ThemedText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </ThemedText>
            )}
          </ThemedView>
          
          {rightContent && (
            <ThemedView className="ml-4">
              {rightContent}
            </ThemedView>
          )}
        </ThemedView>
      )}
      
      {children}
    </ThemedView>
  );
}
