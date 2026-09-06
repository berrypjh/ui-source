import fs from 'node:fs/promises';
import path from 'node:path';

import { themes } from '../themes.js';

import { writeTokensJson } from './genCatalog.js';
import { writeCss } from './genCss.js';
import { writeTailwindPreset } from './genTailwind.js';
import { writeTsTokens } from './genTsTokens.js';
import { buildThemeDictionaries } from './sd.js';

/** 토큰 파이프라인의 입출력 경로. 모두 절대 경로. */
export type BuildPaths = {
  tokensDir: string;
  distDir: string;
  generatedDir: string;
};

/** 산출물 디렉터리를 비우고 SD 사전 → CSS / Web TS / RN TS / Tailwind preset / catalog 를 차례로 생성한다. */
export const buildTokenOutputs = async ({
  tokensDir,
  distDir,
  generatedDir,
}: BuildPaths): Promise<void> => {
  const cssDir = path.join(distDir, 'css');
  const catalogFile = path.join(distDir, 'tokens.json');

  await fs.rm(generatedDir, { recursive: true, force: true });
  await fs.rm(cssDir, { recursive: true, force: true });
  await fs.rm(catalogFile, { force: true });
  await fs.mkdir(distDir, { recursive: true });

  const builds = await buildThemeDictionaries(themes, tokensDir);
  await writeCss(builds, cssDir);
  await writeTsTokens(builds, generatedDir);
  await writeTailwindPreset(builds, path.join(generatedDir, 'tailwind', 'preset.ts'));
  await writeTokensJson(builds, catalogFile);
};
