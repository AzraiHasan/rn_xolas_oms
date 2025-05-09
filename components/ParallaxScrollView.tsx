import type { PropsWithChildren, ReactElement } from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const insets = useSafeAreaInsets();
  
  // Calculate header height with safe area insets
  const headerHeight = HEADER_HEIGHT + insets.top;
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView className="flex-1">
      <ThemedView 
        className="absolute top-0 left-0 right-0 z-20"
        style={{ 
          height: insets.top, 
          backgroundColor: headerBackgroundColor[colorScheme] 
        }} 
      />
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        scrollIndicatorInsets={{ bottom, top: insets.top }}
        automaticallyAdjustContentInsets={true}
        contentContainerStyle={{ 
          paddingBottom: bottom, 
          paddingTop: headerHeight,
        }}>
        <Animated.View
          className="overflow-hidden absolute left-0 right-0"
          style={[
            { 
              backgroundColor: headerBackgroundColor[colorScheme],
              height: headerHeight,
              top: -insets.top,
              paddingTop: insets.top
            },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <ThemedView className="flex-1 p-8 gap-4 overflow-hidden">
          {children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}
