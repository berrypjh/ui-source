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

  it('lists the ten categories sorted', () => {
    expect(catalog.categories).toEqual([
      'border',
      'borderWidth',
      'color',
      'component',
      'elevation',
      'motion',
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

describe('composed shadow variables', () => {
  /**
   * sd-transforms가 boxShadow를 레이어 자식으로 분해하므로 바로 쓸 수 있는 단일 변수가
   * 없었다. `genCss`가 합성본을 함께 만든다 — 소비자가 자식 5개를 손으로 조합하지 않는다.
   */
  it('emits a single ready-to-use variable per shadow', () => {
    expect(lightCss).toMatch(/^ {2}--ds-shadow-lg: .+;$/m);
    expect(lightCss).toMatch(/^ {2}--ds-shadow-md: .+;$/m);
    expect(lightCss).toMatch(/^ {2}--ds-shadow-none: .+;$/m);
  });

  it('emits one per elevation step too', () => {
    for (const step of [0, 1, 2, 3, 4, 5, 6]) {
      expect(lightCss).toMatch(new RegExp(`^ {2}--ds-elevation-${step}: .+;$`, 'm'));
    }
  });

  it('joins multiple layers in numeric order', () => {
    const value = /^ {2}--ds-shadow-lg: (.+);$/m.exec(lightCss)?.[1];
    const layers = value?.split(', ') ?? [];
    expect(layers).toHaveLength(3);

    const decls = (name: string) => new RegExp(`^ {2}${name}: (.+);$`, 'm').exec(lightCss)?.[1];
    // 첫 레이어가 자식 변수들과 정확히 같은 순서·값으로 조립된다.
    expect(layers[0]).toBe(
      [
        decls('--ds-shadow-lg-1-offset-x'),
        decls('--ds-shadow-lg-1-offset-y'),
        decls('--ds-shadow-lg-1-blur'),
        decls('--ds-shadow-lg-1-spread'),
        decls('--ds-shadow-lg-1-color'),
      ].join(' '),
    );
  });

  it('prefixes inset for an inner shadow', () => {
    expect(/^ {2}--ds-shadow-inner: (.+);$/m.exec(lightCss)?.[1]).toMatch(/^inset /);
  });

  it('does not prefix inset for a drop shadow', () => {
    expect(/^ {2}--ds-shadow-lg: (.+);$/m.exec(lightCss)?.[1]).not.toMatch(/inset/);
  });

  it('keeps the expanded child variables alongside the composed one', () => {
    expect(lightCss).toMatch(/^ {2}--ds-shadow-lg-1-blur: .+;$/m);
    expect(lightCss).toMatch(/^ {2}--ds-shadow-lg-3-color: .+;$/m);
  });

  it('leaves the tokens.json catalog shape untouched', () => {
    // 합성은 CSS 전용이다 — 값 인벤토리 ABI는 그대로다.
    expect(catalog.tokens['shadow.lg']).toBeUndefined();
    expect(catalog.tokens['shadow.lg.1.blur']).toBeDefined();
  });
});
