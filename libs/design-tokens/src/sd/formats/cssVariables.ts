import type { Format } from 'style-dictionary/types';

import { makeCssVariableName, colorToRgbChannels } from '../utils';

/**
 * Style Dictionary token의 value를 CSS에서 안전하게 사용할 수 있는 문자열로 변환합니다.
 *
 * 변환 규칙:
 * - string → 그대로 반환
 * - number → 문자열로 변환
 * - boolean → "true"/"false"
 * - 그 외(object/array 등) → JSON.stringify 결과
 *
 * @param value 토큰 값(원시 타입/객체 등)
 * @returns CSS 변수 값으로 사용할 문자열
 */
const cssValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return JSON.stringify(value);
};

/**
 * Style Dictionary 커스텀 포맷: CSS Variables 파일을 생성합니다.
 */
export const dsCssVariablesFormat: Format = {
  name: 'ds/css/variables',
  format: ({ dictionary, options }) => {
    const selector = (options as any)?.selector ?? ':root';
    const prefix = (options as any)?.prefix as string | undefined;
    const includeRgb = Boolean((options as any)?.includeRgb);

    const tokens = [...dictionary.allTokens];

    // 안정적인 diff를 위해 이름 기준 정렬
    tokens.sort((a: any, b: any) => {
      const na = makeCssVariableName(prefix, a.path);
      const nb = makeCssVariableName(prefix, b.path);
      return na.localeCompare(nb);
    });

    const lines: string[] = [];

    for (const token of tokens as any[]) {
      const name = makeCssVariableName(prefix, token.path);
      const val = cssValue(token.value);

      lines.push(`  ${name}: ${val};`);

      // Tailwind alpha 지원을 위한 채널 변수 (예: 46 144 250)
      if (includeRgb) {
        const t = token.type ?? token.$type ?? token.original?.type;
        if (t === 'color') {
          const channels = colorToRgbChannels(token.value);
          if (channels) lines.push(`  ${name}-rgb: ${channels};`);
        }
      }
    }

    return `${selector} {\n${lines.join('\n')}\n}\n`;
  },
};
