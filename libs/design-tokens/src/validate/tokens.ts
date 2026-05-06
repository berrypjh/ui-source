import fs from 'node:fs/promises';
import path from 'node:path';

import type { JsonObject, JsonValue } from '../types';
import { isJsonObject } from '../types';

/**
 * 사용 가능한 토큰 type 어휘. Tokens Studio 호환 어휘를 그대로 유지.
 * mapTokenPath/transforms/format에서 분기 키로 사용되므로 새 type을 추가하면
 * 해당 분기들도 함께 갱신해야 함.
 */
const KNOWN_TYPES = new Set([
  'color',
  'spacing',
  'borderRadius',
  'borderWidth',
  'fontSizes',
  'fontWeights',
  'lineHeights',
  'letterSpacing',
  'fontFamilies',
  'typography',
  'boxShadow',
  'dropShadow',
  'innerShadow',
  'border',
]);

type LeafLike = JsonObject & { value: JsonValue; type?: JsonValue };

const isLeaf = (v: unknown): v is LeafLike => {
  return isJsonObject(v) && 'value' in v;
};

type Issue = {
  file: string;
  path: string;
  message: string;
};

const walk = (
  file: string,
  node: JsonValue,
  trail: string[],
  issues: Issue[],
  inLeafValue: boolean,
): void => {
  if (Array.isArray(node)) {
    node.forEach((v, i) => walk(file, v, [...trail, String(i)], issues, inLeafValue));
    return;
  }
  if (!isJsonObject(node)) return;

  // leaf 내부의 value 객체(예: dropShadow primitive)는 더 이상 leaf 검증을 적용하지 않음
  if (inLeafValue) {
    for (const [k, v] of Object.entries(node)) {
      walk(file, v, [...trail, k], issues, true);
    }
    return;
  }

  if (isLeaf(node)) {
    if (typeof node.type !== 'string') {
      issues.push({
        file,
        path: trail.join('.'),
        message: `leaf token missing string "type"`,
      });
    } else if (!KNOWN_TYPES.has(node.type)) {
      issues.push({
        file,
        path: trail.join('.'),
        message: `unknown token type "${node.type}". 추가하려면 src/validate/tokens.ts의 KNOWN_TYPES에 등록 후 mapTokenPath/transforms/format 분기 갱신`,
      });
    }
    walk(file, node.value, [...trail, 'value'], issues, true);
    return;
  }

  for (const [k, v] of Object.entries(node)) {
    walk(file, v, [...trail, k], issues, false);
  }
};

/**
 * 주어진 토큰 파일들을 읽어, leaf 토큰의 형식과 type 어휘를 검증합니다.
 *
 * 검증 항목
 * - leaf 토큰(`{ value, ... }`)에 string `type`이 존재하는지
 * - `type`이 알려진 어휘(KNOWN_TYPES)에 속하는지
 *
 * 이 함수는 빌드 직전에 호출하여, 잘못된 토큰 입력이 후속 SD 빌드에서
 * 모호한 에러로 이어지지 않도록 사전에 차단하는 게이트 역할을 합니다.
 *
 * @param fileAbsList 검증할 토큰 JSON 파일들의 절대 경로 목록
 * @throws 검증 위반이 1건 이상이면 예외를 던집니다.
 */
export const validateTokenFiles = async (fileAbsList: string[]): Promise<void> => {
  const issues: Issue[] = [];

  for (const fileAbs of fileAbsList) {
    const raw = await fs.readFile(fileAbs, 'utf8');
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      issues.push({
        file: fileAbs,
        path: '',
        message: `JSON parse error: ${(e as Error).message}`,
      });
      continue;
    }
    if (!isJsonObject(parsed)) {
      issues.push({ file: fileAbs, path: '', message: 'top-level must be a JSON object' });
      continue;
    }
    walk(fileAbs, parsed, [], issues, false);
  }

  if (issues.length > 0) {
    const lines = issues.map(
      (i) => `  - ${path.basename(i.file)}${i.path ? ` @ ${i.path}` : ''}: ${i.message}`,
    );
    throw new Error(`Token validation failed (${issues.length}):\n${lines.join('\n')}`);
  }
};
