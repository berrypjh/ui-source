import type { CSSProperties } from 'react';

import type { BoxRadiusValue, BoxSpacingValue, BoxStyleProps, ColorToken } from './Box.types';

/**
 * spacing 토큰 또는 숫자 값을 CSS spacing 값으로 변환합니다.
 *
 * 숫자는 px 단위로 변환하고,
 * 문자열 토큰은 디자인 토큰 CSS 변수로 변환합니다.
 *
 * @param value 변환할 spacing 값
 * @returns CSS spacing 문자열 또는 undefined
 */
export const spacingToCss = (value: BoxSpacingValue | undefined): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  return `var(--ds-spacing-${value})`;
};

/**
 * radius 토큰 또는 숫자 값을 CSS border-radius 값으로 변환합니다.
 *
 * 숫자는 px 단위로 변환하고,
 * 문자열 토큰은 디자인 토큰 CSS 변수로 변환합니다.
 *
 * @param value 변환할 radius 값
 * @returns CSS border-radius 문자열 또는 undefined
 */
export const radiusToCss = (value: BoxRadiusValue | undefined): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  return `var(--ds-radius-${value})`;
};

/**
 * 컬러 토큰을 디자인 토큰 CSS 변수 문자열로 변환합니다.
 *
 * 예를 들어 `primary.default` 같은 토큰은
 * `var(--ds-primary-default)` 형태로 변환됩니다.
 *
 * @param token 변환할 컬러 토큰
 * @returns CSS 변수 문자열 또는 undefined
 */
export const colorTokenToCssVar = (token: ColorToken | undefined): string | undefined => {
  if (!token) {
    return undefined;
  }

  return `var(--ds-${token.replaceAll('.', '-')})`;
};

/**
 * Box 스타일 props를 기반으로 실제 inline style 객체를 생성합니다.
 *
 * padding, margin, backgroundColor, borderRadius 값을 계산해
 * React에서 사용할 수 있는 CSSProperties 객체로 반환합니다.
 *
 * 우선순위는 다음과 같습니다.
 * - padding: 방향값 > 축약 축값 > 공통값
 * - margin: 방향값 > 축약 축값 > 공통값
 *
 * @param props Box 스타일 계산에 사용할 props
 * @returns 계산된 CSSProperties 객체
 */
export const getBoxComputedStyle = ({
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
}: BoxStyleProps): CSSProperties => {
  const computed: CSSProperties = {};

  const paddingTop = spacingToCss(pt ?? py ?? p);
  const paddingRight = spacingToCss(pr ?? px ?? p);
  const paddingBottom = spacingToCss(pb ?? py ?? p);
  const paddingLeft = spacingToCss(pl ?? px ?? p);

  if (paddingTop) {
    computed.paddingTop = paddingTop;
  }

  if (paddingRight) {
    computed.paddingRight = paddingRight;
  }

  if (paddingBottom) {
    computed.paddingBottom = paddingBottom;
  }

  if (paddingLeft) {
    computed.paddingLeft = paddingLeft;
  }

  const marginTop = spacingToCss(mt ?? my ?? m);
  const marginRight = spacingToCss(mr ?? mx ?? m);
  const marginBottom = spacingToCss(mb ?? my ?? m);
  const marginLeft = spacingToCss(ml ?? mx ?? m);

  if (marginTop) {
    computed.marginTop = marginTop;
  }

  if (marginRight) {
    computed.marginRight = marginRight;
  }

  if (marginBottom) {
    computed.marginBottom = marginBottom;
  }

  if (marginLeft) {
    computed.marginLeft = marginLeft;
  }

  const backgroundColor = colorTokenToCssVar(bg);

  if (backgroundColor) {
    computed.backgroundColor = backgroundColor;
  }

  const borderRadius = radiusToCss(radius);

  if (borderRadius) {
    computed.borderRadius = borderRadius;
  }

  return computed;
};
