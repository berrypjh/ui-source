import type { ChangeEventHandler, ElementType, FocusEventHandler, ReactNode } from 'react';
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

export type {
  FieldColor,
  FieldMargin,
  FieldProps,
  FieldSize,
  FieldVariant,
  CoreFormControlProps,
  InputFieldProps,
  CoreTextFieldProps,
};

export type InputLikeElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type InputLikeFocusEventHandler = FocusEventHandler<InputLikeElement>;
export type InputLikeChangeEventHandler = ChangeEventHandler<InputLikeElement>;

export type SlotPropsResolver<OwnerState, Props extends Record<string, unknown>> =
  | Props
  | ((ownerState: OwnerState) => Props);

export type SlotCommonProps = {
  className?: string;
  component?: ElementType;
  ref?: unknown;
  children?: ReactNode;
} & Record<string, unknown>;
