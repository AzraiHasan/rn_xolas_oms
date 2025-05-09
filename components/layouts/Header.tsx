import React, { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface HeaderProps {
  /**
   * Title text to display
   */
  title: string;
  
  /**
   * Whether to show a back button
   */
  showBackButton?: boolean;
  
  /**
   * Whether to center the title
   */
  centerTitle?: boolean;
  
  /**
   * Right content to display in the header
   */
  rightContent?: ReactNode;
  
  /**
   * Custom back button action
   */
  onBackPress?: () => void;
  
  /**
   * Whether to use a transparent background
   */
  transparent?: boolean;
  
  /**
   * Optional additional class names
   */
  className?: string;
}

/**
 * Application header component with consistent styling
 */
export function Header({
  title,
  showBackButton = false,
  centerTitle = false,
  rightContent,
  onBackPress,
  transparent = false,
  className,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };
  
  return (
    <ThemedView
      className={`
        ${transparent ? 'bg-transparent' : (colorScheme === 'dark' ? 'bg-[#121212]' : 'bg-white')}
        flex-row items-center justify-between px-4 py-3 
        ${(centerTitle && !showBackButton) ? 'justify-center' : 'justify-between'}
        ${className || ''}
      `}
      style={{
        paddingTop: transparent ? 0 : Math.max(insets.top, 12),
        height: transparent ? 56 : Math.max(56, insets.top + 44),
        borderBottomWidth: transparent ? 0 : 1,
        borderBottomColor: colorScheme === 'dark' ? '#333' : '#E4E7EB',
      }}
    >
      {/* Left: Back button or empty space */}
      <ThemedView className="min-w-8">
        {showBackButton && (
          <Pressable
            onPress={handleBackPress}
            className="p-2 -m-2"
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
        )}
      </ThemedView>
      
      {/* Center: Title */}
      <ThemedText 
        className={`
          text-lg font-semibold 
          ${centerTitle ? 'text-center' : 'text-left'} 
          ${showBackButton ? 'flex-1 pl-2' : ''}
          ${rightContent ? 'flex-1' : ''}
        `}
        numberOfLines={1}
      >
        {title}
      </ThemedText>
      
      {/* Right: Optional content or empty space */}
      <ThemedView className="min-w-8 flex-row justify-end">
        {rightContent}
      </ThemedView>
    </ThemedView>
  );
}
