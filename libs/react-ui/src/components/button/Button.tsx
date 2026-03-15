'use client';

import { useId } from 'react';
import type { ElementType, ReactElement, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';

import { ButtonBase, type ButtonBaseAutoAnchorProps, type ButtonBaseProps } from '../button-base';

import './button.scss';

export const buttonClasses = {
  root: 'ui-button-root',
  label: 'ui-button__label',
  icon: 'ui-button__icon',
  startIcon: 'ui-button__start-icon',
  endIcon: 'ui-button__end-icon',
  loading: 'ui-button--loading',
  loadingWrapper: 'ui-button__loading-wrapper',
  loadingIndicator: 'ui-button__loading-indicator',
  loadingIconPlaceholder: 'ui-button__loading-icon-placeholder',
  spinner: 'ui-button__spinner',
  loadingPositionStart: 'ui-button--loading-position-start',
  loadingPositionCenter: 'ui-button--loading-position-center',
  loadingPositionEnd: 'ui-button--loading-position-end',
} as const;

export type ButtonLoadingPosition = 'start' | 'center' | 'end';

type ButtonExtraProps = {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  loadingIndicator?: ReactNode;
  loadingPosition?: ButtonLoadingPosition;
};

export type ButtonProps<C extends ElementType = 'button'> = ButtonBaseProps<C> & ButtonExtraProps;
export type ButtonAutoAnchorProps = ButtonBaseAutoAnchorProps & ButtonExtraProps;

type ButtonRenderableProps = ButtonAutoAnchorProps | ButtonProps<ElementType>;

type ButtonComponent = {
  <C extends ElementType = 'button'>(props: ButtonProps<C>): ReactElement | null;
  (props: ButtonAutoAnchorProps): ReactElement | null;
};

export const Button: ButtonComponent = (props: ButtonRenderableProps) => {
  const {
    component,
    className,
    children,
    startIcon: startIconProp,
    endIcon: endIconProp,
    loading = false,
    loadingIndicator: loadingIndicatorProp,
    loadingPosition = 'center',
    disabled = false,
    ...rest
  } = props;

  const labelId = useId();

  const classNames = cx(
    buttonClasses.root,
    loading && buttonClasses.loading,
    loading && loadingPosition === 'start' && buttonClasses.loadingPositionStart,
    loading && loadingPosition === 'center' && buttonClasses.loadingPositionCenter,
    loading && loadingPosition === 'end' && buttonClasses.loadingPositionEnd,
    className,
  );

  const startIcon =
    startIconProp != null || (loading && loadingPosition === 'start') ? (
      <span className={cx(buttonClasses.icon, buttonClasses.startIcon)} aria-hidden="true">
        {startIconProp ?? <span className={buttonClasses.loadingIconPlaceholder} />}
      </span>
    ) : null;

  const endIcon =
    endIconProp != null || (loading && loadingPosition === 'end') ? (
      <span className={cx(buttonClasses.icon, buttonClasses.endIcon)} aria-hidden="true">
        {endIconProp ?? <span className={buttonClasses.loadingIconPlaceholder} />}
      </span>
    ) : null;

  const loadingIndicator = (
    <span
      className={buttonClasses.loadingIndicator}
      role="progressbar"
      aria-labelledby={children != null ? labelId : undefined}
    >
      {loadingIndicatorProp ?? <span className={buttonClasses.spinner} aria-hidden="true" />}
    </span>
  );

  const loader = loading ? (
    <span className={buttonClasses.loadingWrapper}>{loadingIndicator}</span>
  ) : null;

  const content =
    children != null ? (
      <span id={labelId} className={buttonClasses.label}>
        {children}
      </span>
    ) : null;

  return (
    <ButtonBase
      {...(rest as ButtonBaseAutoAnchorProps | ButtonBaseProps<ElementType>)}
      {...(component != null ? { component } : {})}
      className={classNames}
      disabled={disabled || loading}
    >
      {startIcon}
      {loadingPosition !== 'end' ? loader : null}
      {content}
      {loadingPosition === 'end' ? loader : null}
      {endIcon}
    </ButtonBase>
  );
};
