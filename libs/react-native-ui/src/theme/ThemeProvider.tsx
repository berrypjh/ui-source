import { createContext, useContext, useMemo } from 'react';

import type { RNTokens, Theme, ThemeName } from '@berrypjh/ui-core';
import { createTheme, Native } from '@berrypjh/ui-core';

const ThemeContext = createContext<Theme<RNTokens> | null>(null);

/** `Native`의 namespace 키는 capitalize(`Light`/`Dark`/`Sepia`)이므로 소문자 `ThemeName`으로 매핑한다. */
const DEFAULT_TOKENS_BY_MODE: Record<ThemeName, RNTokens> = {
  light: Native.Light.tokens,
  dark: Native.Dark.tokens,
  sepia: Native.Sepia.tokens,
};

export interface ThemeProviderProps {
  mode?: ThemeName;
  tokensByMode?: Record<ThemeName, RNTokens>;
  children: React.ReactNode;
}

export const ThemeProvider = ({
  mode = 'light',
  tokensByMode = DEFAULT_TOKENS_BY_MODE,
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
