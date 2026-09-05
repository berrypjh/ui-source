import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { defineTokenExtension } from '../extension/defineTokenExtension.js';
import type { TokenExtension } from '../extension/types.js';
import { buildThemeDictionaries, type ThemeBuild } from '../lib/sd.js';
import { themes } from '../themes.js';

import { compileExtension, type CompileResult } from './compileExtension.js';
import { scopeSelector } from './selector.js';

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TOKENS_DIR = path.join(PKG_ROOT, 'tokens');

let builds: ThemeBuild[];
const roots: string[] = [];

const compile = async (ext: TokenExtension, scope?: string) => {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ds-compile-'));
  roots.push(outDir);
  const result = await compileExtension(builds, ext, { outDir, ...(scope ? { scope } : {}) });
  return { outDir, result };
};

const read = (outDir: string, rel: string) => fs.readFile(path.join(outDir, rel), 'utf8');

/** 컴파일된 RN 테마 모듈에서 tokens 트리를 꺼낸다. */
const rnTokens = async (outDir: string, theme: string): Promise<Record<string, never>> => {
  const src = await read(outDir, `rn/themes/${theme}/tokens.ts`);
  const body = src.slice(src.indexOf('= {') + 2, src.lastIndexOf('} as const') + 1);
  return JSON.parse(body);
};

/** 브랜드 색 하나만 바꾸는 대표 extension. */
const acme = defineTokenExtension({
  name: 'acme',
  source: { brand: { primary: '#5B21B6', primaryDark: '#A78BFA' } },
  semantic: { 'color.background.primary': '{brand.primary}' },
  modes: { dark: { 'color.background.primary': '{brand.primaryDark}' } },
});

beforeAll(async () => {
  builds = await buildThemeDictionaries(themes, TOKENS_DIR);
}, 60_000);

afterAll(async () => {
  for (const root of roots) await fs.rm(root, { recursive: true, force: true });
});

describe('css delta', () => {
  it('emits only the variables that changed', async () => {
    const { outDir } = await compile(acme);
    const light = await read(outDir, 'css/variables.light.css');
    const decls = light.split('\n').filter((l) => l.includes(': '));

    // 색 하나 → 값 변수 + RGB 변수, 딱 둘.
    expect(decls).toHaveLength(2);
    expect(light).toContain('--ds-background-primary: #5B21B6;');
  });

  it('derives the rgb channel variable automatically', async () => {
    const { outDir } = await compile(acme);
    expect(await read(outDir, 'css/variables.light.css')).toContain(
      '--ds-background-primary-rgb: 91 33 182;',
    );
  });

  it('leaves non-overridden tokens to the shared css', async () => {
    const { outDir } = await compile(acme);
    const light = await read(outDir, 'css/variables.light.css');

    expect(light).not.toContain('--ds-spacing-md');
    expect(light).not.toContain('--ds-text-default');
    expect(light).not.toContain('--ds-background-secondary');
  });

  it('keeps the shared theme selector semantics', async () => {
    const { outDir } = await compile(acme);
    expect((await read(outDir, 'css/variables.light.css')).split('\n')[0]).toBe(':root {');
    expect((await read(outDir, 'css/variables.dark.css')).split('\n')[0]).toBe(
      '[data-theme="dark"], .theme-dark {',
    );
  });

  it('emits the per-mode value under the matching selector', async () => {
    const { outDir } = await compile(acme);
    expect(await read(outDir, 'css/variables.dark.css')).toContain(
      '--ds-background-primary: #A78BFA;',
    );
  });

  it('emits an empty block for a mode with no changes', async () => {
    const { outDir } = await compile(
      defineTokenExtension({
        name: 'dark-only',
        modes: { dark: { 'color.text.default': '#F9FAFB' } },
      }),
    );
    const light = await read(outDir, 'css/variables.light.css');
    expect(light.split('\n').filter((l) => l.includes(': '))).toHaveLength(0);
    expect(await read(outDir, 'css/variables.dark.css')).toContain('--ds-text-default: #F9FAFB;');
  });

  it('merges every mode into variables.css', async () => {
    const { outDir } = await compile(acme);
    const merged = await read(outDir, 'css/variables.css');
    expect(merged).toContain(':root {');
    expect(merged).toContain('[data-theme="dark"], .theme-dark {');
  });
});

describe('scope option', () => {
  it('wraps :root in the scope selector', () => {
    expect(scopeSelector(':root', '[data-brand="acme"]')).toBe('[data-brand="acme"]');
  });

  it('prefixes every comma part of a theme selector', () => {
    expect(scopeSelector('[data-theme="dark"], .theme-dark', '[data-brand="acme"]')).toBe(
      '[data-brand="acme"][data-theme="dark"], [data-brand="acme"].theme-dark',
    );
  });

  it('leaves selectors untouched when no scope is given', () => {
    expect(scopeSelector('[data-theme="dark"], .theme-dark')).toBe(
      '[data-theme="dark"], .theme-dark',
    );
  });

  it('applies the scope to compiled css', async () => {
    const { outDir } = await compile(acme, '[data-brand="acme"]');
    expect((await read(outDir, 'css/variables.light.css')).split('\n')[0]).toBe(
      '[data-brand="acme"] {',
    );
    expect((await read(outDir, 'css/variables.dark.css')).split('\n')[0]).toBe(
      '[data-brand="acme"][data-theme="dark"], [data-brand="acme"].theme-dark {',
    );
  });
});

describe('rn output', () => {
  it('emits a complete token tree per mode', async () => {
    const { outDir } = await compile(acme);

    for (const theme of ['light', 'dark', 'sepia']) {
      const tokens = await rnTokens(outDir, theme);
      expect(Object.keys(tokens)).toEqual([
        'color',
        'spacing',
        'radius',
        'borderWidth',
        'border',
        'typography',
        'shadow',
        'elevation',
        'component',
        'motion',
      ]);
    }
  });

  it('matches the shared rn tree shape exactly', async () => {
    const { outDir } = await compile(acme);
    const compiled = await rnTokens(outDir, 'light');
    const shared = JSON.parse(
      await fs
        .readFile(path.join(PKG_ROOT, 'src/.generated/rn/themes/light/tokens.ts'), 'utf8')
        .then((s) => s.slice(s.indexOf('= {') + 2, s.lastIndexOf('} as const') + 1)),
    );

    const paths = (o: unknown, p = ''): string[] =>
      o && typeof o === 'object' && !Array.isArray(o)
        ? Object.entries(o).flatMap(([k, v]) => paths(v, p ? `${p}.${k}` : k))
        : [p];

    expect(paths(compiled).sort()).toEqual(paths(shared).sort());
  });

  it('carries the override into the rn tree', async () => {
    const { outDir } = await compile(acme);
    const light = await rnTokens(outDir, 'light');
    const dark = await rnTokens(outDir, 'dark');

    expect(
      (light as never as { color: { background: { primary: string } } }).color.background.primary,
    ).toBe('#5B21B6');
    expect(
      (dark as never as { color: { background: { primary: string } } }).color.background.primary,
    ).toBe('#A78BFA');
  });

  it('falls back to shared values for non-overridden tokens', async () => {
    const { outDir } = await compile(acme);
    const t = (await rnTokens(outDir, 'light')) as never as {
      spacing: { md: number };
      color: { background: { secondary: string } };
    };

    expect(t.spacing.md).toBe(12);
    expect(t.color.background.secondary).toBe('#865A1D');
  });

  it('imports without a file extension so metro can resolve the .ts files', async () => {
    const { outDir } = await compile(acme);
    expect(await read(outDir, 'rn/index.ts')).not.toContain('/tokens.js');
  });

  it('emits a tokensByMode record covering every theme', async () => {
    const { outDir } = await compile(acme);
    const index = await read(outDir, 'rn/index.ts');

    expect(index).toContain('export const tokensByMode');
    for (const theme of ['light', 'dark', 'sepia']) {
      expect(index).toContain(`import { tokens as ${theme} } from './themes/${theme}/tokens';`);
    }
  });
});

describe('web / rn semantic parity', () => {
  it('resolves the same semantic token to the same colour on both platforms', async () => {
    const { outDir } = await compile(acme);
    const css = await read(outDir, 'css/variables.light.css');
    const rn = (await rnTokens(outDir, 'light')) as never as {
      color: { background: { primary: string } };
    };

    expect(css).toContain(`--ds-background-primary: ${rn.color.background.primary};`);
  });

  it('keeps dimension units platform-appropriate for the same token', async () => {
    const { outDir } = await compile(
      defineTokenExtension({ name: 'dim', semantic: { 'borderWidth.semantic.focus': 3 } }),
    );
    const rn = (await rnTokens(outDir, 'light')) as never as {
      borderWidth: { semantic: { focus: number } };
    };

    expect(await read(outDir, 'css/variables.light.css')).toContain(
      '--ds-semantic-border-focus: 0.1875rem;',
    );
    expect(rn.borderWidth.semantic.focus).toBe(3);
  });
});

describe('manifest', () => {
  it('records the extension, contract version, modes and files', async () => {
    const { outDir } = await compile(acme);
    const manifest = JSON.parse(await read(outDir, 'manifest.json'));

    expect(manifest.extension).toBe('acme');
    expect(manifest.contractVersion).toBe(1);
    expect(manifest.modes).toEqual(['light', 'dark', 'sepia']);
    expect(manifest.files).toContain('css/variables.light.css');
    expect(manifest.files).toContain('rn/themes/dark/tokens.ts');
    expect(manifest.warnings).toEqual([]);
  });

  it('lists files deterministically', async () => {
    const a = await compile(acme);
    const b = await compile(acme);
    expect(a.result.manifest?.files).toEqual(b.result.manifest?.files);
  });
});

describe('invalid extension', () => {
  const invalid = { name: 'bad', semantic: { 'color.primary.pr700': '#FF0000' } } as TokenExtension;

  let outDir: string;
  let result: CompileResult;

  beforeAll(async () => {
    ({ outDir, result } = await compile(invalid));
  });

  it('fails without a manifest', () => {
    expect(result.ok).toBe(false);
    expect(result.manifest).toBeUndefined();
    expect(result.diagnostics.map((d) => d.code)).toContain('primitive-target');
  });

  it('writes no files at all', async () => {
    await expect(fs.readdir(outDir)).resolves.toEqual([]);
  });
});

describe('deterministic output', () => {
  it('produces byte-identical files across runs', async () => {
    const a = await compile(acme);
    const b = await compile(acme);

    for (const rel of a.result.manifest?.files ?? []) {
      expect(await read(b.outDir, rel)).toBe(await read(a.outDir, rel));
    }
  });
});
