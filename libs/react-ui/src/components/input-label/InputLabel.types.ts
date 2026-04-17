import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { FieldColor, FieldSize } from '../../types';

export type InputLabelOwnProps = {
  children?: ReactNode;
  color?: FieldColor;
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  required?: boolean;
  size?: FieldSize;
};

export type InputLabelProps = Omit<ComponentPropsWithRef<'label'>, 'children'> & InputLabelOwnProps;
