export type FieldVariant = 'standard' | 'filled' | 'outlined';
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
  readOnly?: boolean;
}

export interface TextFieldProps extends InputFieldProps {
  margin?: FieldMargin;
  multiline?: boolean;
}
