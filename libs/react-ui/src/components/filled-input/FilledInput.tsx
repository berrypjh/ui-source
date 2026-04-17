'use client';

import { cx } from '@berrypjh/ui-core';

import { InputBase } from '../input-base';
import { filledInputClasses } from './FilledInput.constants';
import type { FilledInputProps } from './FilledInput.types';
import './filled-input.scss';

export const FilledInput = ({ className, ref, ...rest }: FilledInputProps) => {
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
