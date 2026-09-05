import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { TransformedToken } from 'style-dictionary/types';
import { beforeAll, describe, expect, it } from 'vitest';

import { themes } from '../themes.js';

import { buildThemeDictionaries, type ThemeBuild } from './sd.js';
import { getTokenType, getTokenValue } from './tokens.js';

const TOKENS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../tokens');

let builds: ThemeBuild[];

const byTheme = (name: string): ThemeBuild => {
  const build = builds.find((b) => b.theme === name);
  if (!build) throw new Error(`theme "${name}" not built`);
  return build;
};

const find = (tokens: readonly TransformedToken[], tokenPath: string): unknown => {
  const token = tokens.find((t) => t.path.join('.') === tokenPath);
  if (!token) throw new Error(`token "${tokenPath}" not found`);
  return getTokenValue(token);
};

beforeAll(async () => {
  builds = await buildThemeDictionaries(themes, TOKENS_DIR);
}, 60_000);

describe('buildThemeDictionaries', () => {
  it('builds one web and one rn dictionary per registered theme', () => {
    expect(builds.map((b) => b.theme)).toEqual(['light', 'dark', 'sepia']);
    for (const build of builds) {
      expect(build.web.allTokens.length).toBeGreaterThan(0);
      expect(build.rn.allTokens).toHaveLength(build.web.allTokens.length);
    }
  });

  it('carries the theme selector through to the build', () => {
    expect(byTheme('light').selector).toBe(':root');
    expect(byTheme('dark').selector).toBe('[data-theme="dark"], .theme-dark');
  });

  it('gives every theme the same token set as the base theme', () => {
    const basePaths = byTheme('light')
      .web.allTokens.map((t) => t.path.join('.'))
      .sort();
    for (const build of builds) {
      expect(build.web.allTokens.map((t) => t.path.join('.')).sort()).toEqual(basePaths);
    }
  });
});

describe('base source precedence', () => {
  it('overrides base values with the theme-specific source', () => {
    expect(find(byTheme('light').web.allTokens, 'primary.pr700')).toBe('#047857');
    expect(find(byTheme('dark').web.allTokens, 'primary.pr700')).toBe('#136F47');
    expect(find(byTheme('sepia').web.allTokens, 'primary.pr700')).toBe('#1A6E37');
  });

  it('inherits base values for heads the theme does not redefine', () => {
    for (const name of ['light', 'dark', 'sepia']) {
      expect(find(byTheme(name).web.allTokens, 'success.su500')).toBe('#12B76A');
    }
  });

  it('resolves semantic aliases against the winning primitive', () => {
    expect(find(byTheme('light').web.allTokens, 'background.primary')).toBe('#047857');
    expect(find(byTheme('dark').web.allTokens, 'background.primary')).toBe('#136F47');
  });
});

describe('web transforms', () => {
  const web = () => byTheme('light').web.allTokens;

  it('converts dimension-like tokens from px to rem', () => {
    expect(find(web(), 'spacing.md')).toBe('0.75rem');
    expect(find(web(), 'radius.md')).toBe('0.5rem');
    expect(find(web(), 'primitiveBorder.hairline')).toBe('0.03125rem');
  });

  it('converts font size and line height to rem', () => {
    expect(find(web(), 'fontSize.md')).toBe('1.125rem');
    expect(find(web(), 'lineHeight.md')).toBe('1.75rem');
  });

  it('keeps font weight numeric and leaves colors untouched', () => {
    expect(find(web(), 'fontWeight.bold')).toBe(700);
    expect(find(web(), 'background.primary')).toBe('#047857');
  });

  it('resolves composite spacing references with rem units', () => {
    expect(find(web(), 'component.button')).toBe('0.375rem 1rem');
  });
});

describe('rn transforms', () => {
  const rn = () => byTheme('light').rn.allTokens;

  it('emits unitless numbers for dimension-like tokens', () => {
    expect(find(rn(), 'spacing.md')).toBe(12);
    expect(find(rn(), 'radius.md')).toBe(8);
    expect(find(rn(), 'primitiveBorder.hairline')).toBe(0.5);
  });

  it('emits unitless numbers for font size, line height and letter spacing', () => {
    expect(find(rn(), 'fontSize.md')).toBe(18);
    expect(find(rn(), 'lineHeight.md')).toBe(28);
    expect(find(rn(), 'letterSpacing.sm')).toBe(-0.2);
  });

  it('keeps font weight numeric and leaves colors untouched', () => {
    expect(find(rn(), 'fontWeight.bold')).toBe(700);
    expect(find(rn(), 'background.primary')).toBe('#047857');
  });

  it('differs from web exactly on the unit-bearing token types', () => {
    const web = byTheme('light').web.allTokens;
    expect(find(web, 'spacing.md')).toBe('0.75rem');
    expect(find(rn(), 'spacing.md')).toBe(12);
  });
});

describe('token type propagation', () => {
  const typeOf = (tokenPath: string) => {
    const token = byTheme('light').web.allTokens.find((t) => t.path.join('.') === tokenPath);
    return token ? getTokenType(token) : undefined;
  };

  it('aligns spacing, radius and border width onto the dimension type', () => {
    expect(typeOf('spacing.md')).toBe('dimension');
    expect(typeOf('radius.md')).toBe('dimension');
    expect(typeOf('primitiveBorder.hairline')).toBe('dimension');
  });

  it('keeps the dedicated typography types singular', () => {
    expect(typeOf('fontSize.md')).toBe('fontSize');
    expect(typeOf('lineHeight.md')).toBe('lineHeight');
    expect(typeOf('fontWeight.bold')).toBe('fontWeight');
    expect(typeOf('fontFamilies.inter')).toBe('fontFamily');
  });

  it('keeps color as color', () => {
    expect(typeOf('background.primary')).toBe('color');
  });

  it('exposes only the current closed set of token types', () => {
    const types = [...new Set(byTheme('light').web.allTokens.map(getTokenType))].sort();
    expect(types).toEqual([
      'color',
      'cubicBezier',
      'dimension',
      'duration',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'letterSpacing',
      'lineHeight',
      'type',
    ]);
  });
});
