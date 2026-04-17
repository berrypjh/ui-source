import type { ReactNode } from 'react';

import type {
  FieldColor,
  FieldMargin,
  FieldSize,
  FieldVariant,
  InputLikeChangeEventHandler,
  InputLikeFocusEventHandler,
} from '../../types';
import type { FormControlProps } from '../form-control';

export type TextFieldOwnProps = {
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
};

export type TextFieldProps = Omit<
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
> &
  TextFieldOwnProps;
