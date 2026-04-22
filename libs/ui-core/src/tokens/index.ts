export { Web, Native } from '@berrypjh/design-tokens';

export {
  getColor,
  getSpacing,
  getRadius,
  getBorderWidth,
  getBorder,
  getTypography,
  getShadow,
  getElevation,
  getComponent,
} from './getters';

export type {
  WebTokens,
  RNTokens,
  ThemeName,
  Theme,
  ColorToken,
  ColorValue,
  SpacingToken,
  SpacingValue,
  RadiusToken,
  RadiusValue,
  BorderWidthToken,
  BorderWidthValue,
  BorderToken,
  BorderValue,
  TypographyToken,
  TypographyValue,
  ShadowToken,
  ShadowValue,
  ElevationToken,
  ElevationValue,
  ComponentToken,
  ComponentValue,
} from './types';

export { createTheme } from './theme';
