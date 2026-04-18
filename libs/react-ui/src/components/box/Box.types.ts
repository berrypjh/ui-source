import type { CSSProperties, HTMLAttributes } from 'react';
import type { BoxProps, BoxRadiusValue, BoxSpacingValue, ColorToken } from '@berrypjh/ui-core';

export type { BoxProps, BoxRadiusValue, BoxSpacingValue, ColorToken };

type HtmlDivProps = HTMLAttributes<HTMLDivElement>;

export type ReactBoxProps = BoxProps &
  Omit<HtmlDivProps, keyof BoxProps | 'color'> & {
    className?: string;
    style?: CSSProperties;
  };

export type BoxStyleProps = Pick<
  ReactBoxProps,
  | 'p'
  | 'px'
  | 'py'
  | 'pt'
  | 'pr'
  | 'pb'
  | 'pl'
  | 'm'
  | 'mx'
  | 'my'
  | 'mt'
  | 'mr'
  | 'mb'
  | 'ml'
  | 'bg'
  | 'radius'
>;
