'use client';

import { useFormControl } from '../form-control';

import type { FormHelperTextProps } from './FormHelperText.types';
import { getFormHelperTextClassNames, getFormHelperTextContent } from './FormHelperText.utils';

import './form-helper-text.scss';

export const FormHelperText = ({
  children,
  className,
  disabled,
  error,
  size,
  ref,
  ...rest
}: FormHelperTextProps) => {
  const formControl = useFormControl();

  const resolvedDisabled = disabled ?? formControl?.disabled ?? false;
  const resolvedError = error ?? formControl?.error ?? false;
  const resolvedSize = size ?? formControl?.size ?? 'md';

  const classNames = getFormHelperTextClassNames({
    className,
    disabled: resolvedDisabled,
    error: resolvedError,
    size: resolvedSize,
  });

  const content = getFormHelperTextContent({
    children,
  });

  return (
    <p {...rest} ref={ref} className={classNames}>
      {content}
    </p>
  );
};

FormHelperText.displayName = 'FormHelperText';
