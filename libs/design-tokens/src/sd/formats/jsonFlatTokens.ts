import type { Format } from 'style-dictionary/types';

import { makeCssVariableName } from '../utils';

/**
 * Style Dictionary 커스텀 포맷: 평탄화(flat)된 토큰 목록 JSON을 생성합니다.
 */
export const jsonFlatTokensFormat: Format = {
  name: 'ds/json/flat-tokens',
  format: ({ dictionary, options }) => {
    const prefix = (options as any)?.prefix as string | undefined;

    const tokens = [...dictionary.allTokens] as any[];
    tokens.sort((a, b) => a.path.join('.').localeCompare(b.path.join('.')));

    const out = tokens.map((t) => {
      const type = t.type ?? t.$type ?? t.original?.type;
      const cssVar = makeCssVariableName(prefix, t.path);
      return {
        path: t.path,
        pathString: t.path.join('.'),
        type,
        value: t.value,
        cssVar,
        cssVarRgb: `${cssVar}-rgb`,
      };
    });

    return JSON.stringify(out, null, 2);
  },
};
