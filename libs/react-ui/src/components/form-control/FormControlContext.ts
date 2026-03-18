import { createContext } from 'react';

import type { FieldColor, FieldMargin, FieldSize, FieldVariant } from '../../types';

export interface FormControlContextValue {
  color: FieldColor;
  disabled: boolean;
  error: boolean;
  focused: boolean;
  filled: boolean;
  fullWidth: boolean;
  hiddenLabel: boolean;
  margin: FieldMargin;
  required: boolean;
  size: FieldSize;
  variant: FieldVariant;
  adornedStart: boolean;
  setAdornedStart: (value: boolean) => void;
  onFocus: () => void;
  onBlur: () => void;
  onFilled: () => void;
  onEmpty: () => void;
}

export const FormControlContext = createContext<FormControlContextValue | undefined>(undefined);
