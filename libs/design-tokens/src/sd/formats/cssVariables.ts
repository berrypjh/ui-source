import type { Format, TransformedToken } from 'style-dictionary/types';

import { colorToRgbChannels, makeCssVariableName } from '../utils';

type CssVariablesOptions = {
  selector?: string;
  prefix?: string;
  includeRgb?: boolean;
};

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

const getTokenType = (t: TransformedToken): string | undefined => {
  const maybe = t as TransformedToken & { $type?: unknown; original?: { $type?: unknown } };
  const type =
    (maybe.type as unknown) ??
    maybe.$type ??
    (maybe.original?.type as unknown) ??
    maybe.original?.$type;

  return typeof type === 'string' ? type : undefined;
};

/**
 * Style Dictionary 커스텀 포맷: CSS Variables 파일을 생성합니다.
 */
export const dsCssVariablesFormat: Format = {
  name: 'ds/css/variables',
  format: ({ dictionary, options }) => {
    const opt = (options ?? {}) as CssVariablesOptions;
    const selector = opt.selector ?? ':root';
    const prefix = opt.prefix;
    const includeRgb = Boolean(opt.includeRgb);

    const tokens = [...dictionary.allTokens] as TransformedToken[];

    // 안정적인 diff를 위해 이름 기준 정렬
    tokens.sort((a, b) => {
      const na = makeCssVariableName(prefix, a.path);
      const nb = makeCssVariableName(prefix, b.path);
      return na.localeCompare(nb);
    });

    const lines: string[] = [];

    for (const token of tokens) {
      const name = makeCssVariableName(prefix, token.path);
      const val = cssValue(token.value);

      lines.push(`  ${name}: ${val};`);

      if (includeRgb) {
        if (getTokenType(token) === 'color') {
          const channels = colorToRgbChannels(token.value);
          if (channels) lines.push(`  ${name}-rgb: ${channels};`);
        }
      }
    }

    return `${selector} {\n${lines.join('\n')}\n}\n`;
  },
};
