import { createContext, useContext, useMemo } from 'react';
import { createTheme } from '@berrypjh/ui-core';
import type { Theme, ThemeName, RNTokens } from '@berrypjh/ui-core';
import { Native } from '@berrypjh/design-tokens';

const ThemeContext = createContext<Theme<RNTokens> | null>(null);

export interface ThemeProviderProps {
  mode?: ThemeName;
  tokensByMode?: Record<ThemeName, RNTokens>;
  children: React.ReactNode;
}

export const ThemeProvider = ({
  mode = 'global',
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
