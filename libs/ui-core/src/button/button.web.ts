import { cssVar } from '../tokens/token-key';
import { resolveButtonRecipe } from './button.recipe';
import type { ResolveButtonRecipeInput } from './button.types';

export type CssVars = Record<string, string>;

export function resolveButtonCssVars(input: ResolveButtonRecipeInput = {}): CssVars {
  const r = resolveButtonRecipe(input);

  const px = (n: number) => `${n}px`;

  return {
    '--btn-bg': cssVar(r.bg.default),
    '--btn-bg-hover': cssVar(r.bg.hover),
    '--btn-bg-pressed': cssVar(r.bg.pressed),
    '--btn-bg-disabled': cssVar(r.bg.disabled),

    '--btn-fg': cssVar(r.fg.default),
    '--btn-fg-disabled': cssVar(r.fg.disabled),

    '--btn-border': cssVar(r.border.default),
    '--btn-border-hover': cssVar(r.border.hover),
    '--btn-border-disabled': cssVar(r.border.disabled),

    '--btn-focus-ring': cssVar(r.focusRing),
    '--btn-focus-ring-width': px(r.focusRingWidth),

    '--btn-height': px(r.height),
    '--btn-padding-x': cssVar(r.paddingX),
    '--btn-padding-y': cssVar(r.paddingY),
    '--btn-radius': cssVar(r.radius),
    '--btn-gap': cssVar(r.gap),

    '--btn-font-family': cssVar(r.fontFamily),
    '--btn-font-weight': cssVar(r.fontWeight),
    '--btn-font-size': cssVar(r.fontSize),
    '--btn-line-height': cssVar(r.lineHeight),

    '--btn-border-width': px(r.borderWidth),
    '--btn-icon-size': px(r.iconSize),
  };
}
