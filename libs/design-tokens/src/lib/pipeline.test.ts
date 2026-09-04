import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildTokenOutputs } from './pipeline.js';

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TOKENS_DIR = path.join(PKG_ROOT, 'tokens');

type Outputs = { distDir: string; generatedDir: string };

/** 임시 디렉터리에 전체 파이프라인을 1회 실행한다. dist/ 와 .generated/ 는 건드리지 않는다. */
const buildInto = async (label: string): Promise<Outputs> => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), `ds-tokens-${label}-`));
  const outputs = { distDir: path.join(root, 'dist'), generatedDir: path.join(root, 'generated') };
  await buildTokenOutputs({ tokensDir: TOKENS_DIR, ...outputs });
  return outputs;
};

/** 디렉터리 아래 모든 파일의 상대 경로를 정렬해 반환. */
const listFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => path.relative(dir, path.join(e.parentPath, e.name)))
    .sort();
};

/** 디렉터리 아래 모든 파일을 `상대경로 -> 내용` 맵으로 읽는다. */
const readTree = async (dir: string): Promise<Record<string, string>> => {
  const files = await listFiles(dir);
  const out: Record<string, string> = {};
  for (const f of files) out[f] = await fs.readFile(path.join(dir, f), 'utf8');
  return out;
};

const roots: string[] = [];
let first: Outputs;
let css: string;
let lightCss: string;
let catalog: {
  schema: string;
  themes: string[];
  categories: string[];
  tokens: Record<string, unknown[]>;
};

beforeAll(async () => {
  first = await buildInto('a');
  roots.push(path.dirname(first.distDir));
  css = await fs.readFile(path.join(first.distDir, 'css', 'variables.css'), 'utf8');
  lightCss = await fs.readFile(path.join(first.distDir, 'css', 'variables.light.css'), 'utf8');
  catalog = JSON.parse(await fs.readFile(path.join(first.distDir, 'tokens.json'), 'utf8'));
}, 60_000);

afterAll(async () => {
  for (const root of roots) await fs.rm(root, { recursive: true, force: true });
});

describe('default build parity', () => {
  it('writes exactly the current dist artifact set', async () => {
    expect(await listFiles(first.distDir)).toEqual([
      'contract.json',
      'css/index.d.ts',
      'css/variables.css',
      'css/variables.dark.css',
      'css/variables.light.css',
      'css/variables.sepia.css',
      'tokens.json',
    ]);
  });

  it('writes exactly the current generated artifact set', async () => {
    expect(await listFiles(first.generatedDir)).toEqual([
      'rn/index.ts',
      'rn/themes/dark/tokens.ts',
      'rn/themes/light/tokens.ts',
      'rn/themes/sepia/tokens.ts',
      'tailwind/preset.ts',
      'web/index.ts',
      'web/themes/dark/tokens.ts',
      'web/themes/light/tokens.ts',
      'web/themes/sepia/tokens.ts',
    ]);
  });

  it('opens each theme file with that theme selector', async () => {
    const selectorOf = async (file: string) =>
      (await fs.readFile(path.join(first.distDir, 'css', file), 'utf8')).split('\n')[0];

    expect(await selectorOf('variables.light.css')).toBe(':root {');
    expect(await selectorOf('variables.dark.css')).toBe('[data-theme="dark"], .theme-dark {');
    expect(await selectorOf('variables.sepia.css')).toBe('[data-theme="sepia"], .theme-sepia {');
  });

  it('merges base plus every override into variables.css', () => {
    expect(css.startsWith(':root {')).toBe(true);
    expect(css).toContain('[data-theme="dark"], .theme-dark {');
    expect(css).toContain('[data-theme="sepia"], .theme-sepia {');
  });

  it('emits only overrides in non-base theme files', async () => {
    const darkCss = await fs.readFile(
      path.join(first.distDir, 'css', 'variables.dark.css'),
      'utf8',
    );
    const decls = (s: string) => s.split('\n').filter((l) => l.includes(': ')).length;

    expect(decls(darkCss)).toBeGreaterThan(0);
    expect(decls(darkCss)).toBeLessThan(decls(lightCss));
    expect(darkCss).toContain('--ds-primary-pr700: #136F47;');
    expect(darkCss).not.toContain('--ds-success-su500:');
  });

  it('keeps the side-effect css type shim', async () => {
    const shim = await fs.readFile(path.join(first.distDir, 'css', 'index.d.ts'), 'utf8');
    expect(shim).toBe('// AUTO-GENERATED\nexport {};\n');
  });

  it('re-exports each theme as a capitalized namespace', async () => {
    const index = await fs.readFile(path.join(first.generatedDir, 'web', 'index.ts'), 'utf8');
    expect(index).toContain("export * as Light from './themes/light/tokens.js';");
    expect(index).toContain("export * as Dark from './themes/dark/tokens.js';");
    expect(index).toContain("export * as Sepia from './themes/sepia/tokens.js';");
  });
});

describe('css variable naming', () => {
  it('prefixes every declaration with --ds-', () => {
    const names = [...lightCss.matchAll(/^ {2}(--[\w-]+):/gm)].map((m) => m[1]);
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => n.startsWith('--ds-'))).toBe(true);
  });

  it('kebab-cases camelCase token segments', () => {
    expect(lightCss).toContain('--ds-font-size-md:');
    expect(lightCss).toContain('--ds-primitive-border-hairline:');
    expect(lightCss).toContain('--ds-elevation-0-offset-x:');
  });

  it('sorts declarations by variable name within a block', () => {
    const names = [...lightCss.matchAll(/^ {2}(--[\w-]+):/gm)].map((m) => m[1]);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('emits web rem values', () => {
    expect(lightCss).toContain('--ds-spacing-md: 0.75rem;');
    expect(lightCss).toContain('--ds-radius-md: 0.5rem;');
  });
});

describe('color rgb channel generation', () => {
  it('pairs every color with an -rgb channel declaration', () => {
    expect(lightCss).toContain('--ds-background-primary: #047857;');
    expect(lightCss).toContain('--ds-background-primary-rgb: 4 120 87;');
  });

  it('does not generate -rgb for non-color tokens', () => {
    const rgbNames = [...lightCss.matchAll(/^ {2}(--[\w-]+)-rgb:/gm)].map((m) => m[1]);
    for (const base of rgbNames) {
      expect(lightCss).toContain(`${base}: #`);
    }
    expect(lightCss).not.toContain('--ds-spacing-md-rgb:');
    expect(lightCss).not.toContain('--ds-font-size-md-rgb:');
    expect(lightCss).not.toContain('--ds-radius-md-rgb:');
  });

  it('generates rgb overrides alongside color overrides in theme files', async () => {
    const darkCss = await fs.readFile(
      path.join(first.distDir, 'css', 'variables.dark.css'),
      'utf8',
    );
    expect(darkCss).toContain('--ds-primary-pr700-rgb: 19 111 71;');
  });
});

describe('tokens.json catalog ABI', () => {
  it('keeps the current top-level shape', () => {
    expect(Object.keys(catalog)).toEqual(['schema', 'themes', 'categories', 'tokens']);
    expect(catalog.schema).toBe('tokens[path] = [cssVar, ...valuesInThemesOrder]');
  });

  it('lists themes in registry order', () => {
    expect(catalog.themes).toEqual(['light', 'dark', 'sepia']);
  });

  it('lists the nine categories sorted', () => {
    expect(catalog.categories).toEqual([
      'border',
      'borderWidth',
      'color',
      'component',
      'elevation',
      'radius',
      'shadow',
      'spacing',
      'typography',
    ]);
  });

  it('keys rows by classified dot path', () => {
    expect(catalog.tokens['color.background.primary']).toBeDefined();
    expect(catalog.tokens['borderWidth.primitive.hairline']).toBeDefined();
    expect(catalog.tokens['typography.fontSize.md']).toBeDefined();
    expect(catalog.tokens['component.button']).toBeDefined();
  });

  it('uses the positional row shape [cssVar, ...valuesInThemesOrder]', () => {
    expect(catalog.tokens['color.background.primary']).toEqual([
      '--ds-background-primary',
      '#047857',
      '#136F47',
      '#1A6E37',
    ]);
    expect(catalog.tokens['spacing.md']).toEqual([
      '--ds-spacing-md',
      '0.75rem',
      '0.75rem',
      '0.75rem',
    ]);
  });

  it('gives every row one cssVar plus one value per theme', () => {
    const rows = Object.values(catalog.tokens);
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row).toHaveLength(1 + catalog.themes.length);
      expect(String(row[0]).startsWith('--ds-')).toBe(true);
    }
  });

  it('reports web values, not rn values', () => {
    expect(catalog.tokens['spacing.md'][1]).toBe('0.75rem');
  });

  it('orders rows deterministically by ascending path', () => {
    const ids = Object.keys(catalog.tokens);
    expect(ids).toEqual([...ids].sort());
  });
});

describe('deterministic generation', () => {
  it('produces byte-identical output when built twice from the same input', async () => {
    const second = await buildInto('b');
    roots.push(path.dirname(second.distDir));

    expect(await readTree(second.distDir)).toEqual(await readTree(first.distDir));
    expect(await readTree(second.generatedDir)).toEqual(await readTree(first.generatedDir));
  }, 60_000);
});
