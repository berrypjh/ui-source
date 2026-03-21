'use client';

import type { ReactElement } from 'react';
import { cx } from '@berrypjh/ui-core';

import { InputBase, type InputBaseProps } from '../input-base';
import './plain-input.scss';

export const plainInputClasses = {
  root: 'ui-plain-input',
  input: 'ui-plain-input__input',
} as const;

export type PlainInputProps = InputBaseProps;

export const PlainInput = ({ className, ref, ...rest }: PlainInputProps): ReactElement | null => {
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
