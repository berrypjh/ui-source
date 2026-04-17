'use client';

import { useFormControl } from '../form-control';
import { inputLabelClasses } from './InputLabel.constants';
import type { InputLabelProps } from './InputLabel.types';
import { getInputLabelClassNames } from './InputLabel.utils';
import './input-label.scss';

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
}: InputLabelProps) => {
  const formControl = useFormControl();

  const resolvedColor = color ?? formControl?.color ?? 'primary';
  const resolvedDisabled = disabled ?? formControl?.disabled ?? false;
  const resolvedError = error ?? formControl?.error ?? false;
  const resolvedFocused = focused ?? formControl?.focused ?? false;
  const resolvedRequired = required ?? formControl?.required ?? false;
  const resolvedSize = size ?? formControl?.size ?? 'md';

  const classNames = getInputLabelClassNames({
    className,
    color: resolvedColor,
    disabled: resolvedDisabled,
    error: resolvedError,
    focused: resolvedFocused,
    formControl,
    required: resolvedRequired,
    size: resolvedSize,
  });

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
