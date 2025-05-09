/**
 * Theme configuration for NativeWind
 * This provides a centralized color palette and typography definitions
 */

// Defines the color palette for the application
export const colors = {
  // Primary brand colors
  primary: {
    50: '#e0f2f7',
    100: '#b3dfed',
    200: '#80c9e2',
    300: '#4db2d6',
    400: '#27a2ce',
    500: '#0a7ea4', // Primary brand color
    600: '#097093',
    700: '#075d7c',
    800: '#054a64',
    900: '#03374d',
  },
  
  // Secondary colors
  secondary: {
    50: '#e5f6f8',
    100: '#c2e8ee',
    200: '#9adae3',
    300: '#71ccd8',
    400: '#53c2d0',
    500: '#36b7c8',
    600: '#2fa5b5',
    700: '#26909c',
    800: '#1d7b85',
    900: '#12585f',
  },
  
  // Success colors (green)
  success: {
    50: '#e7f9f0',
    100: '#c2f0d8',
    200: '#99e6be',
    300: '#66dba1',
    400: '#33d084',
    500: '#10b981', // Matches IssueSeverity.Low
    600: '#0da975',
    700: '#0a9868',
    800: '#08875b',
    900: '#056742',
  },
  
  // Warning colors (amber/orange)
  warning: {
    50: '#fff8e6',
    100: '#feefc0',
    200: '#fee499',
    300: '#fdd86d',
    400: '#fccf4c',
    500: '#f59e0b', // Matches IssueSeverity.Medium
    600: '#e08e0a',
    700: '#c67b09',
    800: '#ac6b08',
    900: '#824f06',
  },
  
  // Danger colors (red)
  danger: {
    50: '#fdeaef',
    100: '#f9c5d1',
    200: '#f59faf',
    300: '#f1768d',
    400: '#ee5a75',
    500: '#e11d48', // Matches IssueSeverity.High
    600: '#d01942',
    700: '#ba1639',
    800: '#a31232',
    900: '#7c0e26',
  },
  
  // Neutral colors for text, backgrounds, etc.
  neutral: {
    50: '#f9fafb', // Light mode background
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ba3af',
    500: '#687076', // Light mode icon color
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#11181c', // Light mode text
  },
  
  // Dark mode specific colors
  dark: {
    50: '#ecedee', // Dark mode text
    100: '#d8dadb',
    200: '#b9bcbe',
    300: '#9ba1a6', // Dark mode icon color
    400: '#7c8389',
    500: '#5e646b',
    600: '#474c51',
    700: '#333638',
    800: '#1e1f20',
    900: '#151718', // Dark mode background
  },
}

// Font family definitions
export const fontFamily = {
  sans: ['Inter'], // Default sans-serif font
  mono: ['Space Mono', 'monospace'], // Monospace font for code, etc.
}

// Typography scale
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
}

// Line height scale
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
}

// Spacing scale (in pixels)
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
}

// Border radius scale
export const borderRadius = {
  none: 0,
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
}

// Opacity scale
export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
}

// Shadow definitions
export const boxShadow = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
}
