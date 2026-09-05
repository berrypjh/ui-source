import fs from 'node:fs/promises';
import path from 'node:path';

import type { TransformedToken } from 'style-dictionary/types';

import { baseTheme } from '../themes.js';

import type { ThemeBuild } from './sd.js';
import { colorToRgbChannels, cssVarName, getTokenType, getTokenValue } from './tokens.js';

const PREFIX = 'ds';

/** 토큰 값을 CSS 선언에 들어갈 문자열로 직렬화. 객체/배열은 JSON으로. */
const stringify = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return JSON.stringify(v);
};

export type Decl = { name: string; value: string };

/**
 * 토큰의 값을 읽는 방법. 기본은 사전에 담긴 값이고,
 * Consumer compiler는 합성된 값을 돌려주는 reader를 넘긴다.
 */
export type ReadValue = (token: TransformedToken) => unknown;

/**
 * 한 테마 dict → 정렬된 CSS 선언 목록(`--ds-...: value;`). color는 추가로 `-rgb` 채널 선언을 함께 만든다.
 * Shared 빌드와 Consumer delta가 같은 구현을 쓴다 — RGB 파생도 한 곳에서만 일어난다.
 */
export const declsFromDict = (
  tokens: TransformedToken[],
  readValue: ReadValue = getTokenValue,
): Decl[] => {
  const decls: Decl[] = [];
  for (const t of tokens) {
    const name = cssVarName(PREFIX, t.path);
    const v = readValue(t);
    decls.push({ name, value: stringify(v) });

    if (getTokenType(t) === 'color') {
      const channels = colorToRgbChannels(v);
      if (channels) decls.push({ name: `${name}-rgb`, value: channels });
    }
  }
  decls.push(...composedShadowDecls(tokens));
  return decls.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * boxShadow는 sd-transforms가 레이어별 자식 변수로 분해한다
 * (`--ds-shadow-lg-1-blur` …). 그래서 `--ds-shadow-lg` 같은 **바로 쓸 수 있는 단일 변수**가
 * 없고, 소비자가 자식 5개를 손으로 조합해야 했다. 여기서 그 합성본을 함께 만들어 준다.
 *
 * 그룹 경로는 항상 `[카테고리, 이름]`(+ 선택적 레이어)이다 —
 * `shadow.lg.1.blur`, `shadow.none.blur`, `elevation.3.1.blur`.
 */
const SHADOW_HEADS = new Set(['shadow', 'elevation']);
const SHADOW_PARTS = ['offsetX', 'offsetY', 'blur', 'spread', 'color', 'type'] as const;

type ShadowLayer = Partial<Record<(typeof SHADOW_PARTS)[number], string>>;

/** 한 레이어를 CSS box-shadow 조각으로. innerShadow는 `inset`을 앞에 붙인다. */
const shadowLayerCss = (layer: ShadowLayer): string | null => {
  const { offsetX, offsetY, blur, spread, color, type } = layer;
  if (!offsetX || !offsetY || !blur || !spread || !color) return null;
  const inset = type === 'innerShadow' ? 'inset ' : '';
  return `${inset}${offsetX} ${offsetY} ${blur} ${spread} ${color}`;
};

/**
 * 분해된 shadow 자식들을 모아 `--ds-<name>` 합성 선언을 만든다.
 * 레이어는 번호 순으로 `, ` 결합한다.
 */
const composedShadowDecls = (tokens: TransformedToken[]): Decl[] => {
  const groups = new Map<string, { path: string[]; layers: Map<string, ShadowLayer> }>();

  for (const t of tokens) {
    const part = t.path[t.path.length - 1] as (typeof SHADOW_PARTS)[number];
    if (!SHADOW_HEADS.has(t.path[0]) || !SHADOW_PARTS.includes(part)) continue;

    const rest = t.path.slice(0, -1);
    const name = rest.slice(0, 2);
    const layer = rest[2] ?? '1';
    const key = name.join('.');

    if (!groups.has(key)) groups.set(key, { path: name, layers: new Map() });
    const group = groups.get(key);
    if (!group) continue;
    if (!group.layers.has(layer)) group.layers.set(layer, {});
    (group.layers.get(layer) as ShadowLayer)[part] = stringify(getTokenValue(t));
  }

  const decls: Decl[] = [];
  for (const { path, layers } of groups.values()) {
    const ordered = [...layers.entries()]
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([, layer]) => shadowLayerCss(layer));
    if (ordered.some((l) => l === null)) continue;
    decls.push({ name: cssVarName(PREFIX, path), value: ordered.join(', ') });
  }
  return decls;
};

/** `selector { --x: y; ... }` 형태의 CSS 룰 블록 문자열을 생성. */
export const block = (selector: string, decls: Decl[]): string => {
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
