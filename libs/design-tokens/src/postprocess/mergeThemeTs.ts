import fs from 'node:fs/promises';
import path from 'node:path';

const write = async (fileAbs: string, content: string) => {
  await fs.mkdir(path.dirname(fileAbs), { recursive: true });
  await fs.writeFile(fileAbs, content, 'utf8');
};

/**
 * 테마별로 생성된 토큰 모듈들을 하나의 진입점 파일로 “합쳐서”,
 * Web/RN 각각에서 동일한 방식으로 테마를 import/타이핑할 수 있도록 `tokens.ts`를 생성한다.
 *
 * 생성 대상
 * - `{generatedDirAbs}/web/tokens.ts`
 * - `{generatedDirAbs}/rn/tokens.ts`
 *
 * @param args - 출력 경로 인자
 * @param args.generatedDirAbs - Web/RN 생성물 루트 디렉터리의 절대 경로
 */
export const mergeThemeTs = async (args: { generatedDirAbs: string }) => {
  const webOut = path.join(args.generatedDirAbs, 'web', 'tokens.ts');
  const rnOut = path.join(args.generatedDirAbs, 'rn', 'tokens.ts');

  const web = `/* eslint-disable */
// AUTO-GENERATED: merged themes

import { tokens as light } from './themes/light/tokens.js';
import { tokens as dark } from './themes/dark/tokens.js';

export const themes = { light, dark } as const;

export type ThemeName = keyof typeof themes;
export type ThemeTokens<T extends ThemeName> = (typeof themes)[T];

// 편의 export
export { light, dark };
`;

  const rn = `/* eslint-disable */
// AUTO-GENERATED: merged themes

import { tokens as light } from './themes/light/tokens.js';
import { tokens as dark } from './themes/dark/tokens.js';

export const themes = { light, dark } as const;

export type ThemeName = keyof typeof themes;
export type ThemeTokens<T extends ThemeName> = (typeof themes)[T];

export { light, dark };
`;

  await write(webOut, web);
  await write(rnOut, rn);
};
