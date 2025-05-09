import React, { ReactNode } from 'react';
import { ScrollView, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

interface PageLayoutProps {
  /**
   * Page content
   */
  children: ReactNode;
  
  /**
   * Whether to disable safe area padding
   */
  disableSafeArea?: boolean;
  
  /**
   * Whether to disable horizontal padding
   */
  disablePadding?: boolean;
  
  /**
   * Whether to disable scrolling
   */
  disableScrolling?: boolean;
  
  /**
   * Header component to display
   */
  header?: ReactNode;
  
  /**
   * Footer component to display
   */
  footer?: ReactNode;
  
  /**
   * Additional classes to apply to the container
   */
  className?: string;
  
  /**
   * Background color override (uses theme color if not provided)
   */
  backgroundColor?: string;
}

/**
 * Standard page layout component with consistent spacing and padding
 */
export function PageLayout({
  children,
  disableSafeArea = false,
  disablePadding = false,
  disableScrolling = false,
  header,
  footer,
  className,
  backgroundColor,
}: PageLayoutProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  
  const Container = disableScrolling ? View : ScrollView;
  
  return (
    <ThemedView 
      className={`flex-1 ${className || ''}`}
      style={{
        backgroundColor: backgroundColor || (colorScheme === 'dark' ? '#121212' : '#FFFFFF'),
      }}
    >
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* Header */}
      {header}
      
      {/* Content */}
      <ThemedView
        className="flex-1"
        style={{
          paddingTop: disableSafeArea ? 0 : insets.top,
          paddingBottom: disableSafeArea ? 0 : insets.bottom,
          paddingLeft: disablePadding ? 0 : (disableSafeArea ? 16 : Math.max(16, insets.left)),
          paddingRight: disablePadding ? 0 : (disableSafeArea ? 16 : Math.max(16, insets.right)),
        }}
      >
        {children}
      </ThemedView>
      
      {/* Footer */}
      {footer}
    </ThemedView>
  );
}
