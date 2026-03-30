'use client';

import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';

import type {
  FieldColor,
  FieldMargin,
  FieldSize,
  FieldVariant,
  InputLikeChangeEventHandler,
  InputLikeFocusEventHandler,
} from '../../types';
import { BoxedInput } from '../boxed-input';
import { FilledInput } from '../filled-input';
import { FormControl, type FormControlProps } from '../form-control';
import { FormHelperText } from '../form-helper-text';
import { PlainInput } from '../plain-input';
import { InputLabel } from '../input-label';
import { Select } from '../select';
import './text-field.scss';

export const textFieldClasses = {
  root: 'ui-text-field',
} as const;

const variantComponent = {
  plain: PlainInput,
  filled: FilledInput,
  boxed: BoxedInput,
} as const;

export interface TextFieldProps
  extends Omit<
    FormControlProps<'div'>,
    | 'children'
    | 'color'
    | 'margin'
    | 'size'
    | 'variant'
    | 'defaultValue'
    | 'value'
    | 'onChange'
    | 'onFocus'
    | 'onBlur'
  > {
  autoComplete?: string;
  autoFocus?: boolean;
  children?: ReactNode;
  color?: FieldColor;
  defaultValue?: unknown;
  helperText?: ReactNode;
  id?: string;
  inputRef?: unknown;
  label?: ReactNode;
  margin?: FieldMargin;
  multiline?: boolean;
  name?: string;
  onBlur?: InputLikeFocusEventHandler;
  onChange?: InputLikeChangeEventHandler;
  onFocus?: InputLikeFocusEventHandler;
  placeholder?: string;
  rows?: number;
  select?: boolean;
  size?: FieldSize;
  type?: string;
  value?: unknown;
  variant?: FieldVariant;
}

export const TextField = ({
  autoComplete,
  autoFocus = false,
  children,
  className,
  color = 'primary',
  component,
  defaultValue,
  disabled = false,
  error = false,
  fullWidth = false,
  helperText,
  id: idProp,
  inputRef,
  label,
  margin = 'none',
  multiline = false,
  name,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  required = false,
  rows,
  select = false,
  size = 'md',
  type,
  value,
  variant = 'boxed',
  ref,
  ...rest
}: TextFieldProps): ReactElement | null => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const hasLabel = label != null && label !== '';
  const hasHelperText = helperText != null && helperText !== '';

  const helperTextId = hasHelperText ? `${id}-helper-text` : undefined;
  const InputComponent = variantComponent[variant];

  return (
    <FormControl
      {...rest}
      ref={ref}
      component={component}
      className={cx(textFieldClasses.root, className)}
      color={color}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      margin={margin}
      required={required}
      size={size}
      variant={variant}
    >
      {hasLabel ? <InputLabel htmlFor={id}>{label}</InputLabel> : null}

      {select ? (
        <Select
          aria-describedby={helperTextId}
          autoFocus={autoFocus}
          color={color}
          defaultValue={defaultValue}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          id={id}
          name={name}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          size={size}
          value={value}
          variant={variant}
        >
          {children}
        </Select>
      ) : (
        <InputComponent
          aria-describedby={helperTextId}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          color={color}
          defaultValue={defaultValue}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          id={id}
          inputRef={inputRef}
          multiline={multiline}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          rows={rows}
          size={size}
          type={type}
          value={value}
        />
      )}

      {hasHelperText ? <FormHelperText id={helperTextId}>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

TextField.displayName = 'TextField';
