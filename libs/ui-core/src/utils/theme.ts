import type { Tokens, ThemeMode, Theme } from '../tokens';

export const createTheme = <T extends Tokens>(options: {
  mode: ThemeMode;
  tokens: T;
}): Theme<T> => {
  return {
    mode: options.mode,
    tokens: options.tokens,
  };
};
