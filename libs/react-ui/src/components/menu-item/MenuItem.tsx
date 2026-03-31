'use client';

import type { MouseEvent, ReactElement, ReactNode } from 'react';

export const menuItemClasses = {
  root: 'ui-menu-item',
  disabled: 'ui-menu-item--disabled',
  selected: 'ui-menu-item--selected',
} as const;

export interface MenuItemProps {
  children?: ReactNode;
  value?: unknown;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export const MenuItem = (_props: MenuItemProps): ReactElement | null => {
  return null;
};

export default MenuItem;
