/**
 * 테마 등록부. 첫 항목이 base(다른 테마의 cascade 베이스)이며 풀세트 토큰을 가져야 한다.
 *
 * 새 테마: `tokens/{name}/*.json` 작성 → 이 배열에 항목 추가.
 * `src/web.ts`/`src/rn.ts`의 namespace re-export는 빌드 시 자동 생성된다.
 */
export type ThemeDef = {
  name: string;
  selector: string;
  sourceDirs: string[];
};

export const themes = [
  { name: 'light', selector: ':root', sourceDirs: ['light'] },
  { name: 'dark', selector: '[data-theme="dark"], .theme-dark', sourceDirs: ['light', 'dark'] },
  { name: 'sepia', selector: '[data-theme="sepia"], .theme-sepia', sourceDirs: ['light', 'sepia'] },
] as const satisfies readonly ThemeDef[];

export type ThemeName = (typeof themes)[number]['name'];

export const baseTheme = themes[0];
