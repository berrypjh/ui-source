'use client';

import type { ReactElement } from 'react';
import { cx } from '@berrypjh/ui-core';

import { InputBase, type InputBaseProps } from '../input-base';
import './filled-input.scss';

export const filledInputClasses = {
  root: 'ui-filled-input',
  input: 'ui-filled-input__input',
} as const;

export type FilledInputProps = InputBaseProps;

export const FilledInput = ({ className, ref, ...rest }: FilledInputProps): ReactElement | null => {
  return (
    <InputBase
      {...rest}
      ref={ref}
      className={cx(filledInputClasses.root, className)}
      inputClassName={filledInputClasses.input}
    />
  );
};

FilledInput.displayName = 'FilledInput';
