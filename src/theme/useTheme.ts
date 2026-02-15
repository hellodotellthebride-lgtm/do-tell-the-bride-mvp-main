import React, { createContext, useContext } from 'react';
import { theme, type Theme } from './theme';

const ThemeContext = createContext<Theme>(theme);

type ThemeProviderProps = {
  children: React.ReactNode;
  value?: Theme;
};

export function ThemeProvider({ children, value }: ThemeProviderProps) {
  return React.createElement(ThemeContext.Provider, { value: value ?? theme }, children);
}

export default function useTheme() {
  return useContext(ThemeContext);
}
