'use client';

import { cloneElement, isValidElement, type MouseEvent, type ReactElement, type Ref } from 'react';

import { assignRef } from '../../utils';

import type { PopoverTriggerProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';

type TriggerChildProps = {
  id?: string;
  ref?: Ref<HTMLElement>;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  'aria-haspopup'?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | true | false;
};

export const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
  const { open, setOpen, triggerRef, panelId, triggerId } = usePopoverContext('PopoverTrigger');

  if (!isValidElement(children)) {
    throw new Error('PopoverTrigger requires a single React element child');
  }

  const child = children as ReactElement<TriggerChildProps>;
  const childProps = child.props;
  const childRef = childProps.ref;

  return cloneElement(child, {
    id: childProps.id ?? triggerId,
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      assignRef(childRef, node);
    },
    onClick: (event: MouseEvent<HTMLElement>) => {
      childProps.onClick?.(event);
      if (!event.defaultPrevented) setOpen(!open);
    },
    'aria-expanded': open,
    'aria-controls': open ? panelId : undefined,
    'aria-haspopup': childProps['aria-haspopup'] ?? 'dialog',
  } as Partial<TriggerChildProps> & Record<string, unknown>);
};

PopoverTrigger.displayName = 'PopoverTrigger';
