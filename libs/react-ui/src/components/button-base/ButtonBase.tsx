'use client';

import { createElement } from 'react';

import type { ButtonBaseRenderableProps } from './ButtonBase.types';
import {
  createNonNativeClickHandler,
  createNonNativeKeyDownHandler,
  createNonNativeKeyUpHandler,
  getButtonBaseClassNames,
  isAutoAnchorProps,
  isNativeButtonProps,
} from './ButtonBase.utils';
import './button-base.scss';

export const buttonBaseClasses = {
  root: 'ui-button',
} as const;

export const ButtonBase = (props: ButtonBaseRenderableProps) => {
  if (isNativeButtonProps(props)) {
    const {
      component: _component,
      ref,
      variant = 'contained',
      size = 'md',
      color = 'primary',
      disabled = false,
      fullWidth = false,
      className,
      children,
      role,
      tabIndex,
      type = 'button',
      ...rest
    } = props;

    const classNames = getButtonBaseClassNames({
      variant,
      size,
      color,
      fullWidth,
      className,
    });

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        role={role}
        tabIndex={disabled ? -1 : tabIndex}
        disabled={disabled}
        className={classNames}
      >
        {children}
      </button>
    );
  }

  if (isAutoAnchorProps(props)) {
    const {
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
    } = props;

    const classNames = getButtonBaseClassNames({
      variant,
      size,
      color,
      fullWidth,
      className,
    });

    return (
      <a
        {...rest}
        href={href}
        {...(type != null ? { type } : {})}
        ref={ref}
        role={role}
        tabIndex={disabled ? -1 : tabIndex}
        aria-disabled={disabled || undefined}
        onClick={createNonNativeClickHandler({
          disabled,
          onClick,
        })}
        onKeyDown={createNonNativeKeyDownHandler({
          disabled,
          activateWithKeyboard: false,
          onKeyDown,
        })}
        onKeyUp={createNonNativeKeyUpHandler({
          disabled,
          activateWithKeyboard: false,
          onKeyUp,
        })}
        className={classNames}
      >
        {children}
      </a>
    );
  }

  const {
    component: Component,
    ref,
    variant = 'contained',
    size = 'md',
    color = 'primary',
    disabled = false,
    fullWidth = false,
    className,
    children,
    href,
    to,
    role,
    tabIndex,
    type,
    onClick,
    onKeyDown,
    onKeyUp,
    ...rest
  } = props;

  const classNames = getButtonBaseClassNames({
    variant,
    size,
    color,
    fullWidth,
    className,
  });

  const isLinkLike = href != null || to != null;
  const resolvedRole = isLinkLike ? role : (role ?? 'button');
  const resolvedTabIndex = disabled ? -1 : (tabIndex ?? (isLinkLike ? undefined : 0));

  return createElement(
    Component,
    {
      ...rest,
      ...(href != null ? { href } : {}),
      ...(to != null ? { to } : {}),
      ...(type != null ? { type } : {}),
      ref,
      role: resolvedRole,
      tabIndex: resolvedTabIndex,
      'aria-disabled': disabled || undefined,
      onClick: createNonNativeClickHandler({
        disabled,
        onClick,
      }),
      onKeyDown: createNonNativeKeyDownHandler({
        disabled,
        activateWithKeyboard: !isLinkLike,
        onKeyDown,
      }),
      onKeyUp: createNonNativeKeyUpHandler({
        disabled,
        activateWithKeyboard: !isLinkLike,
        onKeyUp,
      }),
      className: classNames,
    },
    children,
  );
};

ButtonBase.displayName = 'ButtonBase';
