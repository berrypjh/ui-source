import { describe, expect, it } from 'vitest';

import { loadTokenSource } from './repo-source';
import { type ContractSource, lookupTokens, type TokenSource } from './tokens';

const source = await loadTokenSource();

describe('token lookup', () => {
  it('keeps the existing tokens.json format', () => {
    expect(source.schema).toContain('tokens[path]');
    expect(source.themes).toEqual(['light', 'dark', 'sepia']);
    expect(source.categories).toContain('color');
  });

  it('resolves an exact token path', () => {
    const r = lookupTokens(source, 'color.primary.pr500');
    expect(r.mode).toBe('exact');
    expect(r.matchCount).toBe(1);
    expect(r.matches[0].cssVar).toBe('--ds-primary-pr500');
    expect(Object.keys(r.matches[0].values)).toEqual(['light', 'dark', 'sepia']);
    expect(r.truncated).toBe(false);
  });

  it('resolves a prefix', () => {
    const r = lookupTokens(source, 'color.primary');
    expect(r.mode).toBe('prefix');
    expect(r.matchCount).toBeGreaterThan(1);
    expect(r.matches.every((m) => m.path.startsWith('color.primary.'))).toBe(true);
  });

  it('resolves a category', () => {
    const r = lookupTokens(source, 'spacing');
    expect(r.mode).toBe('category');
    expect(r.matches.map((m) => m.path)).toContain('spacing.md');
  });

  it('caps a large category and says how to narrow it', () => {
    const r = lookupTokens(source, 'color');
    expect(r.truncated).toBe(true);
    expect(r.returned).toBe(r.limit);
    expect(r.matchCount).toBeGreaterThan(r.limit);
    expect(r.refine).toContain('color.');
  });

  it('honours an explicit limit', () => {
    const r = lookupTokens(source, 'spacing', { limit: 2 });
    expect(r.returned).toBe(2);
    expect(r.truncated).toBe(true);
  });

  it('returns an empty result for an unknown path instead of guessing', () => {
    const r = lookupTokens(source, 'color.nonexistent.zz999');
    expect(r).toMatchObject({ mode: 'none', matchCount: 0, matches: [], refine: null });
  });

  it('is far smaller than shipping the whole token catalog', () => {
    const whole = JSON.stringify(source).length;
    expect(JSON.stringify(lookupTokens(source, 'color.primary.pr500')).length).toBeLessThan(
      whole / 100,
    );
  });
});

describe('contract governance annotation', () => {
  const contract = {
    schema: 'contract[path] = [type, visibility, overridable, stability, deprecatedReplacement]',
    contractVersion: 1,
    internalPrimitiveRoots: ['color.primary', 'borderWidth.primitive'],
    tokens: {
      'color.text.default': ['color', 'public', true, 'stable', null],
      'color.text.link': ['color', 'public', true, 'experimental', 'color.text.primary'],
    },
  } satisfies ContractSource;

  const source: TokenSource = {
    schema: 'tokens[path] = [cssVar, ...valuesInThemesOrder]',
    themes: ['light', 'dark'],
    categories: ['color'],
    tokens: {
      'color.text.default': ['--ds-text-default', '#101828', '#F2F4F7'],
      'color.text.link': ['--ds-text-link', '#2563EB', '#60A5FA'],
      'color.primary.pr700': ['--ds-primary-pr700', '#047857', '#136F47'],
      'spacing.md': ['--ds-spacing-md', '0.75rem', '0.75rem'],
    },
  };

  it('omits governance entirely when no contract is supplied', () => {
    const result = lookupTokens(source, 'color.text.default');
    expect(result.matches[0]).not.toHaveProperty('governance');
    expect(result.matches[0].values).toEqual({ light: '#101828', dark: '#F2F4F7' });
  });

  it('marks a public overridable token', () => {
    const [match] = lookupTokens(source, 'color.text.default', { contract }).matches;
    expect(match.governance).toEqual({
      visibility: 'public',
      overridable: true,
      stability: 'stable',
    });
  });

  it('marks a deprecated token with its replacement', () => {
    const [match] = lookupTokens(source, 'color.text.link', { contract }).matches;
    expect(match.governance).toMatchObject({
      deprecated: true,
      replacement: 'color.text.primary',
    });
  });

  it('marks an internal primitive as non-overridable and says why', () => {
    const [match] = lookupTokens(source, 'color.primary.pr700', { contract }).matches;
    expect(match.governance).toEqual({
      visibility: 'internal',
      overridable: false,
      reason: 'internal-primitive',
    });
  });

  it('marks a token outside the contract as non-overridable', () => {
    const [match] = lookupTokens(source, 'spacing.md', { contract }).matches;
    expect(match.governance).toEqual({
      visibility: 'internal',
      overridable: false,
      reason: 'not-in-contract',
    });
  });

  it('annotates prefix lookups too', () => {
    const result = lookupTokens(source, 'color.text', { contract });
    expect(result.mode).toBe('prefix');
    expect(result.matches.every((m) => m.governance?.visibility === 'public')).toBe(true);
  });

  it('leaves the token lookup shape otherwise unchanged', () => {
    const withContract = lookupTokens(source, 'color.text.default', { contract });
    const without = lookupTokens(source, 'color.text.default');
    const { governance, ...rest } = withContract.matches[0];
    expect(governance).toBeDefined();
    expect(rest).toEqual(without.matches[0]);
  });
});
