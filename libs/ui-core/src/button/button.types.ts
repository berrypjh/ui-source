import type { TokenKey } from '../tokens/token-key';

export type ButtonVariant = 'primary' | 'secondary' | 'error' | 'warning' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonRecipe {
  bg: { default: TokenKey; hover: TokenKey; pressed: TokenKey; disabled: TokenKey };
  fg: { default: TokenKey; disabled: TokenKey };
  border: { default: TokenKey; hover: TokenKey; disabled: TokenKey };
  focusRing: TokenKey;

  height: number;
  paddingX: TokenKey;
  paddingY: TokenKey;
  radius: TokenKey;
  gap: TokenKey;
  iconSize: number;

  fontFamily: TokenKey;
  fontWeight: TokenKey;
  fontSize: TokenKey;
  lineHeight: TokenKey;

  borderWidth: number;
  focusRingWidth: number;
}

export interface ResolveButtonRecipeInput {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
