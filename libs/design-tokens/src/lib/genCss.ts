import fs from 'node:fs/promises';
import path from 'node:path';

import type { TransformedToken } from 'style-dictionary/types';

import { baseTheme } from '../themes';

import type { ThemeBuild } from './sd';
import { colorToRgbChannels, cssVarName, getTokenType } from './tokens';

const PREFIX = 'ds';

/** 토큰 값을 CSS 선언에 들어갈 문자열로 직렬화. 객체/배열은 JSON으로. */
const stringify = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return JSON.stringify(v);
};

type Decl = { name: string; value: string };

/** 한 테마 dict → 정렬된 CSS 선언 목록(`--ds-...: value;`). color는 추가로 `-rgb` 채널 선언을 함께 만든다. */
const declsFromDict = (tokens: TransformedToken[]): Decl[] => {
  const decls: Decl[] = [];
  for (const t of tokens) {
    const name = cssVarName(PREFIX, t.path);
    decls.push({ name, value: stringify(t.value) });

    if (getTokenType(t) === 'color') {
      const channels = colorToRgbChannels(t.value);
      if (channels) decls.push({ name: `${name}-rgb`, value: channels });
    }
  }
  return decls.sort((a, b) => a.name.localeCompare(b.name));
};

/** `selector { --x: y; ... }` 형태의 CSS 룰 블록 문자열을 생성. */
const block = (selector: string, decls: Decl[]): string => {
  const lines = decls.map((d) => `  ${d.name}: ${d.value};`).join('\n');
  return `${selector} {\n${lines}\n}\n`;
};

/**
 * 테마별 in-memory dictionary로부터 CSS 변수 파일들을 생성한다.
 * - `variables.{theme}.css` : 테마별 단일 파일(base는 풀세트, 그 외는 override-only)
 * - `variables.css`         : base + 다른 테마 override 병합본
 * - `index.d.ts`            : side-effect import용 빈 d.ts
 */
export const writeCss = async (builds: ThemeBuild[], distCssDirAbs: string): Promise<void> => {
  await fs.mkdir(distCssDirAbs, { recursive: true });

  const baseBuild = builds.find((b) => b.theme === baseTheme.name);
  if (!baseBuild) throw new Error(`base theme "${baseTheme.name}" not found in builds`);
  const baseDecls = declsFromDict([...baseBuild.web.allTokens]);
  const baseByName = new Map(baseDecls.map((d) => [d.name, d.value]));

  // base 풀세트
  const baseCss = block(baseBuild.selector, baseDecls);
  await fs.writeFile(path.join(distCssDirAbs, `variables.${baseTheme.name}.css`), baseCss, 'utf8');

  const overrides: string[] = [];
  for (const b of builds) {
    if (b.theme === baseTheme.name) continue;

    const themeDecls = declsFromDict([...b.web.allTokens]).filter(
      (d) => baseByName.get(d.name) !== d.value,
    );
    const overrideCss = block(b.selector, themeDecls);

    await fs.writeFile(path.join(distCssDirAbs, `variables.${b.theme}.css`), overrideCss, 'utf8');
    overrides.push(overrideCss);
  }

  // 단일 import 용 병합본
  await fs.writeFile(
    path.join(distCssDirAbs, 'variables.css'),
    `${baseCss}\n${overrides.join('\n')}`,
    'utf8',
  );

  // side-effect import 용 빈 d.ts
  await fs.writeFile(
    path.join(distCssDirAbs, 'index.d.ts'),
    `// AUTO-GENERATED\nexport {};\n`,
    'utf8',
  );
};
