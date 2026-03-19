'use client';

import type { ElementType, FocusEventHandler, ReactElement, ReactNode, Ref } from 'react';
import {
  Children,
  createElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { cx } from '@berrypjh/ui-core';

import type { CoreFormControlProps, PolymorphicComponentPropsWithRef } from '../../types';
import { FormControlContext } from './FormControlContext';
import './form-control.scss';

export const formControlClasses = {
  root: 'ui-form-control',
  fullWidth: 'ui-form-control--fullWidth',
  marginDense: 'ui-form-control--margin-dense',
  marginNormal: 'ui-form-control--margin-normal',
  hiddenLabel: 'ui-form-control--hidden-label',
  disabled: 'ui-form-control--disabled',
  error: 'ui-form-control--error',
  focused: 'ui-form-control--focused',
  variantPlain: 'ui-form-control--variant-plain',
  variantFilled: 'ui-form-control--variant-filled',
  variantBoxed: 'ui-form-control--variant-boxed',
} as const;

type FormControlOwnProps = CoreFormControlProps & {
  children?: ReactNode;
  className?: string;
  focused?: boolean;
};

export type FormControlProps<C extends ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  FormControlOwnProps
>;

type FormControlImplementationProps = FormControlOwnProps & {
  component?: ElementType;
  ref?: Ref<unknown>;
  onFocus?: FocusEventHandler<Element>;
  onBlur?: FocusEventHandler<Element>;
};

type DerivedChildState = {
  filled: boolean;
  adornedStart: boolean;
};

type InspectableElementProps = {
  children?: ReactNode;
  input?: ReactNode;
  value?: unknown;
  defaultValue?: unknown;
  startAdornment?: ReactNode;
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

const deriveStateFromChildren = (children: ReactNode): DerivedChildState => {
  let state: DerivedChildState = {
    filled: false,
    adornedStart: false,
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
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

export const FormControl = <C extends ElementType = 'div'>(
  props: FormControlProps<C>,
): ReactElement | null => {
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
  } = props as FormControlImplementationProps;

  const Component = (component ?? 'div') as ElementType;
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

  const handleFocus = useCallback<FocusEventHandler<Element>>(
    (event) => {
      onFocus?.(event);

      if (!disabled) {
        setFocusedState(true);
      }
    },
    [disabled, onFocus],
  );

  const handleBlur = useCallback<FocusEventHandler<Element>>(
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

  const classNames = cx(
    formControlClasses.root,
    fullWidth && formControlClasses.fullWidth,
    hiddenLabel && formControlClasses.hiddenLabel,
    disabled && formControlClasses.disabled,
    error && formControlClasses.error,
    focused && formControlClasses.focused,
    margin === 'dense' && formControlClasses.marginDense,
    margin === 'normal' && formControlClasses.marginNormal,
    variant === 'plain' && formControlClasses.variantPlain,
    variant === 'filled' && formControlClasses.variantFilled,
    variant === 'boxed' && formControlClasses.variantBoxed,
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
      {createElement(Component, rootProps, children)}
    </FormControlContext.Provider>
  );
};

FormControl.displayName = 'FormControl';
