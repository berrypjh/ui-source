import { useThemeContext } from './ThemeProvider.js';

export const useTheme = () => {
  const theme = useThemeContext();
  if (!theme) {
    throw new Error('useTheme must be used within <ThemeProvider>.');
  }
  return theme;
};
