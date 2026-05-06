import { createContext, useContext, useMemo } from 'react';

import type { RNTokens, Theme, ThemeName } from '@berrypjh/ui-core';
import { createTheme, Native } from '@berrypjh/ui-core';

const ThemeContext = createContext<Theme<RNTokens> | null>(null);

export interface ThemeProviderProps {
  mode?: ThemeName;
  tokensByMode?: Record<ThemeName, RNTokens>;
  children: React.ReactNode;
}

export const ThemeProvider = ({
  mode = 'light',
  tokensByMode = Native as unknown as Record<ThemeName, RNTokens>,
  children,
}: ThemeProviderProps) => {
  const theme = useMemo(() => {
    const tokens = tokensByMode[mode];
    return createTheme({ mode, tokens });
  }, [mode, tokensByMode]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = (): Theme<RNTokens> | null => {
  return useContext(ThemeContext);
};
