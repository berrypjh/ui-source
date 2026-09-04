/**
 * Consumer compiler가 Shared 빌드를 건드리지 않는다는 것을 고정한다.
 * Command 01 baseline 유지가 이 단계의 가장 중요한 성질이다.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { defineTokenExtension } from '../extension/defineTokenExtension.js';
import { buildTokenOutputs } from '../lib/pipeline.js';
import { buildThemeDictionaries, type ThemeBuild } from '../lib/sd.js';
import { themes } from '../themes.js';

import { compileExtension } from './compileExtension.js';

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TOKENS_DIR = path.join(PKG_ROOT, 'tokens');

const roots: string[] = [];
let builds: ThemeBuild[];

const tmp = async (label: string) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), `ds-parity-${label}-`));
  roots.push(dir);
  return dir;
};

/** 디렉터리 전체를 `상대경로 -> 내용` 맵으로 읽는다. */
const readTree = async (dir: string): Promise<Record<string, string>> => {
  const entries = await fs.readdir(dir, { recursive: true, withFileTypes: true });
  const out: Record<string, string> = {};
  for (const e of entries) {
    if (!e.isFile()) continue;
    const abs = path.join(e.parentPath, e.name);
    out[path.relative(dir, abs)] = await fs.readFile(abs, 'utf8');
  }
  return out;
};

/** Shared 기본 산출물을 새 임시 디렉터리에 빌드한다. */
const buildShared = async (label: string) => {
  const root = await tmp(label);
  const paths = { distDir: path.join(root, 'dist'), generatedDir: path.join(root, 'generated') };
  await buildTokenOutputs({ tokensDir: TOKENS_DIR, ...paths });
  return { root, ...paths };
};

beforeAll(async () => {
  builds = await buildThemeDictionaries(themes, TOKENS_DIR);
}, 60_000);

afterAll(async () => {
  for (const root of roots) await fs.rm(root, { recursive: true, force: true });
});

describe('no-extension parity', () => {
  it('leaves the shared build byte-identical after compiling an extension', async () => {
    const before = await buildShared('before');
    const beforeTree = await readTree(before.root);

    const outDir = await tmp('consumer');
    const result = await compileExtension(
      builds,
      defineTokenExtension({
        name: 'acme',
        semantic: { 'color.background.primary': '#5B21B6' },
      }),
      { outDir },
    );
    expect(result.ok).toBe(true);

    // 컴파일 이후 다시 빌드해도 같은 결과여야 한다.
    const after = await buildShared('after');
    expect(await readTree(after.root)).toEqual(beforeTree);
  }, 60_000);

  it('writes consumer artifacts only under the given outDir', async () => {
    const outDir = await tmp('scoped');
    await compileExtension(
      builds,
      defineTokenExtension({ name: 'acme', semantic: { 'color.text.default': '#111827' } }),
      { outDir },
    );

    const written = Object.keys(await readTree(outDir)).sort();
    expect(written).toEqual([
      'css/variables.css',
      'css/variables.dark.css',
      'css/variables.light.css',
      'css/variables.sepia.css',
      'manifest.json',
      'rn/index.ts',
      'rn/themes/dark/tokens.ts',
      'rn/themes/light/tokens.ts',
      'rn/themes/sepia/tokens.ts',
    ]);
  });

  it('emits no web ts tree — the web build stays css-driven', async () => {
    const outDir = await tmp('nowebts');
    const result = await compileExtension(
      builds,
      defineTokenExtension({ name: 'acme', semantic: { 'color.text.default': '#111827' } }),
      { outDir },
    );
    expect(result.manifest?.files.some((f) => f.startsWith('web/'))).toBe(false);
  });

  it('keeps no consumer value in the shared token source', async () => {
    const sources = await fs.readdir(TOKENS_DIR, { recursive: true, withFileTypes: true });
    for (const entry of sources) {
      if (!entry.isFile()) continue;
      const content = await fs.readFile(path.join(entry.parentPath, entry.name), 'utf8');
      expect(content).not.toContain('#5B21B6');
      expect(content).not.toContain('acme');
    }
  });
});
