import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ColorSchemeName } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { IssueProvider } from '@/contexts/IssueContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <IssueProvider>
        <RootLayoutNavigation />
      </IssueProvider>
    </ThemeProvider>
  );
}

function RootLayoutNavigation() {
  // Get colorScheme from context
  const colorScheme = useColorSchemeHelper();
  
  return (
    <SafeAreaProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="issue/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="issue/update/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    </SafeAreaProvider>
  );
}

// Helper function to access theme context
function useColorSchemeHelper(): NonNullable<ColorSchemeName> {
  // Import inside the component to avoid circular dependency
  const { useThemeContext } = require('@/contexts/ThemeContext');
  const { colorScheme } = useThemeContext();
  return colorScheme;
}
