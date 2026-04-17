'use client';

import { cx } from '@berrypjh/ui-core';

import { InputBase } from '../input-base';
import { boxedInputClasses } from './BoxedInput.constants';
import type { BoxedInputProps } from './BoxedInput.types';
import './boxed-input.scss';

export const BoxedInput = ({ className, ref, ...rest }: BoxedInputProps) => {
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
