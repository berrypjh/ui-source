export type FieldVariant = 'plain' | 'filled' | 'boxed';
export type FieldSize = 'sm' | 'md';
export type FieldMargin = 'none' | 'dense' | 'normal';
export type FieldColor = 'primary' | 'secondary';

export interface FieldProps {
  variant?: FieldVariant;
  size?: FieldSize;
  color?: FieldColor;

  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

export interface FormControlProps extends FieldProps {
  margin?: FieldMargin;
  hiddenLabel?: boolean;
}

export interface InputFieldProps extends FieldProps {
  autoFocus?: boolean;
  readOnly?: boolean;
  multiline?: boolean;
}

export interface TextFieldProps extends InputFieldProps {
  margin?: FieldMargin;
}
