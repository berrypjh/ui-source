/**
 * 토큰 기본값의 접근성 보장.
 *
 * 색을 바꿔 대비가 기준 아래로 내려가면 여기서 잡힌다.
 * 실제 컴포넌트가 만드는 조합만 검사한다 — 임의 조합이 아니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { contrastRatio, relativeLuminance, WCAG_AA } from './contrast';

const CATALOG = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../dist/tokens.json',
);
const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8')) as {
  themes: string[];
  tokens: Record<string, (string | number | null)[]>;
};

const value = (tokenPath: string, theme: string): string => {
  const row = catalog.tokens[tokenPath];
  if (!row) throw new Error(`token "${tokenPath}" not found`);
  return String(row[1 + catalog.themes.indexOf(theme)]);
};

/** 컴포넌트가 실제로 만드는 전경/배경 조합. */
const TEXT_PAIRS: [string, string, string][] = [
  ['body text', 'color.text.default', 'color.background.default'],
  ['secondary text', 'color.text.light', 'color.background.default'],
  ['placeholder', 'color.text.placeholder', 'color.background.surface'],
  ['link', 'color.text.link', 'color.background.default'],
  ['error text', 'color.text.error', 'color.background.default'],
  ['primary button label', 'color.text.contrastText', 'color.primaryBtn.default'],
  ['secondary button label', 'color.text.contrastText', 'color.secondaryBtn.default'],
  ['error button label', 'color.text.contrastText', 'color.errorBtn.default'],
];

/** UI 경계·상태 표시자 (WCAG 1.4.11). */
const NON_TEXT_PAIRS: [string, string, string][] = [
  ['field border', 'color.field.border', 'color.background.surface'],
  ['field hover border', 'color.field.borderHover', 'color.background.surface'],
];

/**
 * 구분선이 배경에 묻히지 않는 최소 대비.
 *
 * 순수 장식 구분선은 WCAG 1.4.11 대상이 아니라 3:1 을 요구하지 않는다. 다만 배경과 같은 값이면
 * 선을 그려도 보이지 않는다 — 실제로 `stroke.light` 가 `background.default` 와 같은 ramp 단계라
 * light·sepia 에서 대비가 1.00 이었다. 눈에 보이는 최소선을 가드로 고정한다.
 */
const DIVIDER_MIN = 1.2;

const DIVIDER_PAIRS: [string, string, string][] = [
  ['divider on page', 'color.stroke.light', 'color.background.default'],
  ['divider on surface', 'color.stroke.light', 'color.background.surface'],
  ['chrome border on page', 'color.stroke.default', 'color.background.default'],
  ['chrome border on surface', 'color.stroke.default', 'color.background.surface'],
];

describe('contrastRatio', () => {
  it('matches the WCAG reference extremes', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 2);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('is order independent', () => {
    expect(contrastRatio('#047857', '#FFFFFF')).toBeCloseTo(contrastRatio('#FFFFFF', '#047857'), 9);
  });

  it('ignores the alpha channel of an 8-digit hex', () => {
    expect(relativeLuminance('#10B98114')).toBeCloseTo(relativeLuminance('#10B981'), 9);
  });

  it('expands 3-digit hex', () => {
    expect(relativeLuminance('#FFF')).toBeCloseTo(relativeLuminance('#FFFFFF'), 9);
  });
});

describe.each(catalog.themes)('WCAG AA — %s theme', (theme) => {
  it.each(TEXT_PAIRS)('%s reaches 4.5:1', (_label, fg, bg) => {
    expect(contrastRatio(value(fg, theme), value(bg, theme))).toBeGreaterThanOrEqual(WCAG_AA.text);
  });

  it.each(NON_TEXT_PAIRS)('%s reaches 3:1', (_label, fg, bg) => {
    expect(contrastRatio(value(fg, theme), value(bg, theme))).toBeGreaterThanOrEqual(
      WCAG_AA.nonText,
    );
  });

  it.each(DIVIDER_PAIRS)('%s stays visible', (_label, fg, bg) => {
    expect(contrastRatio(value(fg, theme), value(bg, theme))).toBeGreaterThanOrEqual(DIVIDER_MIN);
  });
});
