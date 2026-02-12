import type { Format, TransformedToken } from 'style-dictionary/types';

import { makeCssVariableName } from '../utils';

type FlatTokensOptions = { prefix?: string };

const getTokenType = (t: TransformedToken): string => {
  const maybe = t as TransformedToken & { $type?: unknown; original?: { $type?: unknown } };
  const raw =
    (maybe.type as unknown) ??
    maybe.$type ??
    (maybe.original?.type as unknown) ??
    maybe.original?.$type;

  return typeof raw === 'string' ? raw : 'unknown';
};

/**
 * Style Dictionary 커스텀 포맷: 평탄화(flat)된 토큰 목록 JSON을 생성합니다.
 */
export const jsonFlatTokensFormat: Format = {
  name: 'ds/json/flat-tokens',
  format: ({ dictionary, options }) => {
    const opt = (options ?? {}) as FlatTokensOptions;
    const prefix = opt.prefix;

    const tokens = [...dictionary.allTokens] as TransformedToken[];
    tokens.sort((a, b) => a.path.join('.').localeCompare(b.path.join('.')));

    const out = tokens.map((t) => {
      const type = getTokenType(t);
      const cssVar = makeCssVariableName(prefix, t.path);
      return {
        path: t.path,
        pathString: t.path.join('.'),
        type,
        value: t.value as unknown,
        cssVar,
        cssVarRgb: `${cssVar}-rgb`,
      };
    });

    return JSON.stringify(out, null, 2);
  },
};
