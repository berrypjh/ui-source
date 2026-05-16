import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { FieldProps } from '../../types';

export type FormHelperTextOwnProps = Pick<FieldProps, 'disabled' | 'error' | 'size'> & {
  children?: ReactNode;
};

export type FormHelperTextProps = Omit<ComponentPropsWithRef<'p'>, 'children'> &
  FormHelperTextOwnProps;
