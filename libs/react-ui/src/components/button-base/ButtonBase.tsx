import type {
  ButtonHTMLAttributes,
  ComponentPropsWithRef,
  ElementType,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { cx, type ButtonProps } from '@berrypjh/ui-core';

export const buttonBaseClasses = {
  root: 'ui-button',
} as const;

type ButtonOwnProps = ButtonProps & {
  className?: string;
  children?: ReactNode;
  href?: string;
  to?: string;
};

type PropsOf<C extends ElementType> = ComponentPropsWithRef<C>;

type PropsToOmit = keyof ButtonOwnProps | 'component' | 'color';

type ReactButtonProps<C extends ElementType = 'button'> = ButtonOwnProps & {
  component?: C;
} & Omit<PropsOf<C>, PropsToOmit>;

export const ButtonBase = <C extends ElementType = 'button'>(props: ReactButtonProps<C>) => {
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
    to,
    role,
    tabIndex,
    type,
    onClick,
    onKeyDown,
    onKeyUp,
    ...rest
  } = props as ReactButtonProps<C> & {
    role?: string;
    tabIndex?: number;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    onClick?: MouseEventHandler<HTMLElement>;
    onKeyDown?: KeyboardEventHandler<HTMLElement>;
    onKeyUp?: KeyboardEventHandler<HTMLElement>;
  };

  const isLinkLike = href != null || to != null;

  const Component =
    component == null || component === 'button'
      ? ((isLinkLike ? 'a' : 'button') as ElementType)
      : (component as ElementType);

  const isNativeButton = Component === 'button';
  const isNonNativeButton = !isNativeButton && !isLinkLike;

  const classNames = cx(
    buttonBaseClasses.root,
    `ui-button--variant-${variant}`,
    `ui-button--size-${size}`,
    `ui-button--color-${color}`,
    fullWidth && 'ui-button--fullWidth',
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
      PropsToOmit | 'type' | 'role' | 'tabIndex'
    >;

    return (
      <button
        {...nativeButtonProps}
        ref={ref as ComponentPropsWithRef<'button'>['ref']}
        type={type ?? 'button'}
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

  const componentProps = rest as Omit<PropsOf<C>, PropsToOmit | 'role' | 'tabIndex'>;

  const resolvedRole = isLinkLike ? role : (role ?? 'button');
  const resolvedTabIndex = disabled ? -1 : (tabIndex ?? (isLinkLike ? undefined : 0));

  return (
    <Component
      {...componentProps}
      ref={ref}
      href={href}
      to={to}
      role={resolvedRole}
      tabIndex={resolvedTabIndex}
      aria-disabled={disabled || undefined}
      onClick={handleNonNativeClick}
      onKeyDown={handleNonNativeKeyDown}
      onKeyUp={handleNonNativeKeyUp}
      className={classNames}
    >
      {children}
    </Component>
  );
};
