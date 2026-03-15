import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';
import type { ThemeName } from '@berrypjh/ui-core';

export const themeProviderClasses = {
  root: 'ui-theme-root',
} as const;

export interface ThemeProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  mode?: ThemeName;
  children: ReactNode;
}

export const ThemeProvider = ({
  mode = 'global',
  className,
  children,
  ref,
  ...rest
}: ThemeProviderProps) => {
  return (
    <div {...rest} ref={ref} data-theme={mode} className={cx(themeProviderClasses.root, className)}>
      {children}
    </div>
  );
};
