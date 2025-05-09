import React, { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FooterProps {
  /**
   * Footer content
   */
  children: ReactNode;
  
  /**
   * Whether to add a top border
   */
  showBorder?: boolean;
  
  /**
   * Whether to use a transparent background
   */
  transparent?: boolean;
  
  /**
   * Whether to use safe area padding
   */
  useSafeArea?: boolean;
  
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Application footer component with consistent styling
 */
export function Footer({
  children,
  showBorder = true,
  transparent = false,
  useSafeArea = true,
  className,
}: FooterProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  
  return (
    <ThemedView
      className={`px-4 py-3 ${className || ''}`}
      style={{
        backgroundColor: transparent ? 'transparent' : (colorScheme === 'dark' ? '#121212' : '#FFFFFF'),
        paddingBottom: useSafeArea ? Math.max(insets.bottom, 16) : 16,
        borderTopWidth: showBorder ? 1 : 0,
        borderTopColor: colorScheme === 'dark' ? '#333' : '#E4E7EB',
      }}
    >
      {children}
    </ThemedView>
  );
}
