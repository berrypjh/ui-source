import { getToken } from './getToken';
import type {
  Theme,
  RNTokens,
  ColorToken,
  SpacingToken,
  RadiusToken,
  BorderWidthToken,
  BorderToken,
  TypographyToken,
  ShadowToken,
  ElevationToken,
  ComponentToken,
} from './types';
import type { PathValue } from './path';

export const getColor = <P extends ColorToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['color'], P> => {
  return getToken(theme.tokens.color, key);
};

export const getSpacing = <P extends SpacingToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['spacing'], P> => {
  return getToken(theme.tokens.spacing, key);
};

export const getRadius = <P extends RadiusToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['radius'], P> => {
  return getToken(theme.tokens.radius, key);
};

export const getBorderWidth = <P extends BorderWidthToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['borderWidth'], P> => {
  return getToken(theme.tokens.borderWidth, key);
};

export const getBorder = <P extends BorderToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['border'], P> => {
  return getToken(theme.tokens.border, key);
};

export const getTypography = <P extends TypographyToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['typography'], P> => {
  return getToken(theme.tokens.typography, key);
};

export const getShadow = <P extends ShadowToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['shadow'], P> => {
  return getToken(theme.tokens.shadow, key);
};

export const getElevation = <P extends ElevationToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['elevation'], P> => {
  return getToken(theme.tokens.elevation, key);
};

export const getComponent = <P extends ComponentToken>(
  theme: Theme<RNTokens>,
  key: P,
): PathValue<RNTokens['component'], P> => {
  return getToken(theme.tokens.component, key);
};
