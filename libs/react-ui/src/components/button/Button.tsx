import type { FC } from 'react';
import type { ButtonProps } from '@berrypjh/ui-core';
import { cx } from '@berrypjh/ui-core';

type NativeButtonAttrs = React.ButtonHTMLAttributes<HTMLButtonElement>;

type AttrsWithoutCollisions = Omit<NativeButtonAttrs, keyof ButtonProps | 'color'>;

export type ReactButtonProps = ButtonProps &
  AttrsWithoutCollisions & {
    className?: string;
  };

export const Button: FC<ReactButtonProps> = ({
  variant = 'solid',
  size = 'md',
  color = 'primary',
  disabled = false,
  fullWidth = false,
  className,
  type,
  children,
  ...rest
}) => {
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
