import fs from 'node:fs/promises';

import type { TransformedToken } from 'style-dictionary/types';

import type { ThemeBuild } from './sd.js';
import { classifyTokenPath, cssVarName, getTokenValue } from './tokens.js';

const PREFIX = 'ds';

type Item = { cssVar: string; values: Record<string, unknown> };

const collectItems = (
  builds: ThemeBuild[],
): { items: Record<string, Item>; categories: Set<string>; themeOrder: string[] } => {
  const themeOrder = builds.map((b) => b.theme);
  const items: Record<string, Item> = {};
  const categories = new Set<string>();
  for (const build of builds) {
    for (const t of build.web.allTokens as TransformedToken[]) {
      const classified = classifyTokenPath(t.path);
      const id = classified.join('.');
      categories.add(classified[0] as string);
      if (!items[id]) {
        items[id] = { cssVar: cssVarName(PREFIX, t.path), values: {} };
      }
      items[id].values[build.theme] = getTokenValue(t);
    }
  }
  return { items, categories, themeOrder };
};

/**
 * 슬림 JSON 카탈로그 — `tokens[path] = [cssVar, ...valuesInThemesOrder]`.
 * 토큰 한 줄 직렬화로 들여쓰기·구두점 최소.
 *
 * baseline(d.ts 묶음) 대비 약 −21% AI 토큰 절약 (gpt-4o tiktoken 측정).
 * TSV 변형이 추가 −8% 가능하지만, 표준성·자기 기술성 손실로 채택하지 않음
 * (`tools/scripts/measure-tokens` 시나리오에 코드 주석으로 보존됨).
 */
export const writeTokensJson = async (builds: ThemeBuild[], outFileAbs: string): Promise<void> => {
  const { items, categories, themeOrder } = collectItems(builds);
  const sortedIds = Object.keys(items).sort();
  const sortedCategories = [...categories].sort();

  const lines = sortedIds.map((id) => {
    const item = items[id];
    const row = [item.cssVar, ...themeOrder.map((th) => item.values[th] ?? null)];
    return `    ${JSON.stringify(id)}: ${JSON.stringify(row)}`;
  });

  const out = [
    '{',
    `  "schema": "tokens[path] = [cssVar, ...valuesInThemesOrder]",`,
    `  "themes": ${JSON.stringify(themeOrder)},`,
    `  "categories": ${JSON.stringify(sortedCategories)},`,
    `  "tokens": {`,
    lines.join(',\n'),
    '  }',
    '}',
    '',
  ].join('\n');

  await fs.writeFile(outFileAbs, out, 'utf8');
};
