/**
 * 토큰 수명주기 진단 — deprecated / removed / non-overridable.
 *
 * 현재 contract에는 이런 상태의 토큰이 하나도 없다. 그래서 contract 모듈을 mock 해
 * 그 상태를 만들어 두고 검증한다. 실제 토큰을 그런 상태로 바꾸지 않고도
 * 동작을 고정할 수 있다.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it, vi } from 'vitest';

import type { TokenContractEntry } from '../lib/contract.js';

const DEPRECATED_PATH = 'color.text.link';
const REPLACEMENT_PATH = 'color.text.primary';
const REMOVED_PATH = 'color.text.removedInV2';
const FROZEN_PATH = 'color.text.frozen';

vi.mock('../lib/contract', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/contract')>();

  const removed: TokenContractEntry = {
    path: REMOVED_PATH,
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  };
  const frozen: TokenContractEntry = {
    path: FROZEN_PATH,
    type: 'color',
    visibility: 'public',
    overridable: false,
    stability: 'stable',
  };

  const entries: TokenContractEntry[] = [
    ...actual.publicContractEntries.map((e) =>
      e.path === DEPRECATED_PATH ? { ...e, deprecated: true, replacement: REPLACEMENT_PATH } : e,
    ),
    removed,
    frozen,
  ];

  return {
    ...actual,
    publicContractEntries: entries,
    isPublicPath: (p: string) => p === FROZEN_PATH || p === REMOVED_PATH || actual.isPublicPath(p),
    isOverridable: (p: string) =>
      p === FROZEN_PATH ? false : p === REMOVED_PATH || actual.isOverridable(p),
    resolveTokenContract: (p: string, t: 'color' | 'dimension') =>
      p === REMOVED_PATH || p === FROZEN_PATH
        ? {
            path: p,
            type: t,
            visibility: 'public' as const,
            overridable: true,
            stability: 'stable' as const,
          }
        : actual.resolveTokenContract(p, t),
  };
});

const { buildThemeDictionaries } = await import('../lib/sd');
const { themes } = await import('../themes');
const { composeExtension } = await import('./compose');
const { validateExtension } = await import('./validate');
type ThemeBuild = Awaited<ReturnType<typeof buildThemeDictionaries>>[number];

const TOKENS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../tokens');

let builds: ThemeBuild[];

beforeAll(async () => {
  builds = await buildThemeDictionaries(themes, TOKENS_DIR);
}, 60_000);

describe('deprecated token', () => {
  const ext = { name: 'uses-deprecated', semantic: { [DEPRECATED_PATH]: '#2563EB' } } as never;

  it('warns instead of failing the composition', () => {
    const result = composeExtension(builds, ext);
    expect(result.ok).toBe(true);
    expect(result.themes.length).toBe(3);
  });

  it('reports a structured warning the compiler can collect', () => {
    const warning = composeExtension(builds, ext).diagnostics.find(
      (d) => d.code === 'deprecated-token',
    );

    expect(warning?.severity).toBe('warning');
    expect(warning?.extension).toBe('uses-deprecated');
    expect(warning?.path).toBe(DEPRECATED_PATH);
    expect(warning?.replacement).toBe(REPLACEMENT_PATH);
    expect(warning?.message).toMatch(/deprecated; use "color.text.primary" instead/);
  });

  it('warns once per mode', () => {
    const warnings = composeExtension(builds, ext).diagnostics.filter(
      (d) => d.code === 'deprecated-token',
    );
    expect(warnings.map((w) => w.mode)).toEqual(['dark', 'light', 'sepia']);
  });

  it('still applies the deprecated override', () => {
    const light = composeExtension(builds, ext).themes.find((t) => t.theme === 'light');
    expect(light?.web.get(DEPRECATED_PATH)).toBe('#2563EB');
  });

  it('does not warn when the deprecated token is untouched', () => {
    const other = { name: 'clean', semantic: { 'color.text.default': '#111827' } } as never;
    const codes = composeExtension(builds, other).diagnostics.map((d) => d.code);
    expect(codes).not.toContain('deprecated-token');
  });
});

describe('removed token', () => {
  const ext = { name: 'uses-removed', semantic: { [REMOVED_PATH]: '#2563EB' } } as never;

  it('is a hard error, not a warning', () => {
    const result = composeExtension(builds, ext);
    const removed = result.diagnostics.find((d) => d.code === 'removed-token');

    expect(result.ok).toBe(false);
    expect(removed?.severity).toBe('error');
    expect(removed?.path).toBe(REMOVED_PATH);
    expect(removed?.message).toMatch(/no longer exists in the shared token graph/);
  });

  it('names the extension and mode', () => {
    const removed = composeExtension(builds, ext).diagnostics.find(
      (d) => d.code === 'removed-token',
    );
    expect(removed?.extension).toBe('uses-removed');
    expect(removed?.mode).toBeDefined();
  });
});

describe('public but non-overridable token', () => {
  it('is distinguished from an unknown path', () => {
    const issues = validateExtension({
      name: 'x',
      semantic: { [FROZEN_PATH]: '#2563EB' },
    } as never);

    expect(issues.map((i) => i.code)).toEqual(['non-overridable']);
    expect(issues[0].message).toMatch(/public token but is not overridable/);
  });

  it('fails the composition', () => {
    const result = composeExtension(builds, {
      name: 'x',
      semantic: { [FROZEN_PATH]: '#2563EB' },
    } as never);
    expect(result.ok).toBe(false);
    expect(result.diagnostics.map((d) => d.code)).toContain('non-overridable');
  });
});
