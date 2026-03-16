'use client';

import type { CSSProperties, ElementType, ReactElement, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';

import { ButtonBase, type ButtonBaseAutoAnchorProps, type ButtonBaseProps } from '../button-base';
import './bubble-button.scss';

export const bubbleButtonClasses = {
  wrapper: 'ui-bubble-button-wrapper',
  root: 'ui-bubble-button',
  sizeSm: 'ui-bubble-button--size-sm',
  sizeMd: 'ui-bubble-button--size-md',
  sizeLg: 'ui-bubble-button--size-lg',
  glow: 'ui-bubble-button__glow',
  surface: 'ui-bubble-button__surface',
  border: 'ui-bubble-button__border',
  highlight: 'ui-bubble-button__highlight',
  ring: 'ui-bubble-button__ring',
  content: 'ui-bubble-button__content',
  icon: 'ui-bubble-button__icon',
  iconGlow: 'ui-bubble-button__icon-glow',
  label: 'ui-bubble-button__label',
} as const;

type BubbleButtonOwnProps = {
  icon?: ReactNode;
  label: ReactNode;
  delay?: number;
};

export type BubbleButtonProps<C extends ElementType = 'button'> = Omit<
  ButtonBaseProps<C>,
  'children' | 'variant'
> &
  BubbleButtonOwnProps;

export type BubbleButtonAutoAnchorProps = Omit<ButtonBaseAutoAnchorProps, 'children' | 'variant'> &
  BubbleButtonOwnProps;

type BubbleButtonRenderableProps = BubbleButtonAutoAnchorProps | BubbleButtonProps<ElementType>;

export const BubbleButton = (props: BubbleButtonRenderableProps): ReactElement | null => {
  const {
    component,
    className,
    style,
    icon,
    label,
    size = 'md',
    delay = 0,
    disabled = false,
    ...rest
  } = props as BubbleButtonRenderableProps & {
    style?: CSSProperties;
  };

  const wrapperStyle = {
    '--ui-bubble-delay': `${delay}s`,
  } as CSSProperties;

  const rootClassNames = cx(
    bubbleButtonClasses.root,
    size === 'sm' && bubbleButtonClasses.sizeSm,
    size === 'md' && bubbleButtonClasses.sizeMd,
    size === 'lg' && bubbleButtonClasses.sizeLg,
    className,
  );

  return (
    <span
      className={bubbleButtonClasses.wrapper}
      style={wrapperStyle}
      data-disabled={disabled ? 'true' : undefined}
    >
      <ButtonBase
        {...(rest as ButtonBaseAutoAnchorProps | ButtonBaseProps<ElementType>)}
        {...(component != null ? { component } : {})}
        className={rootClassNames}
        style={style}
        disabled={disabled}
        size={size}
        variant="text"
      >
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
      </ButtonBase>
    </span>
  );
};
