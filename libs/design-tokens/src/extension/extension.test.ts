import { describe, expect, it } from 'vitest';

import { defineTokenExtension } from './defineTokenExtension.js';
import { normalizeExtension, referenceTarget } from './normalize.js';
import type { TokenExtension } from './types.js';
import { assertValidExtension, validateExtension } from './validate.js';

/**
 * 타입이 거부하는 정의를 런타임 경로에서 확인하기 위한 탈출구.
 * JS 소비자나 동적으로 만들어진 정의가 이 경로로 들어온다.
 */
const untyped = (definition: unknown): TokenExtension => definition as TokenExtension;

const codes = (definition: TokenExtension) => validateExtension(definition).map((i) => i.code);

describe('defineTokenExtension', () => {
  it('accepts a minimal extension', () => {
    const ext = defineTokenExtension({ name: 'minimal' });
    expect(ext.name).toBe('minimal');
    expect(validateExtension(ext)).toEqual([]);
  });

  it('returns the definition unchanged', () => {
    const ext = defineTokenExtension({
      name: 'acme',
      semantic: { 'color.text.default': '#111827' },
    });
    expect(ext.semantic).toEqual({ 'color.text.default': '#111827' });
  });

  it('freezes the definition against accidental mutation', () => {
    const ext = defineTokenExtension({ name: 'acme' });
    expect(Object.isFrozen(ext)).toBe(true);
    expect(() => {
      (ext as { name: string }).name = 'other';
    }).toThrow();
  });

  it('rejects an empty name', () => {
    expect(codes(defineTokenExtension({ name: '   ' }))).toEqual(['missing-name']);
  });
});

describe('valid authoring', () => {
  const acme = defineTokenExtension({
    name: 'acme',
    source: {
      brand: {
        primary: '#5B21B6',
        primaryDark: '#4C1D95',
        ink: { strong: '#111827' },
      },
    },
    semantic: {
      'color.background.primary': '{brand.primary}',
      'color.text.default': '{brand.ink.strong}',
      'borderWidth.semantic.focus': 3,
    },
    modes: {
      dark: { 'color.background.primary': '{brand.primaryDark}' },
      sepia: { 'color.text.default': '#3B2F1E' },
    },
  });

  it('validates a full light/dark/sepia partial extension', () => {
    expect(validateExtension(acme)).toEqual([]);
  });

  it('resolves brand aliases against the extension private source', () => {
    const base = normalizeExtension(acme).semantic.find(
      (o) => o.path === 'color.background.primary' && !o.mode,
    );
    expect(base?.reference).toBe('brand.primary');
  });

  it('allows a mode to override only some paths', () => {
    const darkPaths = normalizeExtension(acme)
      .semantic.filter((o) => o.mode === 'dark')
      .map((o) => o.path);
    expect(darkPaths).toEqual(['color.background.primary']);
  });

  it('accepts an explicit $type that matches the contract', () => {
    const ext = defineTokenExtension({
      name: 'explicit',
      semantic: {
        'color.text.default': { $value: '#111827', $type: 'color' },
        'borderWidth.semantic.focus': { $value: 2, $type: 'dimension' },
      },
    });
    expect(validateExtension(ext)).toEqual([]);
  });

  it('allows referencing another public contract token', () => {
    const ext = defineTokenExtension({
      name: 'alias-public',
      semantic: { 'color.icon.primary': '{color.text.primary}' },
    });
    expect(validateExtension(ext)).toEqual([]);
  });
});

describe('canonical path normalization', () => {
  it('flattens a nested brand tree into dot-paths', () => {
    const ext = defineTokenExtension({
      name: 'nested',
      source: { brand: { ink: { strong: '#111827', muted: '#6B7280' } }, unit: 4 },
    });
    expect(normalizeExtension(ext).source).toEqual([
      { path: 'brand.ink.muted', value: '#6B7280', type: 'color' },
      { path: 'brand.ink.strong', value: '#111827', type: 'color' },
      { path: 'unit', value: 4, type: 'dimension' },
    ]);
  });

  it('keeps semantic keys as canonical contract paths', () => {
    const ext = defineTokenExtension({
      name: 'canonical',
      semantic: { 'color.text.default': '#111827' },
    });
    expect(normalizeExtension(ext).semantic).toEqual([
      { path: 'color.text.default', value: '#111827', type: 'color' },
    ]);
  });

  it('tags mode overrides and leaves base overrides without a mode', () => {
    const ext = defineTokenExtension({
      name: 'modes',
      semantic: { 'color.text.default': '#111827' },
      modes: { dark: { 'color.text.default': '#F9FAFB' } },
    });
    const normalized = normalizeExtension(ext).semantic;
    expect(normalized.find((o) => !o.mode)?.value).toBe('#111827');
    expect(normalized.find((o) => o.mode === 'dark')?.value).toBe('#F9FAFB');
  });

  it('unwraps the DTCG explicit form to the same canonical shape', () => {
    const shorthand = normalizeExtension(
      defineTokenExtension({ name: 'a', semantic: { 'color.text.default': '#111827' } }),
    );
    const explicit = normalizeExtension(
      defineTokenExtension({
        name: 'a',
        semantic: { 'color.text.default': { $value: '#111827', $type: 'color' } },
      }),
    );
    expect(explicit.semantic[0].value).toBe(shorthand.semantic[0].value);
    expect(explicit.semantic[0].path).toBe(shorthand.semantic[0].path);
  });

  it('orders output deterministically', () => {
    const ext = defineTokenExtension({
      name: 'ordered',
      semantic: { 'color.text.link': '#2563EB', 'color.background.dark': '#000000' },
      modes: { sepia: { 'color.text.default': '#3B2F1E' }, dark: { 'color.text.link': '#60A5FA' } },
    });
    const run = () => normalizeExtension(ext).semantic.map((o) => `${o.mode ?? '*'}:${o.path}`);
    expect(run()).toEqual([
      '*:color.background.dark',
      '*:color.text.link',
      'dark:color.text.link',
      'sepia:color.text.default',
    ]);
    expect(run()).toEqual(run());
  });

  it('does not mutate the input definition', () => {
    const ext = defineTokenExtension({
      name: 'pure',
      source: { brand: { primary: '#5B21B6' } },
      semantic: { 'color.text.default': '#111827' },
    });
    const before = JSON.stringify(ext);
    normalizeExtension(ext);
    validateExtension(ext);
    expect(JSON.stringify(ext)).toBe(before);
  });
});

describe('private brand source stays private', () => {
  it('keeps source tokens out of the semantic override list', () => {
    const ext = defineTokenExtension({
      name: 'private',
      source: { brand: { primary: '#5B21B6' } },
      semantic: { 'color.background.primary': '{brand.primary}' },
    });
    const normalized = normalizeExtension(ext);

    expect(normalized.source.map((t) => t.path)).toEqual(['brand.primary']);
    expect(normalized.semantic.map((o) => o.path)).toEqual(['color.background.primary']);
    // brand 값은 어떤 public path로도 새어 나가지 않는다.
    expect(normalized.semantic.some((o) => o.path.startsWith('brand'))).toBe(false);
  });

  it('does not require the consumer to declare source at all', () => {
    const ext = defineTokenExtension({
      name: 'no-source',
      semantic: { 'color.text.default': '#111827' },
    });
    expect(normalizeExtension(ext).source).toEqual([]);
    expect(validateExtension(ext)).toEqual([]);
  });
});

describe('reference policy', () => {
  it('extracts the target of an alias', () => {
    expect(referenceTarget('{brand.primary}')).toBe('brand.primary');
    expect(referenceTarget('#111827')).toBeUndefined();
    expect(referenceTarget(12)).toBeUndefined();
  });

  it('rejects a reference to an internal primitive', () => {
    const ext = untyped({
      name: 'primitive-ref',
      semantic: { 'color.background.primary': '{color.primary.pr700}' },
    });
    expect(codes(ext)).toEqual(['primitive-reference']);
  });

  it('rejects a reference to an unknown path', () => {
    const ext = untyped({
      name: 'unknown-ref',
      semantic: { 'color.background.primary': '{brand.missing}' },
    });
    expect(codes(ext)).toEqual(['unknown-reference']);
  });

  it('rejects a primitive reference from the private source too', () => {
    const ext = untyped({
      name: 'source-backdoor',
      source: { brand: { primary: '{color.primary.pr700}' } },
    });
    expect(codes(ext)).toEqual(['primitive-reference']);
  });
});

describe('runtime validation of definitions the types would reject', () => {
  it('reports an unknown contract path', () => {
    const ext = untyped({ name: 'x', semantic: { 'color.text.nope': '#FFFFFF' } });
    expect(codes(ext)).toEqual(['unknown-path']);
  });

  it('reports an internal primitive override target', () => {
    const ext = untyped({ name: 'x', semantic: { 'color.primary.pr700': '#FFFFFF' } });
    expect(codes(ext)).toEqual(['primitive-target']);
  });

  it('reports a raw scale target that is not public in v1', () => {
    const ext = untyped({ name: 'x', semantic: { 'spacing.md': 8 } });
    expect(codes(ext)).toEqual(['unknown-path']);
  });

  it('reports a component-local runtime token as outside the contract', () => {
    const ext = untyped({ name: 'x', semantic: { 'ui.btn.bg': '#FFFFFF' } });
    expect(codes(ext)).toEqual(['unknown-path']);
  });

  it('reports an explicit $type that contradicts the contract', () => {
    const ext = untyped({
      name: 'x',
      semantic: { 'color.text.default': { $value: '#111827', $type: 'dimension' } },
    });
    expect(codes(ext)).toContain('type-mismatch');
  });

  it('reports a value whose type contradicts the contract', () => {
    const ext = untyped({ name: 'x', semantic: { 'borderWidth.semantic.focus': '#111827' } });
    expect(codes(ext)).toEqual(['type-mismatch']);
  });

  it('collects every issue instead of stopping at the first', () => {
    const ext = untyped({
      name: '',
      semantic: { 'color.text.nope': '#FFFFFF', 'color.primary.pr700': '#FFFFFF' },
    });
    expect(codes(ext).sort()).toEqual(['missing-name', 'primitive-target', 'unknown-path']);
  });
});

describe('assertValidExtension', () => {
  it('passes a valid definition', () => {
    expect(() => assertValidExtension(defineTokenExtension({ name: 'ok' }))).not.toThrow();
  });

  it('throws with the extension name and every issue', () => {
    const ext = untyped({ name: 'bad', semantic: { 'color.text.nope': '#FFFFFF' } });
    expect(() => assertValidExtension(ext)).toThrow(/Invalid token extension "bad"/);
    expect(() => assertValidExtension(ext)).toThrow(/unknown-path/);
  });
});
