import { getToken } from './getToken';
import type { PathValue } from './path';
import type { ColorToken, RNTokens, Theme } from './types';

export const getColor = <P extends ColorToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['color'], P> => {
  return getToken(theme.tokens.color, key);
};
