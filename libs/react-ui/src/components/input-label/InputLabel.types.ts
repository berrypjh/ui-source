import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { FieldProps } from '../../types';

export type InputLabelOwnProps = Pick<
  FieldProps,
  'color' | 'disabled' | 'error' | 'required' | 'size'
> & {
  children?: ReactNode;
  focused?: boolean;
};

export type InputLabelProps = Omit<ComponentPropsWithRef<'label'>, 'children'> & InputLabelOwnProps;
