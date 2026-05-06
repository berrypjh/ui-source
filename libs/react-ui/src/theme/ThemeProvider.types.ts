import type { ThemeName } from '@berrypjh/ui-core';

import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ThemeProviderProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  mode?: ThemeName;
  children: ReactNode;
};
