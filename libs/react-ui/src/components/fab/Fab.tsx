'use client';

import type { ElementType, ReactElement, ReactNode } from 'react';
import { cx, type ButtonColor, type ButtonSize } from '@berrypjh/ui-core';

import { ButtonBase, type ButtonBaseAutoAnchorProps, type ButtonBaseProps } from '../button-base';
import './fab.scss';

export const fabClasses = {
  root: 'ui-fab',
  circular: 'ui-fab--circular',
  extended: 'ui-fab--extended',
  sizeSm: 'ui-fab--size-sm',
  sizeMd: 'ui-fab--size-md',
  sizeLg: 'ui-fab--size-lg',
  colorPrimary: 'ui-fab--color-primary',
  colorSecondary: 'ui-fab--color-secondary',
  content: 'ui-fab__content',
  icon: 'ui-fab__icon',
  label: 'ui-fab__label',
} as const;

export type FabShape = 'circular' | 'extended';

type FabOwnProps = {
  children?: ReactNode;
  className?: string;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: FabShape;
  icon?: ReactNode;
  disableFocusRipple?: boolean;
};

export type FabProps<C extends ElementType = 'button'> = Omit<
  ButtonBaseProps<C>,
  'children' | 'size' | 'color' | 'variant' | 'fullWidth'
> &
  FabOwnProps;

export type FabAutoAnchorProps = Omit<
  ButtonBaseAutoAnchorProps,
  'children' | 'size' | 'color' | 'variant' | 'fullWidth'
> &
  FabOwnProps;

type FabRenderableProps = FabAutoAnchorProps | FabProps<ElementType>;

export const Fab = (props: FabRenderableProps): ReactElement | null => {
  const {
    component,
    className,
    children,
    color = 'primary',
    size = 'lg',
    shape = 'circular',
    icon,
    disableFocusRipple: _disableFocusRipple,
    disabled = false,
    ...rest
  } = props as FabRenderableProps;

  const classNames = cx(
    fabClasses.root,
    shape === 'circular' && fabClasses.circular,
    shape === 'extended' && fabClasses.extended,
    size === 'sm' && fabClasses.sizeSm,
    size === 'md' && fabClasses.sizeMd,
    size === 'lg' && fabClasses.sizeLg,
    color === 'primary' && fabClasses.colorPrimary,
    color === 'secondary' && fabClasses.colorSecondary,
    className,
  );

  return (
    <ButtonBase
      {...(rest as ButtonBaseAutoAnchorProps | ButtonBaseProps<ElementType>)}
      {...(component != null ? { component } : {})}
      className={classNames}
      disabled={disabled}
      variant="contained"
      size={size}
      color={color}
    >
      <span className={fabClasses.content}>
        {icon != null ? (
          <span className={fabClasses.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {children != null ? <span className={fabClasses.label}>{children}</span> : null}
      </span>
    </ButtonBase>
  );
};
