'use client';

import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';

import type { FieldColor, FieldSize } from '../../types';
import { useFormControl } from '../form-control';
import './input-label.scss';

export const inputLabelClasses = {
  root: 'ui-input-label',
  formControl: 'ui-input-label--form-control',
  focused: 'ui-input-label--focused',
  disabled: 'ui-input-label--disabled',
  error: 'ui-input-label--error',
  required: 'ui-input-label--required',
  sizeSm: 'ui-input-label--size-sm',
  sizeMd: 'ui-input-label--size-md',
  colorPrimary: 'ui-input-label--color-primary',
  colorSecondary: 'ui-input-label--color-secondary',
  asterisk: 'ui-input-label__asterisk',
} as const;

export interface InputLabelProps extends Omit<ComponentPropsWithRef<'label'>, 'children'> {
  children?: ReactNode;
  color?: FieldColor;
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  required?: boolean;
  size?: FieldSize;
}

export const InputLabel = ({
  children,
  className,
  color,
  disabled,
  error,
  focused,
  required,
  size,
  ref,
  ...rest
}: InputLabelProps): ReactElement | null => {
  const formControl = useFormControl();

  const resolvedColor = color ?? formControl?.color ?? 'primary';
  const resolvedDisabled = disabled ?? formControl?.disabled ?? false;
  const resolvedError = error ?? formControl?.error ?? false;
  const resolvedFocused = focused ?? formControl?.focused ?? false;
  const resolvedRequired = required ?? formControl?.required ?? false;
  const resolvedSize = size ?? formControl?.size ?? 'md';

  const classNames = cx(
    inputLabelClasses.root,
    formControl && inputLabelClasses.formControl,
    resolvedFocused && inputLabelClasses.focused,
    resolvedDisabled && inputLabelClasses.disabled,
    resolvedError && inputLabelClasses.error,
    resolvedRequired && inputLabelClasses.required,
    resolvedSize === 'sm' && inputLabelClasses.sizeSm,
    resolvedSize === 'md' && inputLabelClasses.sizeMd,
    resolvedColor === 'primary' && inputLabelClasses.colorPrimary,
    resolvedColor === 'secondary' && inputLabelClasses.colorSecondary,
    className,
  );

  return (
    <label {...rest} ref={ref} className={classNames}>
      {children}

      {resolvedRequired ? (
        <span className={inputLabelClasses.asterisk} aria-hidden="true">
          {' *'}
        </span>
      ) : null}
    </label>
  );
};

InputLabel.displayName = 'InputLabel';
