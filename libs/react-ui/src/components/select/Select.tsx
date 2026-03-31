'use client';

import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ComponentPropsWithRef,
  FocusEventHandler,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { cx } from '@berrypjh/ui-core';

import type { FieldColor, FieldSize, FieldVariant } from '../../types';
import { useFormControl } from '../form-control';
import './select.scss';

export const selectClasses = {
  root: 'ui-select',
  trigger: 'ui-select__trigger',
  value: 'ui-select__value',
  placeholder: 'ui-select__placeholder',
  icon: 'ui-select__icon',
  hiddenInput: 'ui-select__native-input',
  listbox: 'ui-select__listbox',
  option: 'ui-select__option',
  optionSelected: 'ui-select__option--selected',
  optionHighlighted: 'ui-select__option--highlighted',
  open: 'ui-select--open',
  focused: 'ui-select--focused',
  disabled: 'ui-select--disabled',
  error: 'ui-select--error',
  multiple: 'ui-select--multiple',
  fullWidth: 'ui-select--fullWidth',
  sizeSm: 'ui-select--size-sm',
  sizeMd: 'ui-select--size-md',
  variantPlain: 'ui-select--variant-plain',
  variantFilled: 'ui-select--variant-filled',
  variantBoxed: 'ui-select--variant-boxed',
  colorPrimary: 'ui-select--color-primary',
  colorSecondary: 'ui-select--color-secondary',
} as const;

export type SelectChangeEvent<Value = unknown> = {
  target: {
    name?: string;
    value: Value;
  };
};

type SelectLikeChildProps = {
  value?: unknown;
  disabled?: boolean;
  children?: ReactNode;
};

export interface SelectProps
  extends Omit<
    ComponentPropsWithRef<'div'>,
    'children' | 'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'onFocus'
  > {
  'aria-describedby'?: string;
  autoFocus?: boolean;
  children?: ReactNode;
  color?: FieldColor;
  defaultOpen?: boolean;
  defaultValue?: unknown;
  disabled?: boolean;
  displayEmpty?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  id?: string;
  labelId?: string;
  multiple?: boolean;
  name?: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onChange?: (event: SelectChangeEvent, child?: ReactElement | null) => void;
  onClose?: (event?: Event | MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
  onFocus?: FocusEventHandler<HTMLElement>;
  onOpen?: (event?: Event | MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
  open?: boolean;
  placeholder?: ReactNode;
  renderValue?: (value: unknown) => ReactNode;
  required?: boolean;
  size?: FieldSize;
  value?: unknown;
  variant?: FieldVariant;
  ref?: Ref<HTMLDivElement>;
}

const assignRef = <T,>(ref: unknown, value: T) => {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref && typeof ref === 'object' && 'current' in ref) {
    (ref as { current: T }).current = value;
  }
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const stringifyValue = (value: unknown): string => {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifyValue(item)).join(',');
  }

  return String(value);
};

const hasDisplayValue = (value: unknown, multiple: boolean): boolean => {
  if (multiple) {
    return Array.isArray(value) && value.length > 0;
  }

  return value !== '' && value != null;
};

const isValueEqual = (optionValue: unknown, currentValue: unknown): boolean => {
  if (isObject(optionValue) || isObject(currentValue)) {
    return optionValue === currentValue;
  }

  return stringifyValue(optionValue) === stringifyValue(currentValue);
};

const isOptionSelected = (
  optionValue: unknown,
  currentValue: unknown,
  multiple: boolean,
): boolean => {
  if (multiple) {
    if (!Array.isArray(currentValue)) {
      return false;
    }

    return currentValue.some((item) => isValueEqual(optionValue, item));
  }

  return isValueEqual(optionValue, currentValue);
};

const getNodeText = (node: ReactNode): string => {
  if (node == null || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((item) => getNodeText(item)).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }

  return '';
};

const flattenOptionChildren = (children: ReactNode): ReactElement<SelectLikeChildProps>[] => {
  const result: ReactElement<SelectLikeChildProps>[] = [];

  Children.forEach(children, (child) => {
    if (child == null || typeof child === 'boolean') {
      return;
    }

    if (!isValidElement(child)) {
      return;
    }

    if (child.type === Fragment) {
      result.push(...flattenOptionChildren((child.props as { children?: ReactNode }).children));
      return;
    }

    const props = child.props as SelectLikeChildProps;

    if (!('value' in props)) {
      return;
    }

    result.push(child as ReactElement<SelectLikeChildProps>);
  });

  return result;
};

const getDefaultSelectValue = (multiple: boolean, defaultValue: unknown): unknown => {
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  return multiple ? [] : '';
};

const getFirstEnabledIndex = (options: ReactElement<SelectLikeChildProps>[]): number =>
  options.findIndex((option) => !option.props.disabled);

const getSelectedIndex = (
  options: ReactElement<SelectLikeChildProps>[],
  value: unknown,
  multiple: boolean,
): number => options.findIndex((option) => isOptionSelected(option.props.value, value, multiple));

const getNextEnabledIndex = (
  options: ReactElement<SelectLikeChildProps>[],
  startIndex: number,
  direction: 1 | -1,
): number => {
  if (!options.length) {
    return -1;
  }

  let index = startIndex;

  for (let step = 0; step < options.length; step += 1) {
    index = (index + direction + options.length) % options.length;

    if (!options[index]?.props.disabled) {
      return index;
    }
  }

  return -1;
};

export const Select = ({
  'aria-describedby': ariaDescribedby,
  autoFocus = false,
  children,
  className,
  color,
  defaultOpen = false,
  defaultValue,
  disabled,
  displayEmpty = false,
  error,
  fullWidth,
  id,
  labelId,
  multiple = false,
  name,
  onBlur,
  onChange,
  onClose,
  onFocus,
  onOpen,
  open: openProp,
  placeholder,
  renderValue,
  required,
  size,
  value: valueProp,
  variant,
  ref,
  ...rest
}: SelectProps): ReactElement | null => {
  const formControl = useFormControl();

  const resolvedColor = color ?? formControl?.color ?? 'primary';
  const resolvedDisabled = disabled ?? formControl?.disabled ?? false;
  const resolvedError = error ?? formControl?.error ?? false;
  const resolvedFullWidth = fullWidth ?? formControl?.fullWidth ?? false;
  const resolvedSize = size ?? formControl?.size ?? 'md';
  const resolvedVariant = variant ?? formControl?.variant ?? 'boxed';
  const resolvedRequired = required ?? formControl?.required ?? false;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;

  const [focused, setFocused] = useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlledOpen = openProp != null;
  const open = openProp ?? uncontrolledOpen;

  const isControlledValue = valueProp !== undefined;
  const [valueState, setValueState] = useState<unknown>(() =>
    getDefaultSelectValue(multiple, defaultValue),
  );
  const value = isControlledValue ? valueProp : valueState;

  const optionElements = useMemo(() => flattenOptionChildren(children), [children]);
  const selectedOptions = optionElements.filter((child) =>
    isOptionSelected(child.props.value, value, multiple),
  );

  const [highlightedIndex, setHighlightedIndex] = useState<number>(() => {
    const selectedIndex = getSelectedIndex(optionElements, value, multiple);

    if (selectedIndex >= 0) {
      return selectedIndex;
    }

    return getFirstEnabledIndex(optionElements);
  });

  const hiddenValues = multiple
    ? Array.isArray(value)
      ? value.map((item) => stringifyValue(item))
      : []
    : [stringifyValue(value)];

  const displayValue = useMemo(() => {
    if (renderValue) {
      return renderValue(value);
    }

    if (hasDisplayValue(value, multiple)) {
      if (multiple) {
        const texts = selectedOptions
          .map((child) => getNodeText(child.props.children))
          .filter(Boolean);

        return texts.join(', ');
      }

      const selected = selectedOptions[0];
      return selected ? getNodeText(selected.props.children) : null;
    }

    if (displayEmpty) {
      if (multiple) {
        return '';
      }

      const selected = selectedOptions[0];
      return selected ? getNodeText(selected.props.children) : '';
    }

    if (placeholder != null) {
      return placeholder;
    }

    return null;
  }, [displayEmpty, multiple, placeholder, renderValue, selectedOptions, value]);

  useEffect(() => {
    if (!autoFocus || resolvedDisabled) {
      return;
    }

    triggerRef.current?.focus();
  }, [autoFocus, resolvedDisabled]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const selectedIndex = getSelectedIndex(optionElements, value, multiple);
    const initialIndex = selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(optionElements);

    setHighlightedIndex(initialIndex);

    const frame = window.requestAnimationFrame(() => {
      if (initialIndex >= 0) {
        optionRefs.current[initialIndex]?.focus();
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [multiple, open, optionElements, value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: globalThis.MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (rootRef.current?.contains(target)) {
        return;
      }

      if (!isControlledOpen) {
        setUncontrolledOpen(false);
      }

      onClose?.(event as unknown as MouseEvent<HTMLElement>);
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isControlledOpen, onClose, open]);

  useEffect(() => {
    const labelElements = Array.from(document.getElementsByTagName('label')).filter(
      (element) => element.htmlFor === triggerId,
    );

    if (!labelElements.length) {
      return;
    }

    const handleLabelClick = (event: Event) => {
      if (resolvedDisabled) {
        return;
      }

      event.preventDefault();
      triggerRef.current?.focus();

      if (!open) {
        if (!isControlledOpen) {
          setUncontrolledOpen(true);
        }

        onOpen?.(event);
      }
    };

    labelElements.forEach((labelElement) => {
      labelElement.addEventListener('click', handleLabelClick);
    });

    return () => {
      labelElements.forEach((labelElement) => {
        labelElement.removeEventListener('click', handleLabelClick);
      });
    };
  }, [triggerId, resolvedDisabled, open, isControlledOpen, onOpen]);

  const handleOpen = (event?: Event | MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    if (resolvedDisabled) {
      return;
    }

    if (!isControlledOpen) {
      setUncontrolledOpen(true);
    }

    onOpen?.(event);
  };

  const handleClose = (event?: Event | MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    if (!isControlledOpen) {
      setUncontrolledOpen(false);
    }

    onClose?.(event);
  };

  const createSyntheticChangeEvent = (nextValue: unknown): SelectChangeEvent => ({
    target: {
      name,
      value: nextValue,
    },
  });

  const selectOption = (
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
    child: ReactElement<SelectLikeChildProps>,
  ) => {
    if (child.props.disabled) {
      return;
    }

    const optionValue = child.props.value;

    if (multiple) {
      const currentArray = Array.isArray(value) ? value : [];
      const alreadySelected = currentArray.some((item) => isValueEqual(optionValue, item));

      const nextValue = alreadySelected
        ? currentArray.filter((item) => !isValueEqual(optionValue, item))
        : currentArray.concat(optionValue);

      if (!isControlledValue) {
        setValueState(nextValue);
      }

      onChange?.(createSyntheticChangeEvent(nextValue), child);
      return;
    }

    if (isValueEqual(optionValue, value)) {
      handleClose(event);
      triggerRef.current?.focus();
      return;
    }

    if (!isControlledValue) {
      setValueState(optionValue);
    }

    onChange?.(createSyntheticChangeEvent(optionValue), child);
    handleClose(event);
    triggerRef.current?.focus();
  };

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (open) {
      handleClose(event);
      return;
    }

    handleOpen(event);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (resolvedDisabled) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      if (!open) {
        handleOpen(event);
      }
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (open) {
        handleClose(event);
      } else {
        handleOpen(event);
      }
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault();
      handleClose(event);
    }
  };

  const handleRootBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
      return;
    }

    setFocused(false);
    onBlur?.(event);
  };

  const handleRootFocus: FocusEventHandler<HTMLDivElement> = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    child: ReactElement<SelectLikeChildProps>,
    index: number,
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      const nextIndex = getNextEnabledIndex(optionElements, index, 1);

      if (nextIndex >= 0) {
        setHighlightedIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus();
      }

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      const nextIndex = getNextEnabledIndex(optionElements, index, -1);

      if (nextIndex >= 0) {
        setHighlightedIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus();
      }

      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();

      const firstIndex = getFirstEnabledIndex(optionElements);

      if (firstIndex >= 0) {
        setHighlightedIndex(firstIndex);
        optionRefs.current[firstIndex]?.focus();
      }

      return;
    }

    if (event.key === 'End') {
      event.preventDefault();

      const reversedIndex = [...optionElements]
        .reverse()
        .findIndex((option) => !option.props.disabled);

      if (reversedIndex >= 0) {
        const lastIndex = optionElements.length - 1 - reversedIndex;
        setHighlightedIndex(lastIndex);
        optionRefs.current[lastIndex]?.focus();
      }

      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose(event);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(event, child);
    }
  };

  const rootClassName = cx(
    selectClasses.root,
    open && selectClasses.open,
    focused && selectClasses.focused,
    resolvedDisabled && selectClasses.disabled,
    resolvedError && selectClasses.error,
    multiple && selectClasses.multiple,
    resolvedFullWidth && selectClasses.fullWidth,
    resolvedSize === 'sm' && selectClasses.sizeSm,
    resolvedSize === 'md' && selectClasses.sizeMd,
    resolvedVariant === 'plain' && selectClasses.variantPlain,
    resolvedVariant === 'filled' && selectClasses.variantFilled,
    resolvedVariant === 'boxed' && selectClasses.variantBoxed,
    resolvedColor === 'primary' && selectClasses.colorPrimary,
    resolvedColor === 'secondary' && selectClasses.colorSecondary,
    className,
  );

  return (
    <div
      {...rest}
      className={rootClassName}
      onBlur={handleRootBlur}
      onFocus={handleRootFocus}
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
    >
      {multiple ? (
        hiddenValues.map((hiddenValue, index) => (
          <input
            aria-hidden="true"
            className={selectClasses.hiddenInput}
            disabled={resolvedDisabled}
            key={`${hiddenValue}-${index}`}
            name={name}
            readOnly
            required={resolvedRequired}
            tabIndex={-1}
            type="hidden"
            value={hiddenValue}
          />
        ))
      ) : (
        <input
          aria-hidden="true"
          className={selectClasses.hiddenInput}
          disabled={resolvedDisabled}
          name={name}
          readOnly
          required={resolvedRequired}
          tabIndex={-1}
          type="hidden"
          value={hiddenValues[0] ?? ''}
        />
      )}

      <button
        aria-controls={open ? listboxId : undefined}
        aria-describedby={ariaDescribedby}
        aria-disabled={resolvedDisabled ? 'true' : undefined}
        aria-expanded={open ? 'true' : 'false'}
        aria-haspopup="listbox"
        aria-invalid={resolvedError ? 'true' : undefined}
        aria-labelledby={labelId}
        aria-required={resolvedRequired ? 'true' : undefined}
        className={selectClasses.trigger}
        disabled={resolvedDisabled}
        id={triggerId}
        name={name}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        role="combobox"
        type="button"
      >
        <span
          className={cx(
            selectClasses.value,
            !hasDisplayValue(value, multiple) && selectClasses.placeholder,
          )}
        >
          {displayValue}
        </span>

        {!multiple ? (
          <span aria-hidden="true" className={selectClasses.icon}>
            ▾
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          aria-labelledby={labelId}
          aria-multiselectable={multiple ? 'true' : undefined}
          className={selectClasses.listbox}
          id={listboxId}
          role="listbox"
        >
          {optionElements.map((child, index) => {
            const optionValue = child.props.value;
            const selected = isOptionSelected(optionValue, value, multiple);
            const highlighted = highlightedIndex === index;
            const disabledOption = Boolean(child.props.disabled);

            return (
              <button
                aria-selected={selected ? 'true' : 'false'}
                className={cx(
                  selectClasses.option,
                  selected && selectClasses.optionSelected,
                  highlighted && selectClasses.optionHighlighted,
                )}
                data-value={stringifyValue(optionValue)}
                disabled={disabledOption}
                key={child.key ?? index}
                onClick={(event) => selectOption(event, child)}
                onKeyDown={(event) => handleOptionKeyDown(event, child, index)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                type="button"
              >
                {child.props.children}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

Select.displayName = 'Select';
