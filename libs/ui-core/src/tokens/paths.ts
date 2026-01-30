import type { Tokens } from './tokens';

type IsPlainObject<T> = T extends object ? (T extends readonly unknown[] ? false : true) : false;

export type LeafDotPath<T> = T extends object
  ? {
      [K in keyof T & string]: IsPlainObject<T[K]> extends true ? `${K}.${LeafDotPath<T[K]>}` : K;
    }[keyof T & string]
  : never;

export type ColorToken = LeafDotPath<Tokens['color']>;
export type SpacingToken = keyof Tokens['spacing'] & string;
export type RadiusToken = keyof Tokens['radius'] & string;
export type TypographyToken = LeafDotPath<Tokens['typography']>;
