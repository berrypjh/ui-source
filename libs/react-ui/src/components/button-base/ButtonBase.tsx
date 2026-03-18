'use client';

import type {
  AriaRole,
  ButtonHTMLAttributes,
  ComponentPropsWithRef,
  ElementType,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import { cx, type ButtonProps as CoreButtonProps } from '@berrypjh/ui-core';

import type { PolymorphicComponentPropsWithRef } from '../../types';
import './button-base.scss';

export const buttonBaseClasses = {
  root: 'ui-button',
} as const;

export type ButtonBaseOwnProps = CoreButtonProps & {
  className?: string;
  children?: ReactNode;
};

export type ButtonBaseProps<C extends ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  ButtonBaseOwnProps
>;

export type ButtonBaseAutoAnchorProps = Omit<ButtonBaseProps<'a'>, 'component'> & {
  component?: never;
  href: NonNullable<ComponentPropsWithRef<'a'>['href']>;
};

type ButtonBaseRenderableProps = ButtonBaseAutoAnchorProps | ButtonBaseProps<ElementType>;

type ButtonBaseImplementationProps = ButtonBaseOwnProps & {
  component?: ElementType;
  ref?: unknown;
  href?: ComponentPropsWithRef<'a'>['href'];
  role?: AriaRole;
  tabIndex?: number;
  type?: unknown;
  onClick?: MouseEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onKeyUp?: KeyboardEventHandler<HTMLElement>;
} & Record<string, unknown>;

export const ButtonBase = (props: ButtonBaseRenderableProps): ReactElement | null => {
  const {
    component,
    ref,
    variant = 'contained',
    size = 'md',
    color = 'primary',
    disabled = false,
    fullWidth = false,
    className,
    children,
    href,
    role,
    tabIndex,
    type,
    onClick,
    onKeyDown,
    onKeyUp,
    ...rest
  } = props as ButtonBaseImplementationProps;

  const hasToProp = 'to' in rest && rest.to != null;
  const isLinkLike = href != null || hasToProp;

  const Component = component ?? (href != null ? 'a' : 'button');

  const isNativeButton = Component === 'button';
  const isNonNativeButton = !isNativeButton && !isLinkLike;

  const classNames = cx(
    buttonBaseClasses.root,
    `${buttonBaseClasses.root}--variant-${variant}`,
    `${buttonBaseClasses.root}--size-${size}`,
    `${buttonBaseClasses.root}--color-${color}`,
    fullWidth && `${buttonBaseClasses.root}--fullWidth`,
    className,
  );

  const handleNonNativeClick: MouseEventHandler<HTMLElement> = (event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  const handleNonNativeKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || !isNonNativeButton) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const handleNonNativeKeyUp: KeyboardEventHandler<HTMLElement> = (event) => {
    onKeyUp?.(event);

    if (event.defaultPrevented || disabled || !isNonNativeButton) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  if (isNativeButton) {
    const nativeButtonProps = rest as Omit<
      ComponentPropsWithRef<'button'>,
      | keyof ButtonBaseOwnProps
      | 'component'
      | 'ref'
      | 'href'
      | 'role'
      | 'tabIndex'
      | 'type'
      | 'onClick'
      | 'onKeyDown'
      | 'onKeyUp'
    >;

    return (
      <button
        {...nativeButtonProps}
        ref={ref as ComponentPropsWithRef<'button'>['ref']}
        type={(type as ButtonHTMLAttributes<HTMLButtonElement>['type']) ?? 'button'}
        role={role}
        tabIndex={disabled ? -1 : tabIndex}
        disabled={disabled}
        onClick={onClick as ComponentPropsWithRef<'button'>['onClick']}
        onKeyDown={onKeyDown as ComponentPropsWithRef<'button'>['onKeyDown']}
        onKeyUp={onKeyUp as ComponentPropsWithRef<'button'>['onKeyUp']}
        className={classNames}
      >
        {children}
      </button>
    );
  }

  const componentProps = rest as Omit<
    ComponentPropsWithRef<ElementType>,
    | keyof ButtonBaseOwnProps
    | 'component'
    | 'ref'
    | 'href'
    | 'role'
    | 'tabIndex'
    | 'type'
    | 'onClick'
    | 'onKeyDown'
    | 'onKeyUp'
  >;

  const resolvedRole = isLinkLike ? role : (role ?? 'button');
  const resolvedTabIndex = disabled ? -1 : (tabIndex ?? (isLinkLike ? undefined : 0));

  const ComponentTag = Component as ElementType;

  return (
    <ComponentTag
      {...componentProps}
      {...(href != null ? { href } : {})}
      {...(type != null ? { type } : {})}
      ref={ref as never}
      role={resolvedRole}
      tabIndex={resolvedTabIndex}
      aria-disabled={disabled || undefined}
      onClick={handleNonNativeClick}
      onKeyDown={handleNonNativeKeyDown}
      onKeyUp={handleNonNativeKeyUp}
      className={classNames}
    >
      {children}
    </ComponentTag>
  );
};

ButtonBase.displayName = 'ButtonBase';
