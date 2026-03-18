'use client';

import { useId } from 'react';
import type { ElementType, ReactElement, ReactNode } from 'react';
import { cx, type ButtonColor, type ButtonSize } from '@berrypjh/ui-core';

import { ButtonBase, type ButtonBaseAutoAnchorProps, type ButtonBaseProps } from '../button-base';
import './icon-button.scss';

export const iconButtonClasses = {
  root: 'ui-icon-button',
  disabled: 'ui-icon-button--disabled',
  loading: 'ui-icon-button--loading',
  edgeStart: 'ui-icon-button--edge-start',
  edgeEnd: 'ui-icon-button--edge-end',
  colorPrimary: 'ui-icon-button--color-primary',
  colorSecondary: 'ui-icon-button--color-secondary',
  sizeSm: 'ui-icon-button--size-sm',
  sizeMd: 'ui-icon-button--size-md',
  sizeLg: 'ui-icon-button--size-lg',
  loadingWrapper: 'ui-icon-button__loading-wrapper',
  loadingIndicator: 'ui-icon-button__loading-indicator',
  spinner: 'ui-icon-button__spinner',
} as const;

export type IconButtonEdge = 'start' | 'end' | false;

type IconButtonOwnProps = {
  children?: ReactNode;
  className?: string;
  size?: ButtonSize;
  color?: ButtonColor;
  edge?: IconButtonEdge;
  loading?: boolean | null;
  loadingIndicator?: ReactNode;
  disableFocusRipple?: boolean;
};

export type IconButtonProps<C extends ElementType = 'button'> = Omit<
  ButtonBaseProps<C>,
  'children' | 'size' | 'color'
> &
  IconButtonOwnProps;

export type IconButtonAutoAnchorProps = Omit<
  ButtonBaseAutoAnchorProps,
  'children' | 'size' | 'color'
> &
  IconButtonOwnProps;

type IconButtonRenderableProps = IconButtonAutoAnchorProps | IconButtonProps<ElementType>;

export const IconButton = (props: IconButtonRenderableProps): ReactElement | null => {
  const {
    component,
    className,
    children,
    color = 'primary',
    size = 'md',
    edge = false,
    loading = null,
    loadingIndicator: loadingIndicatorProp,
    disableFocusRipple: _disableFocusRipple,
    disabled = false,
    id: idProp,
    ...rest
  } = props as IconButtonRenderableProps & {
    id?: string;
  };

  const generatedId = useId();
  const loadingId = idProp ?? generatedId;

  const classNames = cx(
    iconButtonClasses.root,
    (disabled || loading === true) && iconButtonClasses.disabled,
    loading === true && iconButtonClasses.loading,
    edge === 'start' && iconButtonClasses.edgeStart,
    edge === 'end' && iconButtonClasses.edgeEnd,
    color === 'primary' && iconButtonClasses.colorPrimary,
    color === 'secondary' && iconButtonClasses.colorSecondary,
    size === 'sm' && iconButtonClasses.sizeSm,
    size === 'md' && iconButtonClasses.sizeMd,
    size === 'lg' && iconButtonClasses.sizeLg,
    className,
  );

  const loadingIndicator = (
    <span
      className={iconButtonClasses.loadingIndicator}
      role="progressbar"
      aria-labelledby={loading === true ? loadingId : undefined}
    >
      {loadingIndicatorProp ?? <span className={iconButtonClasses.spinner} aria-hidden="true" />}
    </span>
  );

  const loadingWrapper =
    typeof loading === 'boolean' ? (
      <span className={iconButtonClasses.loadingWrapper}>{loading ? loadingIndicator : null}</span>
    ) : null;

  return (
    <ButtonBase
      {...(rest as ButtonBaseAutoAnchorProps | ButtonBaseProps<ElementType>)}
      {...(component != null ? { component } : {})}
      id={loading === true ? loadingId : idProp}
      className={classNames}
      disabled={disabled || loading === true}
      variant="text"
      size={size}
      color={color}
    >
      {loadingWrapper}
      {children}
    </ButtonBase>
  );
};

IconButton.displayName = 'IconButton';
