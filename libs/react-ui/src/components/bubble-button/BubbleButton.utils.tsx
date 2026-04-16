import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';

import { bubbleButtonClasses } from './BubbleButton.constants';
import type {
  BubbleButtonAutoAnchorProps,
  BubbleButtonRenderableProps,
} from './BubbleButton.types';

/**
 * BubbleButton 컴포넌트에서 auto-anchor props인지 판별합니다.
 *
 * auto-anchor는 `component`를 명시하지 않았고, `href`가 존재하는 경우를 의미합니다.
 * 이 경우 `BubbleButtonBase`는 기본적으로 anchor 렌더링 경로를 탑니다.
 *
 * @param props 판별할 BubbleButton props
 * @returns auto-anchor props 여부
 */
export const isAutoAnchorProps = (
  props: BubbleButtonRenderableProps,
): props is BubbleButtonAutoAnchorProps => {
  return props.component == null && 'href' in props && props.href != null;
};

/**
 * BubbleButton wrapper style을 생성합니다.
 *
 * @param params BubbleButton delay
 * @returns 조합된 style
 */
export const getBubbleButtonWrapperStyle = ({
  delay,
}: Pick<BubbleButtonRenderableProps, 'delay'>): CSSProperties => {
  return {
    '--ui-bubble-delay': `${delay}s`,
  } as CSSProperties;
};

/**
 * BubbleButton root className 문자열을 생성합니다.
 *
 * @param params BubbleButton 시각적 상태와 추가 className
 * @returns 조합된 className 문자열
 */
export const getBubbleButtonRootClassNames = ({
  className,
  size,
}: {
  className?: string;
  size: 'sm' | 'md' | 'lg';
}) =>
  cx(
    bubbleButtonClasses.root,
    size === 'sm' && bubbleButtonClasses.sizeSm,
    size === 'md' && bubbleButtonClasses.sizeMd,
    size === 'lg' && bubbleButtonClasses.sizeLg,
    className,
  );

/**
 * BubbleButton content를 생성합니다.
 *
 * @param params BubbleButton icon과 label
 * @returns content
 */
export const getBubbleButtonContent = ({ icon, label }: { icon?: ReactNode; label: ReactNode }) => {
  return (
    <>
      <span className={bubbleButtonClasses.glow} aria-hidden="true" />
      <span className={bubbleButtonClasses.surface} aria-hidden="true">
        <span className={bubbleButtonClasses.border} />
        <span className={bubbleButtonClasses.highlight} />
      </span>
      <span className={bubbleButtonClasses.ring} aria-hidden="true" />

      <span className={bubbleButtonClasses.content}>
        {icon != null ? (
          <span className={bubbleButtonClasses.icon} aria-hidden="true">
            <span className={bubbleButtonClasses.iconGlow} />
            {icon}
          </span>
        ) : null}

        <span className={bubbleButtonClasses.label}>{label}</span>
      </span>
    </>
  );
};
