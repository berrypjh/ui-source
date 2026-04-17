import type { ComponentPropsWithRef, ReactNode } from 'react';

import type {
  FieldColor,
  FieldSize,
  InputLikeChangeEventHandler,
  InputLikeElement,
  InputLikeFocusEventHandler,
} from '../../types';

export type DataAttributes = {
  [K in `data-${string}`]?: string | number | boolean | undefined;
};

export type NativeInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'children' | 'defaultValue' | 'value'
> &
  DataAttributes;

export type NativeTextareaProps = Omit<
  ComponentPropsWithRef<'textarea'>,
  'children' | 'defaultValue' | 'value'
> &
  DataAttributes;

export type NativeInputFocusHandler = NonNullable<ComponentPropsWithRef<'input'>['onFocus']>;

export type NativeInputBlurHandler = NonNullable<ComponentPropsWithRef<'input'>['onBlur']>;

export type NativeInputChangeHandler = NonNullable<ComponentPropsWithRef<'input'>['onChange']>;

export type NativeTextareaFocusHandler = NonNullable<ComponentPropsWithRef<'textarea'>['onFocus']>;

export type NativeTextareaBlurHandler = NonNullable<ComponentPropsWithRef<'textarea'>['onBlur']>;

export type NativeTextareaChangeHandler = NonNullable<
  ComponentPropsWithRef<'textarea'>['onChange']
>;

export type InputDomValue = string | number | readonly string[] | undefined;

export type InputBaseOwnProps = {
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
};

export type InputBaseProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'onChange' | 'onFocus' | 'onBlur' | 'defaultValue' | 'value'
> &
  InputBaseOwnProps;

export type HandleNativeElementRef = (
  instance: InputLikeElement | null,
  externalRef?: unknown,
) => void;
