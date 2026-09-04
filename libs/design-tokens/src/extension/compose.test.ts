import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';

import { buildThemeDictionaries, type ThemeBuild } from '../lib/sd.js';
import { themes } from '../themes.js';

import { composeExtension } from './compose.js';
import { defineTokenExtension } from './defineTokenExtension.js';
import type { Diagnostic } from './diagnostics.js';
import type { TokenExtension } from './types.js';

const TOKENS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../tokens');

let builds: ThemeBuild[];

beforeAll(async () => {
  builds = await buildThemeDictionaries(themes, TOKENS_DIR);
}, 60_000);

/** 타입이 거부하는 정의를 런타임 경로로 넣기 위한 탈출구. */
const untyped = (definition: unknown): TokenExtension => definition as TokenExtension;

const codes = (ds: readonly Diagnostic[]) => ds.map((d) => d.code);
const compose = (ext?: TokenExtension) => composeExtension(builds, ext);
const find = (ds: readonly Diagnostic[], code: string) => ds.find((d) => d.code === code);

describe('no extension', () => {
  it('returns the shared defaults unchanged', () => {
    const result = compose();
    expect(result.ok).toBe(true);
    expect(result.diagnostics).toEqual([]);
    expect(result.themes.map((t) => t.theme)).toEqual(['light', 'dark', 'sepia']);
  });

  it('matches the shared dictionary token-for-token', () => {
    const light = compose().themes[0];
    expect(light.web.size).toBe(builds[0].web.allTokens.length);
    expect(light.web.get('color.background.primary')).toBe('#047857');
    expect(light.rn.get('spacing.md')).toBe(12);
  });

  it('carries the theme selector through', () => {
    expect(compose().themes[1].selector).toBe('[data-theme="dark"], .theme-dark');
  });
});

describe('partial override', () => {
  const acme = defineTokenExtension({
    name: 'acme',
    source: { brand: { primary: '#5B21B6', primaryDark: '#A78BFA' } },
    semantic: { 'color.background.primary': '{brand.primary}' },
    modes: { dark: { 'color.background.primary': '{brand.primaryDark}' } },
  });

  it('composes successfully with only one token changed', () => {
    const result = compose(acme);
    expect(result.ok).toBe(true);
    expect(result.diagnostics).toEqual([]);
  });

  it('applies the base override to modes that do not override it', () => {
    const result = compose(acme);
    const [light, , sepia] = result.themes;
    expect(light.web.get('color.background.primary')).toBe('#5B21B6');
    expect(sepia.web.get('color.background.primary')).toBe('#5B21B6');
  });

  it('lets a mode override win over the base override', () => {
    const dark = compose(acme).themes[1];
    expect(dark.web.get('color.background.primary')).toBe('#A78BFA');
  });

  it('keeps every non-overridden token at its shared per-mode value', () => {
    const [light, dark, sepia] = compose(acme).themes;
    // shared mode delta가 그대로 살아 있다.
    expect(light.web.get('color.background.secondary')).toBe('#865A1D');
    expect(dark.web.get('color.background.secondary')).toBe('#6A5017');
    expect(sepia.web.get('color.background.secondary')).toBe('#6B4D0E');
  });

  it('applies the override on both platforms', () => {
    const light = compose(acme).themes[0];
    expect(light.web.get('color.background.primary')).toBe('#5B21B6');
    expect(light.rn.get('color.background.primary')).toBe('#5B21B6');
  });
});

describe('missing mode fallback', () => {
  const darkOnly = defineTokenExtension({
    name: 'dark-only',
    modes: { dark: { 'color.text.default': '#F9FAFB' } },
  });

  it('uses the shared value for modes the consumer did not override', () => {
    const [light, dark, sepia] = compose(darkOnly).themes;
    const shared = builds[0].web.allTokens.find((t) => t.path.join('.') === 'text.default')?.$value;

    expect(dark.web.get('color.text.default')).toBe('#F9FAFB');
    expect(light.web.get('color.text.default')).toBe(shared);
    expect(sepia.web.get('color.text.default')).not.toBe('#F9FAFB');
  });

  it('resolves a private source alias identically in every mode', () => {
    // source는 모드 독립적이다 — 모드별 브랜드 값은 키를 나눠 표현한다.
    const ext = defineTokenExtension({
      name: 'mode-independent-source',
      source: { brand: { primary: '#5B21B6' } },
      semantic: { 'color.background.primary': '{brand.primary}' },
    });
    for (const theme of compose(ext).themes) {
      expect(theme.web.get('color.background.primary')).toBe('#5B21B6');
    }
  });
});

describe('platform value transforms', () => {
  const dims = defineTokenExtension({
    name: 'dims',
    semantic: { 'borderWidth.semantic.focus': 3 },
  });

  it('converts a dimension override to rem for web and a number for rn', () => {
    const light = compose(dims).themes[0];
    expect(light.web.get('borderWidth.semantic.focus')).toBe('0.1875rem');
    expect(light.rn.get('borderWidth.semantic.focus')).toBe(3);
  });

  it('leaves colours untransformed on both platforms', () => {
    const ext = defineTokenExtension({
      name: 'c',
      semantic: { 'color.text.default': '#123456' },
    });
    const light = compose(ext).themes[0];
    expect(light.web.get('color.text.default')).toBe('#123456');
    expect(light.rn.get('color.text.default')).toBe('#123456');
  });
});

describe('path validation', () => {
  it('rejects an unknown path', () => {
    const result = compose(untyped({ name: 'x', semantic: { 'color.text.nope': '#FFFFFF' } }));
    expect(result.ok).toBe(false);
    expect(codes(result.diagnostics)).toContain('unknown-path');
  });

  it('rejects a typo of a real path', () => {
    const result = compose(untyped({ name: 'x', semantic: { 'color.text.defualt': '#FFFFFF' } }));
    expect(result.ok).toBe(false);
    expect(find(result.diagnostics, 'unknown-path')?.path).toBe('color.text.defualt');
  });

  it('rejects an internal primitive target with a readable message', () => {
    const result = compose(untyped({ name: 'x', semantic: { 'color.primary.pr700': '#FF0000' } }));
    const d = find(result.diagnostics, 'primitive-target');
    expect(result.ok).toBe(false);
    expect(d?.extension).toBe('x');
    expect(d?.path).toBe('color.primary.pr700');
    expect(d?.message).toMatch(/internal primitive and cannot be overridden/);
  });

  it('rejects a raw scale that is not public in v1', () => {
    const result = compose(untyped({ name: 'x', semantic: { 'spacing.md': 8 } }));
    expect(codes(result.diagnostics)).toContain('unknown-path');
  });

  it('returns no composed themes when validation fails', () => {
    expect(compose(untyped({ name: 'x', semantic: { 'color.text.nope': '#FFF' } })).themes).toEqual(
      [],
    );
  });
});

describe('type validation', () => {
  it('rejects an explicit $type that contradicts the contract', () => {
    const result = compose(
      untyped({
        name: 'x',
        semantic: { 'color.text.default': { $value: '#111827', $type: 'dimension' } },
      }),
    );
    expect(result.ok).toBe(false);
    expect(codes(result.diagnostics)).toContain('type-mismatch');
  });

  it('rejects a value whose type contradicts the contract', () => {
    const result = compose(
      untyped({ name: 'x', semantic: { 'borderWidth.semantic.focus': '#111827' } }),
    );
    expect(find(result.diagnostics, 'type-mismatch')?.path).toBe('borderWidth.semantic.focus');
  });
});

describe('platform compatibility', () => {
  it('names rn when a dimension cannot be numeric', () => {
    const result = compose(
      defineTokenExtension({ name: 'x', semantic: { 'borderWidth.semantic.focus': '3px' } }),
    );
    const d = find(result.diagnostics, 'platform-incompatible');

    expect(result.ok).toBe(false);
    expect(d?.platform).toBe('rn');
    expect(d?.path).toBe('borderWidth.semantic.focus');
    expect(d?.message).toMatch(/React Native/);
  });

  it('names web when a colour yields no rgb channels', () => {
    const result = compose(
      defineTokenExtension({ name: 'x', semantic: { 'color.text.default': '#GGGGGG' } }),
    );
    const d = find(result.diagnostics, 'platform-incompatible');

    expect(result.ok).toBe(false);
    expect(d?.platform).toBe('web');
    expect(d?.message).toMatch(/--ds-\*-rgb/);
  });

  it('reports the failing platform only', () => {
    const result = compose(
      defineTokenExtension({ name: 'x', semantic: { 'borderWidth.semantic.focus': '3px' } }),
    );
    const platforms = new Set(
      result.diagnostics.filter((d) => d.code === 'platform-incompatible').map((d) => d.platform),
    );
    expect([...platforms]).toEqual(['rn']);
  });
});

describe('reference validation', () => {
  it('accepts a reference to a public shared token', () => {
    const ext = defineTokenExtension({
      name: 'x',
      semantic: { 'color.icon.primary': '{color.text.primary}' },
    });
    const result = compose(ext);
    const shared = builds[0].web.allTokens.find((t) => t.path.join('.') === 'text.primary')?.$value;

    expect(result.ok).toBe(true);
    expect(result.themes[0].web.get('color.icon.primary')).toBe(shared);
  });

  it('accepts a private source alias and resolves it transitively', () => {
    const ext = defineTokenExtension({
      name: 'x',
      source: { brand: { base: '#5B21B6', accent: '{brand.base}' } },
      semantic: { 'color.text.default': '{brand.accent}' },
    });
    const result = compose(ext);
    expect(result.ok).toBe(true);
    expect(result.themes[0].web.get('color.text.default')).toBe('#5B21B6');
  });

  it('rejects a reference that reaches an internal primitive', () => {
    const result = compose(
      untyped({ name: 'x', semantic: { 'color.text.default': '{color.primary.pr700}' } }),
    );
    const reported = result.diagnostics.filter((d) => d.code === 'primitive-reference');
    expect(result.ok).toBe(false);
    // 모드마다 한 번씩, 각각 어느 모드인지 알려준다.
    expect(reported.map((d) => d.mode)).toEqual(['dark', 'light', 'sepia']);
    expect(reported[0].path).toBe('color.text.default');
    expect(reported[0].message).toMatch(/internal primitive/);
  });

  it('rejects a dangling reference', () => {
    const result = compose(
      untyped({ name: 'x', semantic: { 'color.text.default': '{brand.missing}' } }),
    );
    expect(codes(result.diagnostics)).toContain('dangling-reference');
  });

  it('detects a self cycle and reports the chain', () => {
    const result = compose(
      untyped({ name: 'x', semantic: { 'color.text.default': '{color.text.default}' } }),
    );
    const d = find(result.diagnostics, 'reference-cycle');

    expect(result.ok).toBe(false);
    expect(d?.chain).toEqual(['color.text.default', 'color.text.default']);
  });

  it('detects a multi-node cycle and reports the chain', () => {
    const result = compose(
      untyped({
        name: 'x',
        semantic: {
          'color.text.default': '{color.text.primary}',
          'color.text.primary': '{color.icon.primary}',
          'color.icon.primary': '{color.text.default}',
        },
      }),
    );
    const d = find(result.diagnostics, 'reference-cycle');

    expect(result.ok).toBe(false);
    expect(d?.chain?.length).toBe(4);
    expect(d?.chain?.[0]).toBe(d?.chain?.at(-1));
  });

  it('detects a cycle through the private source', () => {
    const result = compose(
      untyped({
        name: 'x',
        source: { brand: { a: '{brand.b}', b: '{brand.a}' } },
        semantic: { 'color.text.default': '{brand.a}' },
      }),
    );
    expect(codes(result.diagnostics)).toContain('reference-cycle');
  });
});

describe('final completeness', () => {
  it('keeps every shared token present after composition', () => {
    const ext = defineTokenExtension({
      name: 'x',
      semantic: { 'color.background.primary': '#5B21B6' },
    });
    for (const theme of compose(ext).themes) {
      expect(theme.web.size).toBe(builds[0].web.allTokens.length);
      expect(theme.rn.size).toBe(builds[0].rn.allTokens.length);
    }
  });

  it('keeps the composed key set identical to the shared key set', () => {
    const bare = compose().themes[0];
    const overridden = compose(
      defineTokenExtension({ name: 'x', semantic: { 'color.text.default': '#111827' } }),
    ).themes[0];
    expect([...overridden.web.keys()].sort()).toEqual([...bare.web.keys()].sort());
  });
});

describe('determinism and immutability', () => {
  const ext = defineTokenExtension({
    name: 'stable',
    source: { brand: { primary: '#5B21B6' } },
    semantic: { 'color.background.primary': '{brand.primary}', 'color.text.link': '#2563EB' },
    modes: { dark: { 'color.text.link': '#60A5FA' } },
  });

  const snapshot = (r: ReturnType<typeof compose>) =>
    JSON.stringify(r.themes.map((t) => [t.theme, [...t.web].sort(), [...t.rn].sort()]));

  it('produces identical output across runs', () => {
    expect(snapshot(compose(ext))).toBe(snapshot(compose(ext)));
  });

  it('orders diagnostics deterministically', () => {
    const bad = untyped({
      name: 'x',
      semantic: { 'color.text.nope': '#FFF', 'color.primary.pr700': '#FFF', 'spacing.md': 8 },
    });
    expect(codes(compose(bad).diagnostics)).toEqual(codes(compose(bad).diagnostics));
  });

  it('does not mutate the consumer definition', () => {
    const before = JSON.stringify(ext);
    compose(ext);
    expect(JSON.stringify(ext)).toBe(before);
  });

  it('does not mutate the shared dictionaries', () => {
    const before = builds.map((b) => b.web.allTokens.map((t) => `${t.path.join('.')}=${t.$value}`));
    compose(ext);
    const after = builds.map((b) => b.web.allTokens.map((t) => `${t.path.join('.')}=${t.$value}`));
    expect(after).toEqual(before);
  });

  it('does not leak composed maps between runs', () => {
    const first = compose(ext).themes[0].web;
    (first as Map<string, unknown>).set('color.text.default', 'tampered');
    expect(compose(ext).themes[0].web.get('color.text.default')).not.toBe('tampered');
  });
});
