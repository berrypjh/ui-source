'use client';

import { cx } from '@berrypjh/ui-core';

import { InputBase } from '../input-base';
import { plainInputClasses } from './PlainInput.constants';
import type { PlainInputProps } from './PlainInput.types';
import './plain-input.scss';

export const PlainInput = ({ className, ref, ...rest }: PlainInputProps) => {
  return (
    <InputBase
      {...rest}
      ref={ref}
      className={cx(plainInputClasses.root, className)}
      inputClassName={plainInputClasses.input}
    />
  );
};

PlainInput.displayName = 'PlainInput';
