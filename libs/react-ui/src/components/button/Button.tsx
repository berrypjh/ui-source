import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type { ButtonProps } from '@berrypjh/ui-core';
import { cx } from '@berrypjh/ui-core';

import './button.scss';

type ButtonOwnProps = ButtonProps & {
  className?: string;
  children?: ReactNode;
};

type PropsOf<C extends ElementType> = ComponentPropsWithRef<C>;

type ReactButtonProps<C extends ElementType = 'button'> = ButtonOwnProps & {
  component?: C;
} & Omit<PropsOf<C>, keyof ButtonOwnProps | 'component' | 'color'>;

export const Button = <C extends ElementType = 'button'>(props: ReactButtonProps<C>) => {
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
    ...rest
  } = props;

  const Component = (component ?? 'button') as ElementType;
  const isNativeButton = Component === 'button';

  const classNames = cx(
    'ui-button',
    `ui-button--variant-${variant}`,
    `ui-button--size-${size}`,
    `ui-button--color-${color}`,
    fullWidth && 'ui-button--fullWidth',
    className,
  );

  if (isNativeButton) {
    const nativeButtonProps = rest as Omit<
      ComponentPropsWithRef<'button'>,
      keyof ButtonOwnProps | 'component' | 'color'
    >;

    return (
      <button
        {...nativeButtonProps}
        ref={ref as ComponentPropsWithRef<'button'>['ref']}
        type={nativeButtonProps.type ?? 'button'}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={classNames}
      >
        {children}
      </button>
    );
  }

  const componentProps = rest as Omit<PropsOf<C>, keyof ButtonOwnProps | 'component' | 'color'>;

  return (
    <Component
      {...componentProps}
      ref={ref}
      aria-disabled={disabled || undefined}
      className={classNames}
    >
      {children}
    </Component>
  );
};
