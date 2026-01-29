import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { splitAndMergeThemes } from './preprocess/splitAndMerge.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const TOKENS_INPUT = path.join(PROJECT_ROOT, 'tokens', 'data.json');
const TOKENS_GEN_DIR = path.join(PROJECT_ROOT, 'tokens', '_generated');

const ensureDirs = async (): Promise<void> => {
  await fs.mkdir(TOKENS_GEN_DIR, { recursive: true });
};

const main = async (): Promise<void> => {
  await ensureDirs();

  // 테마 별 JSON 생성
  const { globalFileAbs, darkMergedFileAbs } = await splitAndMergeThemes({
    inputFileAbs: TOKENS_INPUT,
    outputDirAbs: TOKENS_GEN_DIR,
  });

  console.log(globalFileAbs);
  console.log(darkMergedFileAbs);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
