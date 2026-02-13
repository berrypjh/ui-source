import { themes as webThemesInternal } from '../.generated/web/tokens.js';
import { themes as rnThemesInternal } from '../.generated/rn/tokens.js';

export const webThemes = webThemesInternal;
export const rnThemes = rnThemesInternal;

// 테마 하나만 관리
export type ThemeName = keyof typeof rnThemes & string;

type WebThemeName = keyof typeof webThemes & string;
type RnThemeName = keyof typeof rnThemes & string;

// web/rn 테마 키가 어긋나면 컴파일에서 바로 문제 발생하도록 강제
type AssertSameThemeNames = [
  Exclude<WebThemeName, RnThemeName>,
  Exclude<RnThemeName, WebThemeName>,
] extends [never, never]
  ? true
  : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __assertSameThemeNames: AssertSameThemeNames = true;

// 플랫폼별 ThemeTokens
export type WebThemeTokens<T extends ThemeName> = (typeof webThemes)[T];
export type RnThemeTokens<T extends ThemeName> = (typeof rnThemes)[T];
