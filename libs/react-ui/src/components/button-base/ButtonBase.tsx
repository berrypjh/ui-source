import type { ButtonHTMLAttributes, ComponentPropsWithRef, ElementType, ReactNode } from 'react';
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
    ...rest
  } = props as ReactButtonProps<C> & {
    role?: string;
    tabIndex?: number;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  };

  const isLinkLike = href != null || to != null;

  const Component =
    component == null || component === 'button'
      ? ((isLinkLike ? 'a' : 'button') as ElementType)
      : (component as ElementType);

  const isNativeButton = Component === 'button';

  const classNames = cx(
    buttonBaseClasses.root,
    `ui-button--variant-${variant}`,
    `ui-button--size-${size}`,
    `ui-button--color-${color}`,
    fullWidth && 'ui-button--fullWidth',
    className,
  );

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
        tabIndex={tabIndex}
        disabled={disabled}
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
      className={classNames}
    >
      {children}
    </Component>
  );
};
