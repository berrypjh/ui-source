import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ThemeName } from '@berrypjh/ui-core';

export type ThemeProviderProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  mode?: ThemeName;
  children: ReactNode;
};
