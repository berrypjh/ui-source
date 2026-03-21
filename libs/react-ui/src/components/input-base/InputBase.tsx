'use client';

import { useEffect, useRef, useState } from 'react';
import type { ComponentPropsWithRef, MouseEventHandler, ReactElement, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';

import type {
  FieldColor,
  FieldSize,
  InputLikeChangeEventHandler,
  InputLikeElement,
  InputLikeFocusEventHandler,
} from '../../types';
import { useFormControl } from '../form-control';
import './input-base.scss';

export const inputBaseClasses = {
  root: 'ui-input-base',
  formControl: 'ui-input-base--form-control',
  input: 'ui-input-base__input',
  focused: 'ui-input-base--focused',
  disabled: 'ui-input-base--disabled',
  error: 'ui-input-base--error',
  fullWidth: 'ui-input-base--fullWidth',
  multiline: 'ui-input-base--multiline',
  adornedStart: 'ui-input-base--adorned-start',
  adornedEnd: 'ui-input-base--adorned-end',
  readOnly: 'ui-input-base--read-only',
  sizeSm: 'ui-input-base--size-sm',
  sizeMd: 'ui-input-base--size-md',
  inputSizeSm: 'ui-input-base__input--size-sm',
  inputHiddenLabel: 'ui-input-base__input--hidden-label',
  colorPrimary: 'ui-input-base--color-primary',
  colorSecondary: 'ui-input-base--color-secondary',
  startAdornment: 'ui-input-base__start-adornment',
  endAdornment: 'ui-input-base__end-adornment',
} as const;

type NativeInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'children' | 'defaultValue' | 'value'
>;

type NativeTextareaProps = Omit<
  ComponentPropsWithRef<'textarea'>,
  'children' | 'defaultValue' | 'value'
>;

type NativeInputFocusHandler = NonNullable<ComponentPropsWithRef<'input'>['onFocus']>;
type NativeInputBlurHandler = NonNullable<ComponentPropsWithRef<'input'>['onBlur']>;
type NativeInputChangeHandler = NonNullable<ComponentPropsWithRef<'input'>['onChange']>;

type NativeTextareaFocusHandler = NonNullable<ComponentPropsWithRef<'textarea'>['onFocus']>;
type NativeTextareaBlurHandler = NonNullable<ComponentPropsWithRef<'textarea'>['onBlur']>;
type NativeTextareaChangeHandler = NonNullable<ComponentPropsWithRef<'textarea'>['onChange']>;

export interface InputBaseProps
  extends Omit<
    ComponentPropsWithRef<'div'>,
    'children' | 'onChange' | 'onFocus' | 'onBlur' | 'defaultValue' | 'value'
  > {
  'aria-describedby'?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  children?: ReactNode;
  color?: FieldColor;
  defaultValue?: unknown;
  disabled?: boolean;
  endAdornment?: ReactNode;
  error?: boolean;
  fullWidth?: boolean;
  id?: string;
  inputClassName?: string;
  inputProps?: NativeInputProps;
  textareaProps?: NativeTextareaProps;
  inputRef?: unknown;
  multiline?: boolean;
  name?: string;
  onBlur?: InputLikeFocusEventHandler;
  onChange?: InputLikeChangeEventHandler;
  onFocus?: InputLikeFocusEventHandler;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rows?: number;
  size?: FieldSize;
  startAdornment?: ReactNode;
  type?: string;
  value?: unknown;
}

const assignRef = (ref: unknown, value: unknown) => {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref && typeof ref === 'object' && 'current' in ref) {
    (ref as { current: unknown }).current = value;
  }
};

const hasValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value != null && `${value}` !== '';
};

export const InputBase = ({
  'aria-describedby': ariaDescribedby,
  autoComplete,
  autoFocus = false,
  children,
  className,
  color,
  defaultValue,
  disabled,
  endAdornment,
  error,
  fullWidth,
  id,
  inputClassName,
  inputProps,
  textareaProps,
  inputRef,
  multiline = false,
  name,
  onBlur,
  onChange,
  onClick,
  onFocus,
  placeholder,
  readOnly = false,
  required,
  rows,
  size,
  startAdornment,
  type = 'text',
  value,
  ref,
  ...rest
}: InputBaseProps): ReactElement | null => {
  const formControl = useFormControl();
  const [focusedState, setFocusedState] = useState(false);
  const inputElementRef = useRef<InputLikeElement | null>(null);

  const hiddenLabel = Boolean(formControl?.hiddenLabel);

  const resolvedColor = color ?? formControl?.color ?? 'primary';
  const resolvedDisabled = disabled ?? formControl?.disabled ?? false;
  const resolvedError = error ?? formControl?.error ?? false;
  const resolvedFullWidth = fullWidth ?? formControl?.fullWidth ?? false;
  const resolvedRequired = required ?? formControl?.required ?? false;
  const resolvedSize = size ?? formControl?.size ?? 'md';
  const resolvedFocused = formControl?.focused ?? focusedState;

  useEffect(() => {
    formControl?.setAdornedStart(Boolean(startAdornment));
  }, [formControl, startAdornment]);

  useEffect(() => {
    if (hasValue(value ?? defaultValue)) {
      formControl?.onFilled();
    } else {
      formControl?.onEmpty();
    }
  }, [defaultValue, formControl, value]);

  useEffect(() => {
    if (!resolvedDisabled) {
      return;
    }

    const input = inputElementRef.current;

    if (input && input === document.activeElement) {
      input.blur();
    }

    if (!formControl) {
      setFocusedState(false);
    }
  }, [formControl, resolvedDisabled]);

  const handleFocus: InputLikeFocusEventHandler = (event) => {
    onFocus?.(event);

    if (formControl) {
      formControl.onFocus();
    } else {
      setFocusedState(true);
    }
  };

  const handleBlur: InputLikeFocusEventHandler = (event) => {
    onBlur?.(event);

    if (formControl) {
      formControl.onBlur();
    } else {
      setFocusedState(false);
    }
  };

  const handleChange: InputLikeChangeEventHandler = (event) => {
    const nextValue = event.target.value;

    if (hasValue(nextValue)) {
      formControl?.onFilled();
    } else {
      formControl?.onEmpty();
    }

    onChange?.(event);
  };

  const handleRootClick: MouseEventHandler<HTMLDivElement> = (event) => {
    onClick?.(event);

    if (resolvedDisabled) {
      return;
    }

    const input = inputElementRef.current;

    if (!input) {
      return;
    }

    if (event.target !== input) {
      input.focus();
    }
  };

  const handleNativeElementRef = (instance: unknown, externalRef?: unknown) => {
    inputElementRef.current = instance as InputLikeElement | null;
    assignRef(inputRef, instance);
    assignRef(externalRef, instance);
  };

  const handleInputRef = (instance: unknown) => {
    handleNativeElementRef(instance, inputProps?.ref);
  };

  const handleTextareaRef = (instance: unknown) => {
    handleNativeElementRef(instance, textareaProps?.ref);
  };

  const handleInputFocus: NativeInputFocusHandler = (event) => {
    inputProps?.onFocus?.(event);
    handleFocus(event);
  };

  const handleInputBlur: NativeInputBlurHandler = (event) => {
    inputProps?.onBlur?.(event);
    handleBlur(event);
  };

  const handleInputChange: NativeInputChangeHandler = (event) => {
    inputProps?.onChange?.(event);
    handleChange(event);
  };

  const handleTextareaFocus: NativeTextareaFocusHandler = (event) => {
    textareaProps?.onFocus?.(event);
    handleFocus(event);
  };

  const handleTextareaBlur: NativeTextareaBlurHandler = (event) => {
    textareaProps?.onBlur?.(event);
    handleBlur(event);
  };

  const handleTextareaChange: NativeTextareaChangeHandler = (event) => {
    textareaProps?.onChange?.(event);
    handleChange(event);
  };

  const rootClassNames = cx(
    inputBaseClasses.root,
    formControl && inputBaseClasses.formControl,
    resolvedFocused && inputBaseClasses.focused,
    resolvedDisabled && inputBaseClasses.disabled,
    resolvedError && inputBaseClasses.error,
    resolvedFullWidth && inputBaseClasses.fullWidth,
    multiline && inputBaseClasses.multiline,
    readOnly && inputBaseClasses.readOnly,
    Boolean(startAdornment) && inputBaseClasses.adornedStart,
    Boolean(endAdornment) && inputBaseClasses.adornedEnd,
    resolvedSize === 'sm' && inputBaseClasses.sizeSm,
    resolvedSize === 'md' && inputBaseClasses.sizeMd,
    resolvedColor === 'primary' && inputBaseClasses.colorPrimary,
    resolvedColor === 'secondary' && inputBaseClasses.colorSecondary,
    className,
  );

  const baseInputClassNames = cx(
    inputBaseClasses.input,
    resolvedSize === 'sm' && inputBaseClasses.inputSizeSm,
    hiddenLabel && inputBaseClasses.inputHiddenLabel,
    inputClassName,
  );

  const inputElementClassNames = cx(baseInputClassNames, inputProps?.className);
  const textareaElementClassNames = cx(baseInputClassNames, textareaProps?.className);

  const commonInputProps = {
    id,
    name,
    disabled: resolvedDisabled,
    readOnly,
    required: resolvedRequired,
    placeholder,
    autoComplete,
    autoFocus,
    'aria-describedby': ariaDescribedby,
  };

  const resolvedValue = Array.isArray(value)
    ? ''
    : (value as string | number | readonly string[] | undefined);

  const resolvedDefaultValue = Array.isArray(defaultValue)
    ? ''
    : (defaultValue as string | number | readonly string[] | undefined);

  return (
    <div
      {...rest}
      ref={ref as ComponentPropsWithRef<'div'>['ref']}
      className={rootClassNames}
      onClick={handleRootClick}
    >
      {startAdornment ? (
        <span className={inputBaseClasses.startAdornment}>{startAdornment}</span>
      ) : null}

      {multiline ? (
        <textarea
          {...textareaProps}
          {...commonInputProps}
          rows={textareaProps?.rows ?? rows}
          defaultValue={resolvedDefaultValue}
          value={resolvedValue}
          className={textareaElementClassNames}
          onFocus={handleTextareaFocus}
          onBlur={handleTextareaBlur}
          onChange={handleTextareaChange}
          ref={handleTextareaRef}
        />
      ) : (
        <input
          {...inputProps}
          {...commonInputProps}
          type={inputProps?.type ?? type}
          defaultValue={resolvedDefaultValue}
          value={resolvedValue}
          className={inputElementClassNames}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          ref={handleInputRef}
        />
      )}

      {endAdornment ? <span className={inputBaseClasses.endAdornment}>{endAdornment}</span> : null}

      {children}
    </div>
  );
};

InputBase.displayName = 'InputBase';
