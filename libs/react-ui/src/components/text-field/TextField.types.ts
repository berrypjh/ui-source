import type { ReactNode } from 'react';

import type {
  CoreTextFieldProps,
  InputLikeChangeEventHandler,
  InputLikeFocusEventHandler,
} from '../../types';
import type { FormControlProps } from '../form-control';

export type TextFieldOwnProps = CoreTextFieldProps & {
  autoComplete?: string;
  children?: ReactNode;
  defaultValue?: unknown;
  helperText?: ReactNode;
  id?: string;
  inputRef?: unknown;
  label?: ReactNode;
  name?: string;
  onBlur?: InputLikeFocusEventHandler;
  onChange?: InputLikeChangeEventHandler;
  onFocus?: InputLikeFocusEventHandler;
  placeholder?: string;
  rows?: number;
  select?: boolean;
  type?: string;
  value?: unknown;
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
