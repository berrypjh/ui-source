import { createContext, useContext, useMemo } from 'react';
import { createTheme } from '@berrypjh/ui-core';
import type { Theme, ThemeMode, Tokens } from '@berrypjh/ui-core';
import { rn as defaultTokensByMode } from '@berrypjh/design-tokens';

const ThemeContext = createContext<Theme<Tokens> | null>(null);

export interface ThemeProviderProps {
  mode?: ThemeMode;
  tokensByMode?: Record<ThemeMode, Tokens>;
  children: React.ReactNode;
}

export const ThemeProvider = ({
  mode = 'light',
  tokensByMode = defaultTokensByMode as unknown as Record<ThemeMode, Tokens>,
  children,
}: ThemeProviderProps) => {
  const theme = useMemo(() => {
    const tokens = tokensByMode[mode];
    return createTheme({ mode, tokens });
  }, [mode, tokensByMode]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = (): Theme<Tokens> | null => {
  return useContext(ThemeContext);
};
