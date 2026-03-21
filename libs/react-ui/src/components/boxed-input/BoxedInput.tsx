'use client';

import type { ReactElement } from 'react';
import { cx } from '@berrypjh/ui-core';

import { InputBase, type InputBaseProps } from '../input-base';
import './boxed-input.scss';

export const boxedInputClasses = {
  root: 'ui-boxed-input',
  input: 'ui-boxed-input__input',
} as const;

export type BoxedInputProps = InputBaseProps;

export const BoxedInput = ({ className, ref, ...rest }: BoxedInputProps): ReactElement | null => {
  return (
    <InputBase
      {...rest}
      ref={ref}
      className={cx(boxedInputClasses.root, className)}
      inputClassName={boxedInputClasses.input}
    />
  );
};

BoxedInput.displayName = 'BoxedInput';
