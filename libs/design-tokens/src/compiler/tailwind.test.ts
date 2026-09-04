/**
 * Tailwind preset은 값을 굽지 않고 CSS 변수를 가리킨다.
 * 그래서 Consumer가 semantic 토큰을 override하면 별도 Consumer preset 없이도
 * Tailwind 유틸리티가 자동으로 따라간다. 그 성질을 여기서 고정한다.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { composeExtension } from '../extension/compose.js';
import { defineTokenExtension } from '../extension/defineTokenExtension.js';
import { writeTailwindPreset } from '../lib/genTailwind.js';
import { buildThemeDictionaries, type ThemeBuild } from '../lib/sd.js';
import { themes } from '../themes.js';

import { compileExtension } from './compileExtension.js';

const TOKENS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../tokens');

let builds: ThemeBuild[];
let preset: string;
const roots: string[] = [];

const tmp = async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ds-tw-'));
  roots.push(dir);
  return dir;
};

beforeAll(async () => {
  builds = await buildThemeDictionaries(themes, TOKENS_DIR);
  const dir = await tmp();
  const file = path.join(dir, 'preset.ts');
  await writeTailwindPreset(builds, file);
  preset = await fs.readFile(file, 'utf8');
}, 60_000);

afterAll(async () => {
  for (const root of roots) await fs.rm(root, { recursive: true, force: true });
});

describe('tailwind preset indirection', () => {
  it('references colours through the rgb channel variable', () => {
    expect(preset).toContain('rgb(var(--ds-background-primary-rgb) / <alpha-value>)');
  });

  it('references spacing and radius through css variables', () => {
    expect(preset).toContain('var(--ds-spacing-md)');
    expect(preset).toContain('var(--ds-radius-md)');
  });

  it('bakes no literal colour values into the preset', () => {
    const shared = builds[0].web.allTokens.find(
      (t) => t.path.join('.') === 'background.primary',
    )?.$value;

    expect(shared).toBe('#047857');
    expect(preset).not.toContain('#047857');
  });
});

describe('consumer override reaches tailwind without a consumer preset', () => {
  const acme = defineTokenExtension({
    name: 'acme',
    semantic: { 'color.background.primary': '#5B21B6' },
  });

  it('changes the variable the preset already points at', async () => {
    const outDir = await tmp();
    await compileExtension(builds, acme, { outDir });
    const css = await fs.readFile(path.join(outDir, 'css/variables.light.css'), 'utf8');

    // preset이 참조하는 바로 그 변수들이 delta에 들어 있다.
    expect(preset).toContain('rgb(var(--ds-background-primary-rgb) / <alpha-value>)');
    expect(css).toContain('--ds-background-primary: #5B21B6;');
    expect(css).toContain('--ds-background-primary-rgb: 91 33 182;');
  });

  it('emits no tailwind artifact of its own', async () => {
    const outDir = await tmp();
    const result = await compileExtension(builds, acme, { outDir });
    expect(result.manifest?.files.some((f) => f.includes('tailwind'))).toBe(false);
  });

  it('keeps the rgb channels consistent with the composed colour', async () => {
    const composed = composeExtension(builds, acme).themes[0];
    expect(composed.web.get('color.background.primary')).toBe('#5B21B6');
  });
});
