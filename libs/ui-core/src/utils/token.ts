import type {
  ColorToken,
  LeafDotPath,
  PathValue,
  RadiusToken,
  SpacingToken,
  TypographyToken,
  Tokens,
  Theme,
} from '../tokens';

const readPath = (obj: unknown, path: string): unknown => {
  const parts = path.split('.');
  let cur: any = obj;

  for (const p of parts) {
    if (cur == null || (typeof cur !== 'object' && typeof cur !== 'function')) {
      throw new Error(`getToken: cannot read "${path}" (stuck at "${p}")`);
    }
    cur = cur[p];
  }

  return cur;
};

export const getToken = <TObj, P extends LeafDotPath<TObj>>(
  obj: TObj,
  path: P,
): PathValue<TObj, P> => {
  return readPath(obj, path) as PathValue<TObj, P>;
};

export const getColor = (theme: Theme<Tokens>, key: ColorToken): string => {
  return getToken(theme.tokens.color, key);
};

export const getSpacing = (theme: Theme<Tokens>, key: SpacingToken): number => {
  return theme.tokens.spacing[key];
};

export const getRadius = (theme: Theme<Tokens>, key: RadiusToken): number => {
  return theme.tokens.radius[key];
};

export const getTypography = (theme: Theme<Tokens>, key: TypographyToken): string | number => {
  return getToken(theme.tokens.typography, key);
};
