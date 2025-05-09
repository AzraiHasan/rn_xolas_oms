import { colors } from './theme';

/**
 * Colors used throughout the app, supporting both light and dark modes.
 * These values align with the NativeWind theme configuration.
 */

export const Colors = {
  light: {
    text: colors.neutral[900],
    background: colors.neutral[50],
    tint: colors.primary[500],
    icon: colors.neutral[500],
    tabIconDefault: colors.neutral[500],
    tabIconSelected: colors.primary[500],
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    success: colors.success[500],
    warning: colors.warning[500],
    danger: colors.danger[500],
  },
  dark: {
    text: colors.dark[50],
    background: colors.dark[900],
    tint: '#ffffff',
    icon: colors.dark[300],
    tabIconDefault: colors.dark[300],
    tabIconSelected: '#ffffff',
    primary: colors.primary[400],
    secondary: colors.secondary[400],
    success: colors.success[400],
    warning: colors.warning[400],
    danger: colors.danger[400],
  },
};
