import { getToken } from './getToken';
import type {
  Theme,
  WebTokens,
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
  theme: Theme<WebTokens>,
  key: P,
): PathValue<WebTokens['color'], P> => {
  return getToken(theme.tokens.color, key);
};

export const getSpacing = <P extends SpacingToken>(
  theme: Theme<WebTokens>,
  key: P,
): PathValue<WebTokens['spacing'], P> => {
  return getToken(theme.tokens.spacing, key);
};

export const getRadius = <P extends RadiusToken>(
  theme: Theme<WebTokens>,
  key: P,
): PathValue<WebTokens['radius'], P> => {
  return getToken(theme.tokens.radius, key);
};

export const getBorderWidth = <P extends BorderWidthToken>(
  theme: Theme<WebTokens>,
  key: P,
): PathValue<WebTokens['borderWidth'], P> => {
  return getToken(theme.tokens.borderWidth, key);
};

export const getBorder = <P extends BorderToken>(
  theme: Theme<WebTokens>,
  key: P,
): PathValue<WebTokens['border'], P> => {
  return getToken(theme.tokens.border, key);
};

export const getTypography = <P extends TypographyToken>(
  theme: Theme<WebTokens>,
  key: P,
): PathValue<WebTokens['typography'], P> => {
  return getToken(theme.tokens.typography, key);
};

export const getShadow = <P extends ShadowToken>(
  theme: Theme<WebTokens>,
  key: P,
): PathValue<WebTokens['shadow'], P> => {
  return getToken(theme.tokens.shadow, key);
};

export const getElevation = <P extends ElevationToken>(
  theme: Theme<WebTokens>,
  key: P,
): PathValue<WebTokens['elevation'], P> => {
  return getToken(theme.tokens.elevation, key);
};

export const getComponent = <P extends ComponentToken>(
  theme: Theme<WebTokens>,
  key: P,
): PathValue<WebTokens['component'], P> => {
  return getToken(theme.tokens.component, key);
};
