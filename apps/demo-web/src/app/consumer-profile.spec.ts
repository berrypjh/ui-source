/**
 * Sample Consumer 산출물에 대한 브라우저 없는 회귀 테스트.
 *
 * Playwright가 computed style을 보고, 이 테스트는 그 앞단 — 컴파일된 CSS가
 * 올바른 scope/selector/변수를 담고 있는지 — 를 본다. 브라우저 없이 CI에서 돈다.
 */
import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const GENERATED = path.resolve(__dirname, '../_generated/sample-consumer');

const css = (file: string) => fs.readFileSync(path.join(GENERATED, 'css', file), 'utf8');
const decls = (source: string) =>
  Object.fromEntries(
    [...source.matchAll(/^\s*(--[\w-]+):\s*(.+);$/gm)].map((m) => [m[1], m[2].trim()]),
  );

describe('compiled sample consumer css', () => {
  it('is produced by the compiler, not written by hand', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(GENERATED, 'manifest.json'), 'utf8'));
    expect(manifest.extension).toBe('sample-consumer');
    expect(manifest.contractVersion).toBe(1);
    expect(manifest.modes).toEqual(['light', 'dark', 'sepia']);
  });

  it('scopes the base theme to the profile attribute', () => {
    expect(css('variables.light.css').split('\n')[0]).toBe('[data-profile="sample"] {');
  });

  it('keeps the shared theme selector semantics under the scope', () => {
    expect(css('variables.dark.css').split('\n')[0]).toBe(
      '[data-profile="sample"][data-theme="dark"], [data-profile="sample"].theme-dark {',
    );
  });

  it('emits the overridden semantic token per mode', () => {
    expect(decls(css('variables.light.css'))['--ds-background-primary']).toBe('#5B21B6');
    expect(decls(css('variables.dark.css'))['--ds-background-primary']).toBe('#A78BFA');
  });

  it('derives rgb channels without manual authoring', () => {
    expect(decls(css('variables.light.css'))['--ds-background-primary-rgb']).toBe('91 33 182');
    expect(decls(css('variables.dark.css'))['--ds-background-primary-rgb']).toBe('167 139 250');
  });

  it('emits only deltas — non-overridden tokens stay with the shared css', () => {
    const light = decls(css('variables.light.css'));
    expect(light['--ds-background-secondary']).toBeUndefined();
    expect(light['--ds-spacing-md']).toBeUndefined();
    expect(light['--ds-radius-lg']).toBeUndefined();
  });

  it('pairs every colour declaration with its rgb channel', () => {
    const light = decls(css('variables.light.css'));
    for (const name of Object.keys(light)) {
      if (name.endsWith('-rgb')) continue;
      expect(light[`${name}-rgb`], `${name} is missing its rgb channel`).toBeDefined();
    }
  });

  it('carries a consumer base override into dark when shared dark differs', () => {
    // stroke.default는 base에서만 지정했지만 shared dark 값과 달라 dark 파일에도 실린다.
    expect(decls(css('variables.dark.css'))['--ds-stroke-default']).toBe('#C4B5FD');
  });
});
