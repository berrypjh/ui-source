'use client';

import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';

import type { FieldSize } from '../../types';
import { useFormControl } from '../form-control';
import './form-helper-text.scss';

export const formHelperTextClasses = {
  root: 'ui-form-helper-text',
  disabled: 'ui-form-helper-text--disabled',
  error: 'ui-form-helper-text--error',
  sizeSm: 'ui-form-helper-text--size-sm',
  sizeMd: 'ui-form-helper-text--size-md',
} as const;

export interface FormHelperTextProps extends Omit<ComponentPropsWithRef<'p'>, 'children'> {
  children?: ReactNode;
  disabled?: boolean;
  error?: boolean;
  size?: FieldSize;
}

export const FormHelperText = ({
  children,
  className,
  disabled,
  error,
  size,
  ref,
  ...rest
}: FormHelperTextProps): ReactElement | null => {
  const formControl = useFormControl();

  const resolvedDisabled = disabled ?? formControl?.disabled ?? false;
  const resolvedError = error ?? formControl?.error ?? false;
  const resolvedSize = size ?? formControl?.size ?? 'md';

  const classNames = cx(
    formHelperTextClasses.root,
    resolvedDisabled && formHelperTextClasses.disabled,
    resolvedError && formHelperTextClasses.error,
    resolvedSize === 'sm' && formHelperTextClasses.sizeSm,
    resolvedSize === 'md' && formHelperTextClasses.sizeMd,
    className,
  );

  return (
    <p {...rest} ref={ref} className={classNames}>
      {children === ' ' ? <span aria-hidden="true">{'\u200B'}</span> : children}
    </p>
  );
};

FormHelperText.displayName = 'FormHelperText';
