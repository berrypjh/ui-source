import type { CSSProperties, HTMLAttributes } from 'react';
import type { BoxProps, BoxRadiusValue, BoxSpacingValue, ColorToken } from '@berrypjh/ui-core';
import { cx } from '@berrypjh/ui-core';

import './box.scss';

const spacingToCss = (v: BoxSpacingValue | undefined): string | undefined => {
  if (v === undefined) return undefined;
  if (typeof v === 'number') return `${v}px`;
  return `var(--ds-spacing-${v})`;
};

const radiusToCss = (v: BoxRadiusValue | undefined): string | undefined => {
  if (v === undefined) return undefined;
  if (typeof v === 'number') return `${v}px`;
  return `var(--ds-radius-${v})`;
};

const colorTokenToCssVar = (token: ColorToken | undefined): string | undefined => {
  if (!token) return undefined;
  return `var(--ds-${token.replaceAll('.', '-')})`;
};

type HtmlDivProps = HTMLAttributes<HTMLDivElement>;

export type ReactBoxProps = BoxProps &
  Omit<HtmlDivProps, keyof BoxProps | 'color'> & {
    className?: string;
    style?: CSSProperties;
  };

export const Box = ({
  className,
  style,
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  bg,
  radius,
  children,
  ...rest
}: ReactBoxProps) => {
  const computed: CSSProperties = {};

  // padding
  const pTop = spacingToCss(pt ?? py ?? p);
  const pRight = spacingToCss(pr ?? px ?? p);
  const pBottom = spacingToCss(pb ?? py ?? p);
  const pLeft = spacingToCss(pl ?? px ?? p);

  if (pTop) computed.paddingTop = pTop;
  if (pRight) computed.paddingRight = pRight;
  if (pBottom) computed.paddingBottom = pBottom;
  if (pLeft) computed.paddingLeft = pLeft;

  // margin
  const mTop = spacingToCss(mt ?? my ?? m);
  const mRight = spacingToCss(mr ?? mx ?? m);
  const mBottom = spacingToCss(mb ?? my ?? m);
  const mLeft = spacingToCss(ml ?? mx ?? m);

  if (mTop) computed.marginTop = mTop;
  if (mRight) computed.marginRight = mRight;
  if (mBottom) computed.marginBottom = mBottom;
  if (mLeft) computed.marginLeft = mLeft;

  // visuals
  const bgCss = colorTokenToCssVar(bg);
  if (bgCss) computed.backgroundColor = bgCss;

  const rCss = radiusToCss(radius);
  if (rCss) computed.borderRadius = rCss;

  const mergedStyle: CSSProperties = {
    ...computed,
    ...(style ?? {}),
  };

  return (
    <div {...rest} className={cx('ui-box', className)} style={mergedStyle}>
      {children}
    </div>
  );
};
