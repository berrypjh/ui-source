import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';

import { themes } from '../themes.js';

import {
  INTERNAL_PRIMITIVE_ROOTS,
  isInternalPrimitive,
  isOverridable,
  publicContractEntries,
  publicOverridePaths,
  resolveTokenContract,
  type TokenContractEntry,
} from './contract.js';
import { buildThemeDictionaries } from './sd.js';
import { classifyTokenPath, getTokenType } from './tokens.js';

const TOKENS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../tokens');

/** canonical path -> DTCG type, base 테마 기준. */
let graph: Map<string, string | undefined>;
/** canonical path -> 테마별 값 존재 여부. */
let perTheme: Map<string, Set<string>>;

beforeAll(async () => {
  const builds = await buildThemeDictionaries(themes, TOKENS_DIR);
  graph = new Map();
  perTheme = new Map();

  for (const build of builds) {
    for (const token of build.web.allTokens) {
      const canonical = classifyTokenPath(token.path).join('.');
      if (build.theme === themes[0].name) graph.set(canonical, getTokenType(token));
      if (!perTheme.has(canonical)) perTheme.set(canonical, new Set());
      perTheme.get(canonical)?.add(build.theme);
    }
  }
}, 60_000);

describe('contract integrity', () => {
  it('has no duplicate paths', () => {
    const paths = publicContractEntries.map((e) => e.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('exposes a non-empty allowlist', () => {
    expect(publicContractEntries.length).toBeGreaterThan(0);
  });

  it('marks every entry public and overridable in v1', () => {
    for (const entry of publicContractEntries) {
      expect(entry.visibility).toBe('public');
      expect(entry.overridable).toBe(true);
    }
  });

  it('uses leaf paths only, never a category or family wildcard', () => {
    for (const entry of publicContractEntries) {
      expect(entry.path).not.toContain('*');
      // 어떤 entry도 다른 entry의 조상 prefix일 수 없다.
      for (const other of publicContractEntries) {
        if (other.path !== entry.path) {
          expect(other.path.startsWith(`${entry.path}.`)).toBe(false);
        }
      }
    }
  });

  it('orders publicOverridePaths deterministically', () => {
    const first = publicOverridePaths();
    expect(first).toEqual([...first].sort());
    expect(publicOverridePaths()).toEqual(first);
  });
});

describe('contract matches the token graph', () => {
  it('resolves every contract path to a real token', () => {
    const missing = publicContractEntries.filter((e) => !graph.has(e.path)).map((e) => e.path);
    expect(missing).toEqual([]);
  });

  it('declares the expected type for every contract path', () => {
    const mismatched = publicContractEntries
      .filter((e) => graph.get(e.path) !== e.type)
      .map((e) => `${e.path}: declared ${e.type}, graph ${graph.get(e.path)}`);
    expect(mismatched).toEqual([]);
  });

  it('defines every public path in every registered theme', () => {
    const themeNames = themes.map((t) => t.name);
    for (const entry of publicContractEntries) {
      expect([...(perTheme.get(entry.path) ?? [])].sort()).toEqual([...themeNames].sort());
    }
  });
});

describe('primitive deny-by-default', () => {
  it('recognises every declared primitive root', () => {
    for (const root of INTERNAL_PRIMITIVE_ROOTS) {
      expect(isInternalPrimitive(`${root}.anything`)).toBe(true);
      expect(isInternalPrimitive(root)).toBe(true);
    }
  });

  it('does not classify semantic paths as primitive', () => {
    expect(isInternalPrimitive('color.text.default')).toBe(false);
    expect(isInternalPrimitive('color.background.primary')).toBe(false);
    // prefix가 겹치는 이름에 걸리지 않는다.
    expect(isInternalPrimitive('color.primaryBtn.default')).toBe(false);
  });

  it('never marks a primitive path overridable', () => {
    const leaked = publicContractEntries.filter((e) => isInternalPrimitive(e.path));
    expect(leaked).toEqual([]);
  });

  it('denies every colour ramp leaf present in the graph', () => {
    const ramps = [...graph.keys()].filter((p) => isInternalPrimitive(p));
    expect(ramps.length).toBeGreaterThan(0);
    for (const p of ramps) expect(isOverridable(p)).toBe(false);
  });

  it('opts component tokens in one by one, never as a category', () => {
    const componentPaths = [...graph.keys()].filter((p) => p.startsWith('component.')).sort();
    expect(componentPaths).toEqual([
      'component.button',
      'component.field.focusRingWidth',
      'component.field.height.md',
      'component.field.height.sm',
    ]);

    // 폼 컨트롤 높이는 input-base/select 가 공유하고 RN 이 숫자로 필요로 해 opt-in 했다.
    expect(isOverridable('component.field.height.sm')).toBe(true);
    expect(isOverridable('component.field.height.md')).toBe(true);
    expect(isOverridable('component.field.focusRingWidth')).toBe(true);

    // component.button 은 아직 소비처가 없어 internal 이다 — 카테고리 전체 공개가 아니다.
    expect(isOverridable('component.button')).toBe(false);
  });

  it('denies raw scales that are not part of the v1 public surface', () => {
    for (const p of ['spacing.md', 'radius.md', 'typography.fontSize.md', 'shadow.lg.1.blur']) {
      expect(graph.has(p)).toBe(true);
      expect(isOverridable(p)).toBe(false);
    }
  });

  it('denies unknown paths rather than defaulting to allow', () => {
    expect(isOverridable('color.text.doesNotExist')).toBe(false);
    expect(isOverridable('')).toBe(false);
  });
});

describe('resolveTokenContract', () => {
  it('returns the declared entry for a public path', () => {
    const entry = resolveTokenContract('color.text.default', 'color');
    expect(entry.visibility).toBe('public');
    expect(entry.overridable).toBe(true);
  });

  it('synthesises an internal deny entry for an unlisted path', () => {
    const entry = resolveTokenContract('color.primary.pr700', 'color');
    expect(entry).toEqual({
      path: 'color.primary.pr700',
      type: 'color',
      visibility: 'internal',
      overridable: false,
      stability: 'stable',
    });
  });
});

describe('deprecation metadata', () => {
  const deprecated = () => publicContractEntries.filter((e) => e.deprecated);

  it('pairs every deprecated entry with a replacement', () => {
    for (const entry of deprecated()) {
      expect(entry.replacement, `${entry.path} is deprecated without a replacement`).toBeTruthy();
    }
  });

  it('points every replacement at another contract path', () => {
    const known = new Set(publicContractEntries.map((e) => e.path));
    for (const entry of deprecated()) {
      expect(known.has(entry.replacement as string)).toBe(true);
    }
  });

  it('never leaves a replacement without the deprecated flag', () => {
    for (const entry of publicContractEntries) {
      if (entry.replacement) expect(entry.deprecated).toBe(true);
    }
  });

  it('never lets a replacement chain point at itself', () => {
    for (const entry of deprecated()) expect(entry.replacement).not.toBe(entry.path);
  });

  it('validates deprecation metadata even though nothing is deprecated yet', () => {
    expect(deprecated()).toEqual([]);

    // 실제 deprecated token이 없어도 표현·검증 가능해야 한다.
    const fixture: TokenContractEntry = {
      path: 'color.text.legacy',
      type: 'color',
      visibility: 'public',
      overridable: false,
      stability: 'experimental',
      deprecated: true,
      replacement: 'color.text.default',
    };
    expect(fixture.deprecated).toBe(true);
    expect(fixture.replacement).toBe('color.text.default');
    expect(publicOverridePaths()).toContain(fixture.replacement);
  });
});

describe('stability metadata', () => {
  it('uses only the declared stability values', () => {
    for (const entry of publicContractEntries) {
      expect(['stable', 'experimental']).toContain(entry.stability);
    }
  });

  it('keeps the tokens consumed by shared components stable', () => {
    const stable = new Set(
      publicContractEntries.filter((e) => e.stability === 'stable').map((e) => e.path),
    );
    for (const p of [
      'color.text.default',
      'color.text.contrastText',
      'color.text.disable',
      'color.background.primary',
      'color.stroke.error',
      'color.primaryBtn.default',
      'border.primary.width',
      'borderWidth.semantic.focus',
    ]) {
      expect(stable.has(p), `${p} should be a stable public token`).toBe(true);
    }
  });
});
