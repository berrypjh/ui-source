import type { ButtonHTMLAttributes } from 'react';
import type { ButtonProps } from '@berrypjh/ui-core';
import { cx } from '@berrypjh/ui-core';

import './button.scss';

type NativeButtonAttrs = ButtonHTMLAttributes<HTMLButtonElement>;
type AttrsWithoutCollisions = Omit<NativeButtonAttrs, keyof ButtonProps | 'color'>;

export type ReactButtonProps = ButtonProps &
  AttrsWithoutCollisions & {
    className?: string;
  };

export const Button = ({
  variant = 'contained',
  size = 'md',
  color = 'primary',
  disabled = false,
  fullWidth = false,
  className,
  type,
  children,
  ...rest
}: ReactButtonProps) => {
  const resolvedType = type ?? 'button';

  return (
    <button
      {...rest}
      type={resolvedType}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cx(
        'ui-button',
        `ui-button--variant-${variant}`,
        `ui-button--size-${size}`,
        `ui-button--color-${color}`,
        fullWidth && 'ui-button--fullWidth',
        className,
      )}
    >
      {children}
    </button>
  );
};
