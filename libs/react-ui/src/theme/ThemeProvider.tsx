import { cx } from '@berrypjh/ui-core';
import type { ThemeMode } from '@berrypjh/ui-core';

export interface ThemeProviderProps {
  mode?: ThemeMode;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const ThemeProvider = ({
  mode = 'light',
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
