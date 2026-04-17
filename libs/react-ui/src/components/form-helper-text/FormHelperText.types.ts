import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { FieldSize } from '../../types';

export type FormHelperTextOwnProps = {
  children?: ReactNode;
  disabled?: boolean;
  error?: boolean;
  size?: FieldSize;
};

export type FormHelperTextProps = Omit<ComponentPropsWithRef<'p'>, 'children'> &
  FormHelperTextOwnProps;
