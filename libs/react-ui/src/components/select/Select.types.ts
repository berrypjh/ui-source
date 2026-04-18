import type {
  ComponentPropsWithRef,
  FocusEventHandler,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { FieldColor, FieldSize, FieldVariant } from '../../types';

export type SelectChangeEvent<Value = unknown> = {
  target: {
    name?: string;
    value: Value;
  };
};

export type SelectOpenCloseEvent =
  | Event
  | globalThis.MouseEvent
  | globalThis.KeyboardEvent
  | ReactMouseEvent<HTMLElement>
  | ReactKeyboardEvent<HTMLElement>;

export type SelectLikeChildProps = {
  value?: unknown;
  disabled?: boolean;
  children?: ReactNode;
};

export type SelectOptionElement = ReactElement<SelectLikeChildProps>;

export type SelectProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'onFocus'
> & {
  'aria-describedby'?: string;
  autoFocus?: boolean;
  children?: ReactNode;
  color?: FieldColor;
  defaultOpen?: boolean;
  defaultValue?: unknown;
  disabled?: boolean;
  displayEmpty?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  id?: string;
  labelId?: string;
  multiple?: boolean;
  name?: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onChange?: (event: SelectChangeEvent, child?: SelectOptionElement | null) => void;
  onClose?: (event?: SelectOpenCloseEvent) => void;
  onFocus?: FocusEventHandler<HTMLElement>;
  onOpen?: (event?: SelectOpenCloseEvent) => void;
  open?: boolean;
  placeholder?: ReactNode;
  renderValue?: (value: unknown) => ReactNode;
  required?: boolean;
  size?: FieldSize;
  value?: unknown;
  variant?: FieldVariant;
  ref?: Ref<HTMLDivElement>;
};
