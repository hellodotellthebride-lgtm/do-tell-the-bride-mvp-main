import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { colors } from './colors';
import { radius, shadows, sizes, spacing } from './tokens';

export const theme = {
  colors,
  radius,
  shadows,
  sizes,
  spacing,
} as const;

export type Theme = typeof theme;

export const navigationTheme = {
  ...NavigationDefaultTheme,
  dark: false,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
} as const;

