import { describe, expect, it } from 'vitest';

import { baseTheme, themes } from './themes.js';

describe('theme registry', () => {
  it('registers light, dark and sepia in that order', () => {
    expect(themes.map((t) => t.name)).toEqual(['light', 'dark', 'sepia']);
  });

  it('treats the first entry as the base theme', () => {
    expect(baseTheme).toBe(themes[0]);
    expect(baseTheme.name).toBe('light');
    expect(baseTheme.selector).toBe(':root');
  });

  it('exposes the current CSS selectors', () => {
    expect(themes.map((t) => t.selector)).toEqual([
      ':root',
      '[data-theme="dark"], .theme-dark',
      '[data-theme="sepia"], .theme-sepia',
    ]);
  });

  it('sources the base theme from its own directory only', () => {
    expect(baseTheme.sourceDirs).toEqual(['light']);
  });

  it('cascades every non-base theme on top of the base directory', () => {
    for (const theme of themes.filter((t) => t.name !== baseTheme.name)) {
      expect(theme.sourceDirs[0]).toBe(baseTheme.name);
      expect(theme.sourceDirs).toEqual([baseTheme.name, theme.name]);
    }
  });
});
