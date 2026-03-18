'use client';

import * as React from 'react';
import { cx } from '@berrypjh/ui-core';

import type { CoreFormControlProps, PolymorphicComponentPropsWithRef } from '../../types';
import { FormControlContext } from './FormControlContext';
import './form-control.scss';

export const formControlClasses = {
  root: 'ui-form-control',
  fullWidth: 'ui-form-control--fullWidth',
  marginNone: 'ui-form-control--margin-none',
  marginDense: 'ui-form-control--margin-dense',
  marginNormal: 'ui-form-control--margin-normal',
  hiddenLabel: 'ui-form-control--hidden-label',
  disabled: 'ui-form-control--disabled',
  error: 'ui-form-control--error',
  focused: 'ui-form-control--focused',
  filled: 'ui-form-control--filled',
  required: 'ui-form-control--required',
  sizeSm: 'ui-form-control--size-sm',
  sizeMd: 'ui-form-control--size-md',
  variantStandard: 'ui-form-control--variant-standard',
  variantFilled: 'ui-form-control--variant-filled',
  variantOutlined: 'ui-form-control--variant-outlined',
  colorPrimary: 'ui-form-control--color-primary',
  colorSecondary: 'ui-form-control--color-secondary',
} as const;

type FormControlOwnProps = CoreFormControlProps & {
  children?: React.ReactNode;
  className?: string;
  focused?: boolean;
};

export type FormControlProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropsWithRef<C, FormControlOwnProps>;

type FormControlImplementationProps = FormControlOwnProps & {
  component?: React.ElementType;
  ref?: React.Ref<unknown>;
  onFocus?: React.FocusEventHandler<Element>;
  onBlur?: React.FocusEventHandler<Element>;
};

type DerivedChildState = {
  filled: boolean;
  adornedStart: boolean;
};

type InspectableElementProps = {
  children?: React.ReactNode;
  input?: React.ReactNode;
  value?: unknown;
  defaultValue?: unknown;
  startAdornment?: React.ReactNode;
  inputProps?: {
    value?: unknown;
    defaultValue?: unknown;
  };
};

const hasValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value != null && value !== '';
};

const mergeDerivedState = (a: DerivedChildState, b: DerivedChildState): DerivedChildState => ({
  filled: a.filled || b.filled,
  adornedStart: a.adornedStart || b.adornedStart,
});

const deriveStateFromChildren = (children: React.ReactNode): DerivedChildState => {
  let state: DerivedChildState = {
    filled: false,
    adornedStart: false,
  };

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    const props = child.props as InspectableElementProps;

    const ownState: DerivedChildState = {
      filled:
        hasValue(props.value) ||
        hasValue(props.defaultValue) ||
        hasValue(props.inputProps?.value) ||
        hasValue(props.inputProps?.defaultValue),
      adornedStart: props.startAdornment != null,
    };

    state = mergeDerivedState(state, ownState);

    if (props.input != null) {
      state = mergeDerivedState(state, deriveStateFromChildren(props.input));
    }

    if (props.children != null) {
      state = mergeDerivedState(state, deriveStateFromChildren(props.children));
    }
  });

  return state;
};

export const FormControl = <C extends React.ElementType = 'div'>(props: FormControlProps<C>) => {
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
    variant = 'outlined',
    ref,
    onFocus,
    onBlur,
    ...rest
  } = props as FormControlImplementationProps;

  const Component = (component ?? 'div') as React.ElementType;

  const derivedChildState = React.useMemo(() => deriveStateFromChildren(children), [children]);

  const [focusedState, setFocusedState] = React.useState(false);
  const [filledState, setFilledState] = React.useState(false);
  const [adornedStartState, setAdornedStartState] = React.useState(false);

  React.useEffect(() => {
    if (disabled) {
      setFocusedState(false);
    }
  }, [disabled]);

  const focused = !disabled && (focusedProp ?? focusedState);
  const filled = derivedChildState.filled || filledState;
  const adornedStart = derivedChildState.adornedStart || adornedStartState;

  const handleFocus = React.useCallback<React.FocusEventHandler<Element>>(
    (event) => {
      onFocus?.(event);

      if (!disabled) {
        setFocusedState(true);
      }
    },
    [disabled, onFocus],
  );

  const handleBlur = React.useCallback<React.FocusEventHandler<Element>>(
    (event) => {
      onBlur?.(event);

      const nextFocusedElement = event.relatedTarget;

      if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
        return;
      }

      setFocusedState(false);
    },
    [onBlur],
  );

  const handleContextFocus = React.useCallback(() => {
    if (!disabled) {
      setFocusedState(true);
    }
  }, [disabled]);

  const handleContextBlur = React.useCallback(() => {
    setFocusedState(false);
  }, []);

  const handleFilled = React.useCallback(() => {
    setFilledState(true);
  }, []);

  const handleEmpty = React.useCallback(() => {
    setFilledState(false);
  }, []);

  const contextValue = React.useMemo(
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

  const classNames = cx(
    formControlClasses.root,
    fullWidth && formControlClasses.fullWidth,
    hiddenLabel && formControlClasses.hiddenLabel,
    disabled && formControlClasses.disabled,
    error && formControlClasses.error,
    focused && formControlClasses.focused,
    filled && formControlClasses.filled,
    required && formControlClasses.required,
    size === 'sm' && formControlClasses.sizeSm,
    size === 'md' && formControlClasses.sizeMd,
    variant === 'standard' && formControlClasses.variantStandard,
    variant === 'filled' && formControlClasses.variantFilled,
    variant === 'outlined' && formControlClasses.variantOutlined,
    color === 'primary' && formControlClasses.colorPrimary,
    color === 'secondary' && formControlClasses.colorSecondary,
    margin === 'dense' && formControlClasses.marginDense,
    margin === 'normal' && formControlClasses.marginNormal,
    className,
  );

  const rootProps = {
    ...(rest as Record<string, unknown>),
    ref,
    className: classNames,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  return (
    <FormControlContext.Provider value={contextValue}>
      {React.createElement(Component, rootProps, children)}
    </FormControlContext.Provider>
  );
};

FormControl.displayName = 'FormControl';
