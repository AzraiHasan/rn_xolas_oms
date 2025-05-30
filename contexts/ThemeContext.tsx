import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  colorScheme: NonNullable<ColorSchemeName>;
  setColorScheme: (scheme: NonNullable<ColorSchemeName>) => void;
  toggleColorScheme: () => void;
  isSystemDefault: boolean;
  setIsSystemDefault: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_PREFERENCE_KEY = '@theme_preference';
const THEME_SYSTEM_DEFAULT_KEY = '@theme_system_default';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme() || 'light';
  const [colorScheme, setColorScheme] = useState<NonNullable<ColorSchemeName>>('light');
  const [isSystemDefault, setIsSystemDefault] = useState(true);

  // Update color scheme when device theme changes and system default is enabled
  useEffect(() => {
    if (isSystemDefault) {
      setColorScheme(deviceColorScheme);
    }
  }, [deviceColorScheme, isSystemDefault]);

  const toggleColorScheme = () => {
    setColorScheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    setIsSystemDefault(false);
  };

  const value = {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    isSystemDefault,
    setIsSystemDefault,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
