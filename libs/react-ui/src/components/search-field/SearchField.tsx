'use client';

import { useId, useMemo, useRef, useState } from 'react';
import type { FocusEventHandler, KeyboardEvent, ReactElement, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';

import type {
  InputLikeChangeEventHandler,
  InputLikeElement,
  InputLikeFocusEventHandler,
} from '../../types';
import { PlainInput, type PlainInputProps } from '../plain-input';
import { FilledInput, type FilledInputProps } from '../filled-input';
import { BoxedInput, type BoxedInputProps } from '../boxed-input';
import { assignRef } from '../../utils';
import './search-field.scss';

export const searchFieldClasses = {
  root: 'ui-search-field',
  input: 'ui-search-field__input',
  icon: 'ui-search-field__icon',
  clear: 'ui-search-field__clear',
  suggestions: 'ui-search-field__suggestions',
  suggestionsOpen: 'ui-search-field__suggestions--open',
  suggestion: 'ui-search-field__suggestion',
  suggestionButton: 'ui-search-field__suggestion-button',
  suggestionIcon: 'ui-search-field__suggestion-icon',
  suggestionContent: 'ui-search-field__suggestion-content',
  suggestionLabel: 'ui-search-field__suggestion-label',
  suggestionDescription: 'ui-search-field__suggestion-description',
  suggestionDisabled: 'ui-search-field__suggestion--disabled',
  empty: 'ui-search-field__empty',
} as const;

export type SearchFieldVariant = 'plain' | 'filled' | 'boxed';

export interface SearchFieldSuggestion {
  id: string;
  label: string;
  value?: string;
  description?: ReactNode;
  disabled?: boolean;
}

type SearchFieldBaseProps = Omit<
  PlainInputProps,
  'children' | 'startAdornment' | 'endAdornment' | 'type'
>;

export interface SearchFieldProps extends SearchFieldBaseProps {
  variant?: SearchFieldVariant;
  suggestions?: SearchFieldSuggestion[];
  clearable?: boolean;
  noSuggestionsText?: ReactNode;
  onClear?: () => void;
  onValueChange?: (value: string) => void;
  onSuggestionSelect?: (suggestion: SearchFieldSuggestion) => void;
}

const variantComponent = {
  plain: PlainInput,
  filled: FilledInput,
  boxed: BoxedInput,
} as const satisfies Record<
  SearchFieldVariant,
  (props: PlainInputProps | FilledInputProps | BoxedInputProps) => ReactElement | null
>;

const toInputString = (value: unknown): string => {
  if (Array.isArray(value)) {
    return '';
  }

  if (value == null) {
    return '';
  }

  return String(value);
};

export const SearchField = ({
  className,
  defaultValue,
  value,
  onBlur,
  onChange,
  onFocus,
  inputProps,
  inputRef,
  placeholder = 'Search',
  variant = 'boxed',
  suggestions = [],
  clearable = true,
  noSuggestionsText,
  onClear,
  onValueChange,
  onSuggestionSelect,
  ...rest
}: SearchFieldProps): ReactElement | null => {
  const listboxId = useId();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputElementRef = useRef<InputLikeElement | null>(null);
  const suggestionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(() => toInputString(defaultValue));

  const InputComponent = variantComponent[variant];
  const isControlled = value !== undefined;
  const currentValue = isControlled ? toInputString(value) : uncontrolledValue;

  const visibleSuggestions = useMemo(() => suggestions, [suggestions]);

  const hasSuggestions = visibleSuggestions.length > 0;
  const expanded = open && hasSuggestions;
  const showEmptyState = open && !hasSuggestions && noSuggestionsText != null;

  const handleValueChange = (nextValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  const handleInputRef = (instance: unknown) => {
    inputElementRef.current = instance as InputLikeElement | null;
    assignRef(inputRef, instance);
  };

  const handleFocus: InputLikeFocusEventHandler = (event) => {
    onFocus?.(event);
  };

  const handleBlur: InputLikeFocusEventHandler = (event) => {
    onBlur?.(event);
  };

  const handleWrapperFocus: FocusEventHandler<HTMLDivElement> = () => {
    setOpen(true);
  };

  const handleWrapperBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    const nextFocused = event.relatedTarget;

    if (nextFocused instanceof Node && wrapperRef.current?.contains(nextFocused)) {
      return;
    }

    setOpen(false);
  };

  const handleChange: InputLikeChangeEventHandler = (event) => {
    const nextValue = event.target.value;

    handleValueChange(nextValue);
    onChange?.(event);

    if (!open) {
      setOpen(true);
    }
  };

  const handleSuggestionSelect = (suggestion: SearchFieldSuggestion) => {
    if (suggestion.disabled) {
      return;
    }

    const nextValue = suggestion.value ?? suggestion.label;

    handleValueChange(nextValue);
    onSuggestionSelect?.(suggestion);
    setOpen(false);
    inputElementRef.current?.focus();
  };

  const handleInputKeyDown: NonNullable<NonNullable<PlainInputProps['inputProps']>['onKeyDown']> = (
    event,
  ) => {
    inputProps?.onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' && hasSuggestions) {
      event.preventDefault();
      setOpen(true);
      window.requestAnimationFrame(() => {
        suggestionRefs.current[0]?.focus();
      });
    }
  };

  const handleSuggestionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    suggestion: SearchFieldSuggestion,
    index: number,
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      suggestionRefs.current[index + 1]?.focus();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index === 0) {
        inputElementRef.current?.focus();
      } else {
        suggestionRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      inputElementRef.current?.focus();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      handleSuggestionSelect(suggestion);
    }
  };

  const mergedInputProps = {
    ...inputProps,
    role: 'combobox',
    'aria-expanded': expanded,
    'aria-controls': expanded || showEmptyState ? listboxId : undefined,
    'aria-autocomplete': 'list' as const,
    enterKeyHint: inputProps?.enterKeyHint ?? 'search',
    inputMode: inputProps?.inputMode ?? 'search',
    onKeyDown: handleInputKeyDown,
  };

  return (
    <div
      className={searchFieldClasses.root}
      ref={wrapperRef}
      onFocus={handleWrapperFocus}
      onBlur={handleWrapperBlur}
    >
      <InputComponent
        {...rest}
        ref={undefined}
        value={currentValue}
        className={cx(searchFieldClasses.input, className)}
        type="search"
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        inputProps={mergedInputProps}
        inputRef={handleInputRef}
        endAdornment={
          <span className={searchFieldClasses.icon} aria-hidden="true">
            <span aria-hidden="true">Search</span>
          </span>
        }
      />

      {expanded ? (
        <ul
          id={listboxId}
          role="listbox"
          className={cx(
            searchFieldClasses.suggestions,
            expanded && searchFieldClasses.suggestionsOpen,
          )}
        >
          {visibleSuggestions.map((suggestion, index) => {
            const suggestionValue = suggestion.value ?? suggestion.label;
            const isSelected = currentValue === suggestionValue;

            return (
              <li
                key={suggestion.id}
                role="option"
                aria-selected={isSelected}
                aria-disabled={suggestion.disabled || undefined}
                className={cx(
                  searchFieldClasses.suggestion,
                  suggestion.disabled && searchFieldClasses.suggestionDisabled,
                )}
              >
                <button
                  type="button"
                  className={searchFieldClasses.suggestionButton}
                  disabled={suggestion.disabled}
                  ref={(node) => {
                    suggestionRefs.current[index] = node;
                  }}
                  onClick={() => {
                    handleSuggestionSelect(suggestion);
                  }}
                  onKeyDown={(event) => handleSuggestionKeyDown(event, suggestion, index)}
                >
                  <span className={searchFieldClasses.suggestionContent}>
                    <span className={searchFieldClasses.suggestionLabel}>{suggestion.label}</span>

                    {suggestion.description ? (
                      <span className={searchFieldClasses.suggestionDescription}>
                        {suggestion.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {showEmptyState ? (
        <div id={listboxId} role="listbox" className={searchFieldClasses.suggestions}>
          <div className={searchFieldClasses.empty}>{noSuggestionsText}</div>
        </div>
      ) : null}
    </div>
  );
};

SearchField.displayName = 'SearchField';
