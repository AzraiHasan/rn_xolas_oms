import { ColorSchemeName } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

export function useColorScheme(): NonNullable<ColorSchemeName> {
  const { colorScheme } = useThemeContext();
  return colorScheme;
}
