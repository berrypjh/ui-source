import fs from 'node:fs/promises';
import path from 'node:path';

import type { Dictionary } from 'style-dictionary/types';

import type { ThemeBuild } from './sd';
import { classifyTokenPath, getTokenValue, TOKEN_CATEGORIES } from './tokens';

type Rec = Record<string, unknown>;

/** 배열·null이 아닌 평범한 record인지 검사. */
const isRec = (v: unknown): v is Rec => !!v && typeof v === 'object' && !Array.isArray(v);

/** path를 따라 중첩 record 트리에 값을 설정. 중간 노드가 record가 아니면 새 record로 교체. */
const setDeep = (root: Rec, p: readonly string[], value: unknown): void => {
  let cur = root;
  for (let i = 0; i < p.length - 1; i++) {
    const k = p[i];
    if (!k) return;
    const existing = cur[k];
    const child: Rec = isRec(existing) ? existing : {};
    cur[k] = child;
    cur = child;
  }
  const last = p[p.length - 1];
  if (last) cur[last] = value;
};

/** SD 사전을 9개 카테고리로 분류해 정렬·중첩한 JSON 문자열을 반환. */
const groupedTokensJson = (dict: Dictionary): string => {
  const root: Rec = Object.fromEntries(TOKEN_CATEGORIES.map((c) => [c, {}]));
  const tokens = [...dict.allTokens].sort((a, b) =>
    a.path.join('.').localeCompare(b.path.join('.')),
  );
  for (const t of tokens) {
    setDeep(root, classifyTokenPath(t.path), getTokenValue(t));
  }
  return JSON.stringify(root, null, 2);
};

/** 한 테마의 `tokens.ts` 파일 소스(`tokens` 상수 + 카테고리별 타입 export)를 생성. */
const themeFileSource = (theme: string, dict: Dictionary): string => `/* eslint-disable */
// AUTO-GENERATED — theme: ${theme}

export const tokens = ${groupedTokensJson(dict)} as const;

export type Tokens = typeof tokens;
export type ColorTokens = Tokens['color'];
export type SpacingTokens = Tokens['spacing'];
export type RadiusTokens = Tokens['radius'];
export type BorderWidthTokens = Tokens['borderWidth'];
export type BorderTokens = Tokens['border'];
export type TypographyTokens = Tokens['typography'];
export type ShadowTokens = Tokens['shadow'];
export type ElevationTokens = Tokens['elevation'];
export type ComponentTokens = Tokens['component'];

export type ThemeTokens = {
  color: ColorTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  borderWidth: BorderWidthTokens;
  border: BorderTokens;
  typography: TypographyTokens;
  shadow: ShadowTokens;
  elevation: ElevationTokens;
  component: ComponentTokens;
};
`;

/** 첫 글자만 대문자로 변환 (예: `light` → `Light`). */
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** 플랫폼 진입 모듈(`index.ts`) 소스. 각 테마를 capitalize한 namespace로 re-export. */
const indexSource = (themes: readonly string[]): string => {
  const lines = themes
    .map((t) => `export * as ${capitalize(t)} from './themes/${t}/tokens';`)
    .join('\n');
  return `/* eslint-disable */
// AUTO-GENERATED — namespace re-exports per theme
${lines}
`;
};

/** 부모 디렉터리를 생성한 뒤 파일을 utf8로 쓴다. */
const write = async (file: string, content: string) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, 'utf8');
};

/** 한 플랫폼(web 또는 rn)의 `themes/{theme}/tokens.ts` + `index.ts` 를 모두 쓴다. */
const writePlatform = async (
  builds: ThemeBuild[],
  outDirAbs: string,
  pickDict: (b: ThemeBuild) => Dictionary,
): Promise<void> => {
  for (const b of builds) {
    await write(
      path.join(outDirAbs, 'themes', b.theme, 'tokens.ts'),
      themeFileSource(b.theme, pickDict(b)),
    );
  }
  await write(path.join(outDirAbs, 'index.ts'), indexSource(builds.map((b) => b.theme)));
};

/** Web/RN 두 플랫폼의 `.generated/{web|rn}/themes/<theme>/tokens.ts` 와 `index.ts` 를 생성. */
export const writeTsTokens = async (
  builds: ThemeBuild[],
  generatedDirAbs: string,
): Promise<void> => {
  await writePlatform(builds, path.join(generatedDirAbs, 'web'), (b) => b.web);
  await writePlatform(builds, path.join(generatedDirAbs, 'rn'), (b) => b.rn);
};
