import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { ResolveButtonRecipeInput } from '@berrypjh/ui-core';

export interface ButtonProps extends ResolveButtonRecipeInput {
  variant?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';

  fullWidth?: boolean;
  radiusTokenKey?: string;

  disabled?: boolean;

  loading?: boolean;

  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    radiusTokenKey = 'radius.md',
    children,
    disabled,
    loading,
  },
  ref,
) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <button ref={ref} onClick={() => console.log('first')} disabled={isDisabled} type="button">
      <span>{children}</span>
    </button>
  );
});
