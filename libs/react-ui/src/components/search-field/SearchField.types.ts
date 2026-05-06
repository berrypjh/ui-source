import type { FocusEventHandler, KeyboardEvent, ReactNode } from 'react';

import type { FieldVariant } from '../../types';
import type { BoxedInputProps } from '../boxed-input';
import type { FilledInputProps } from '../filled-input';
import type { PlainInputProps } from '../plain-input';

export type SearchFieldSuggestion = {
  id: string;
  label: string;
  value?: string;
  description?: ReactNode;
  disabled?: boolean;
};

export type SearchFieldBaseProps = Omit<
  PlainInputProps,
  'children' | 'startAdornment' | 'endAdornment' | 'type'
>;

export type SearchFieldProps = SearchFieldBaseProps & {
  variant?: FieldVariant;
  suggestions?: SearchFieldSuggestion[];
  clearable?: boolean;
  noSuggestionsText?: ReactNode;
  onClear?: () => void;
  onValueChange?: (value: string) => void;
  onSuggestionSelect?: (suggestion: SearchFieldSuggestion) => void;
};

export type SearchFieldInputProps = PlainInputProps | FilledInputProps | BoxedInputProps;

export type SearchFieldInputKeyDownHandler = NonNullable<
  NonNullable<PlainInputProps['inputProps']>['onKeyDown']
>;

export type SearchFieldSuggestionKeyDownHandler = (
  event: KeyboardEvent<HTMLButtonElement>,
  suggestion: SearchFieldSuggestion,
  index: number,
) => void;

export type SearchFieldWrapperBlurHandler = FocusEventHandler<HTMLDivElement>;
