import { Native, ThemeName as DefaultTheme, Web } from '@berrypjh/design-tokens';

import type { LeafDotPath } from './path';

export type RNTokens = Native.Light.Tokens;
export type ThemeName = DefaultTheme;

/** 토큰 트리 구조는 모든 테마가 동일하므로 generic으로 받는다. */
export type Theme<TTokens> = {
  mode: ThemeName;
  tokens: TTokens;
};

export type ColorToken = LeafDotPath<Web.Light.ColorTokens>;
export type SpacingToken = LeafDotPath<Web.Light.SpacingTokens>;
export type RadiusToken = LeafDotPath<Web.Light.RadiusTokens>;
