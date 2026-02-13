import { Native, Web, ThemeName as DefaultTheme } from '@berrypjh/design-tokens';
import type { LeafDotPath, PathValue } from './path';

export type WebTokens = Web.Global.Tokens;
export type RNTokens = Native.Global.Tokens;
export type ThemeName = DefaultTheme;

// 전체 Type 구조는 global/dark가 동일
export type Theme<TTokens> = {
  mode: ThemeName;
  tokens: TTokens;
};

type TokenKey<TGroup> = LeafDotPath<TGroup>;
type TokenVal<TGroup, P extends TokenKey<TGroup>> = PathValue<TGroup, P>;

type GroupToken<TGroup> = TokenKey<TGroup>;
type GroupValue<TGroup, P extends GroupToken<TGroup>> = TokenVal<TGroup, P>;

// Color
export type ColorToken = GroupToken<Web.Global.ColorTokens>;
export type ColorValue<P extends ColorToken> = GroupValue<Web.Global.ColorTokens, P>;

// Spacing
export type SpacingToken = GroupToken<Web.Global.SpacingTokens>;
export type SpacingValue<P extends SpacingToken> = GroupValue<Web.Global.SpacingTokens, P>;

// Radius
export type RadiusToken = GroupToken<Web.Global.RadiusTokens>;
export type RadiusValue<P extends RadiusToken> = GroupValue<Web.Global.RadiusTokens, P>;

// BorderWidth
export type BorderWidthToken = GroupToken<Web.Global.BorderWidthTokens>;
export type BorderWidthValue<P extends BorderWidthToken> = GroupValue<
  Web.Global.BorderWidthTokens,
  P
>;

// Border
export type BorderToken = GroupToken<Web.Global.BorderTokens>;
export type BorderValue<P extends BorderToken> = GroupValue<Web.Global.BorderTokens, P>;

// Typography
export type TypographyToken = GroupToken<Web.Global.TypographyTokens>;
export type TypographyValue<P extends TypographyToken> = GroupValue<Web.Global.TypographyTokens, P>;

// Shadow
export type ShadowToken = GroupToken<Web.Global.ShadowTokens>;
export type ShadowValue<P extends ShadowToken> = GroupValue<Web.Global.ShadowTokens, P>;

// Elevation
export type ElevationToken = GroupToken<Web.Global.ElevationTokens>;
export type ElevationValue<P extends ElevationToken> = GroupValue<Web.Global.ElevationTokens, P>;

// Component
export type ComponentToken = GroupToken<Web.Global.ComponentTokens>;
export type ComponentValue<P extends ComponentToken> = GroupValue<Web.Global.ComponentTokens, P>;
