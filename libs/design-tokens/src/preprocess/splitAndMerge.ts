import path from 'node:path';
import fs from 'node:fs/promises';

import { deepMergeTokens } from './deepMerge.js';
import { isJsonObject } from '../types/json.js';
import type { TokensStudioExport } from '../types/tokensStudio.js';

const isTokensStudioExport = (v: unknown): v is TokensStudioExport => {
  if (!isJsonObject(v)) return false;
  if (!('values' in v)) return false;
  return isJsonObject((v as { values?: unknown }).values);
};

/**
 * Tokens Studio JSON에서 테마를 분리하고, 특정 테마(예: dark)를
 * global + override 방식으로 병합한 뒤 파일로 저장합니다.
 *
 * @param args 함수 인자
 * @param args.inputFileAbs Tokens Studio export JSON의 절대 경로
 * @param args.outputDirAbs 결과 JSON들을 저장할 디렉터리의 절대 경로
 * @returns 생성된 파일들의 절대 경로
 * @throws `values.global` 또는 `values.dark`가 없으면 예외를 던집니다.
 */
export const splitAndMergeThemes = async (args: {
  inputFileAbs: string;
  outputDirAbs: string;
}): Promise<{ globalFileAbs: string; darkMergedFileAbs: string }> => {
  const raw = await fs.readFile(args.inputFileAbs, 'utf8');
  const parsed: unknown = JSON.parse(raw);

  if (!isTokensStudioExport(parsed)) {
    throw new Error('Tokens Studio export: invalid shape (missing values)');
  }

  const values = parsed.values;

  const globalTokens = values.global;
  const darkTokens = values.dark;

  if (!globalTokens) throw new Error('Tokens Studio export: values.global not found');
  if (!darkTokens) throw new Error('Tokens Studio export: values.dark not found');

  // dark는 "global + override"
  const darkMerged = deepMergeTokens(globalTokens, darkTokens);

  const globalFileAbs = path.join(args.outputDirAbs, 'global.json');
  const darkMergedFileAbs = path.join(args.outputDirAbs, 'dark.merged.json');

  await fs.writeFile(globalFileAbs, JSON.stringify(globalTokens, null, 2), 'utf8');
  await fs.writeFile(darkMergedFileAbs, JSON.stringify(darkMerged, null, 2), 'utf8');

  return { globalFileAbs, darkMergedFileAbs };
};
