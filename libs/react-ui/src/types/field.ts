import type {
  FieldColor,
  FieldMargin,
  FieldProps,
  FieldSize,
  FieldVariant,
  FormControlProps as CoreFormControlProps,
  InputFieldProps,
  TextFieldProps as CoreTextFieldProps,
} from '@berrypjh/ui-core';

import type { ChangeEventHandler, FocusEventHandler } from 'react';

export type {
  CoreFormControlProps,
  CoreTextFieldProps,
  FieldColor,
  FieldMargin,
  FieldProps,
  FieldSize,
  FieldVariant,
  InputFieldProps,
};

export type InputLikeElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type InputLikeFocusEventHandler = FocusEventHandler<InputLikeElement>;
export type InputLikeChangeEventHandler = ChangeEventHandler<InputLikeElement>;
