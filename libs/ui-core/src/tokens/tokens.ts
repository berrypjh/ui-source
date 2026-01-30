import type { ColorTokens } from './color';
import type { SpacingTokens, RadiusTokens } from './layout';
import type { BorderTokens, BorderWidthTokens } from './border';
import type { TypographyTokens } from './typography';
import type { ShadowTokens, ElevationTokens } from './shadow';
import type { ComponentTokens } from './component';

export interface Tokens {
  color: ColorTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;

  borderWidth: BorderWidthTokens;
  border: BorderTokens;

  typography: TypographyTokens;

  shadow: ShadowTokens;
  elevation: ElevationTokens;

  component: ComponentTokens;
}
