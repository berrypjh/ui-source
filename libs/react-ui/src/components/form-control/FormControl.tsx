'use client';

import { createElement, useCallback, useEffect, useMemo, useState } from 'react';

import type { FormControlImplementationProps } from './FormControl.types';
import { deriveStateFromChildren, getFormControlClassNames } from './FormControl.utils';
import { FormControlContext } from './FormControlContext';

export const FormControl = (props: FormControlImplementationProps) => {
  const {
    children,
    className,
    color = 'primary',
    component,
    disabled = false,
    error = false,
    focused: focusedProp,
    fullWidth = false,
    hiddenLabel = false,
    margin = 'none',
    required = false,
    size = 'md',
    variant = 'boxed',
    ref,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const Component = component ?? 'div';

  const derivedChildState = useMemo(() => deriveStateFromChildren(children), [children]);

  const [focusedState, setFocusedState] = useState(false);
  const [filledState, setFilledState] = useState(false);
  const [adornedStartState, setAdornedStartState] = useState(false);

  useEffect(() => {
    if (disabled) {
      setFocusedState(false);
    }
  }, [disabled]);

  const focused = !disabled && (focusedProp ?? focusedState);
  const filled = derivedChildState.filled || filledState;
  const adornedStart = derivedChildState.adornedStart || adornedStartState;

  const handleFocus = useCallback(
    (event: React.FocusEvent<Element>) => {
      onFocus?.(event);

      if (!disabled) {
        setFocusedState(true);
      }
    },
    [disabled, onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<Element>) => {
      onBlur?.(event);

      const nextFocusedElement = event.relatedTarget;

      if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
        return;
      }

      setFocusedState(false);
    },
    [onBlur],
  );

  const handleContextFocus = useCallback(() => {
    if (!disabled) {
      setFocusedState(true);
    }
  }, [disabled]);

  const handleContextBlur = useCallback(() => {
    setFocusedState(false);
  }, []);

  const handleFilled = useCallback(() => {
    setFilledState(true);
  }, []);

  const handleEmpty = useCallback(() => {
    setFilledState(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      adornedStart,
      color,
      disabled,
      error,
      filled,
      focused,
      fullWidth,
      hiddenLabel,
      margin,
      required,
      size,
      variant,
      setAdornedStart: setAdornedStartState,
      onFocus: handleContextFocus,
      onBlur: handleContextBlur,
      onFilled: handleFilled,
      onEmpty: handleEmpty,
    }),
    [
      adornedStart,
      color,
      disabled,
      error,
      filled,
      focused,
      fullWidth,
      handleContextBlur,
      handleContextFocus,
      handleEmpty,
      handleFilled,
      hiddenLabel,
      margin,
      required,
      size,
      variant,
    ],
  );

  const classNames = getFormControlClassNames({
    className,
    disabled,
    error,
    focused,
    fullWidth,
    hiddenLabel,
    margin,
    variant,
  });

  const rootProps = {
    ...rest,
    ref,
    className: classNames,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  return (
    <FormControlContext.Provider value={contextValue}>
      {createElement(Component, rootProps, children)}
    </FormControlContext.Provider>
  );
};

FormControl.displayName = 'FormControl';
