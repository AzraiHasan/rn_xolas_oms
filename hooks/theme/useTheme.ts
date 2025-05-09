import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { colors } from '@/constants/theme';

/**
 * Custom hook for accessing theme colors and values
 */
export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get current theme colors
  const themeColors = Colors[colorScheme || 'light'];
  
  // Function to get a color based on its semantic name
  const getColor = (colorName: keyof typeof themeColors) => {
    return themeColors[colorName];
  };
  
  // Function to get a shade of a color from the palette
  const getColorShade = (
    colorType: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'dark',
    shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  ) => {
    return colors[colorType][shade];
  };
  
  return {
    isDark,
    colorScheme,
    colors: themeColors,
    getColor,
    getColorShade,
    severityColors: {
      high: isDark ? colors.danger[400] : colors.danger[500],
      medium: isDark ? colors.warning[400] : colors.warning[500],
      low: isDark ? colors.success[400] : colors.success[500],
    }
  };
}
