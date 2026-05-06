import { Native, ThemeName as DefaultTheme, Web } from '@berrypjh/design-tokens';

import type { LeafDotPath, PathValue } from './path';

export type WebTokens = Web.Light.Tokens;
export type RNTokens = Native.Light.Tokens;
export type ThemeName = DefaultTheme;

// 전체 Type 구조는 light/dark가 동일
export type Theme<TTokens> = {
  mode: ThemeName;
  tokens: TTokens;
};

type TokenKey<TGroup> = LeafDotPath<TGroup>;
type TokenVal<TGroup, P extends TokenKey<TGroup>> = PathValue<TGroup, P>;

type GroupToken<TGroup> = TokenKey<TGroup>;
type GroupValue<TGroup, P extends GroupToken<TGroup>> = TokenVal<TGroup, P>;

// Color
export type ColorToken = GroupToken<Web.Light.ColorTokens>;
export type ColorValue<P extends ColorToken> = GroupValue<Web.Light.ColorTokens, P>;

// Spacing
export type SpacingToken = GroupToken<Web.Light.SpacingTokens>;
export type SpacingValue<P extends SpacingToken> = GroupValue<Web.Light.SpacingTokens, P>;

// Radius
export type RadiusToken = GroupToken<Web.Light.RadiusTokens>;
export type RadiusValue<P extends RadiusToken> = GroupValue<Web.Light.RadiusTokens, P>;

// BorderWidth
export type BorderWidthToken = GroupToken<Web.Light.BorderWidthTokens>;
export type BorderWidthValue<P extends BorderWidthToken> = GroupValue<
  Web.Light.BorderWidthTokens,
  P
>;

// Border
export type BorderToken = GroupToken<Web.Light.BorderTokens>;
export type BorderValue<P extends BorderToken> = GroupValue<Web.Light.BorderTokens, P>;

// Typography
export type TypographyToken = GroupToken<Web.Light.TypographyTokens>;
export type TypographyValue<P extends TypographyToken> = GroupValue<Web.Light.TypographyTokens, P>;

// Shadow
export type ShadowToken = GroupToken<Web.Light.ShadowTokens>;
export type ShadowValue<P extends ShadowToken> = GroupValue<Web.Light.ShadowTokens, P>;

// Elevation
export type ElevationToken = GroupToken<Web.Light.ElevationTokens>;
export type ElevationValue<P extends ElevationToken> = GroupValue<Web.Light.ElevationTokens, P>;

// Component
export type ComponentToken = GroupToken<Web.Light.ComponentTokens>;
export type ComponentValue<P extends ComponentToken> = GroupValue<Web.Light.ComponentTokens, P>;
