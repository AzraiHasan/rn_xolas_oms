// Override the default useColorScheme hook to always return 'light'
import { ColorSchemeName } from 'react-native';

export function useColorScheme(): NonNullable<ColorSchemeName> {
  // Always return 'light' regardless of system settings
  return 'light';
}
