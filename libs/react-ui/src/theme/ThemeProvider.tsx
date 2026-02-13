import { CSSProperties, ReactNode } from 'react';
import { cx } from '@berrypjh/ui-core';
import type { ThemeName } from '@berrypjh/ui-core';

export interface ThemeProviderProps {
  mode?: ThemeName;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export const ThemeProvider = ({
  mode = 'global',
  className,
  style,
  children,
}: ThemeProviderProps) => {
  return (
    <div data-theme={mode} className={cx('ui-theme-root', className)} style={style}>
      {children}
    </div>
  );
};
