import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { writeTokensJson } from './lib/genCatalog';
import { writeCss } from './lib/genCss';
import { writeTailwindPreset } from './lib/genTailwind';
import { writeTsTokens } from './lib/genTsTokens';
import { buildThemeDictionaries } from './lib/sd';
import { themes } from './themes';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOKENS_DIR = path.join(ROOT, 'tokens');
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_CSS_DIR = path.join(DIST_DIR, 'css');
const DIST_CATALOG = path.join(DIST_DIR, 'tokens.json');
const GENERATED_DIR = path.join(ROOT, 'src', '.generated');

/** 산출물 디렉터리를 비우고 SD 사전 → CSS / Web TS / RN TS / Tailwind preset / catalog 를 차례로 생성한다. */
const main = async (): Promise<void> => {
  await fs.rm(GENERATED_DIR, { recursive: true, force: true });
  await fs.rm(DIST_CSS_DIR, { recursive: true, force: true });
  await fs.rm(DIST_CATALOG, { force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });

  const builds = await buildThemeDictionaries(themes, TOKENS_DIR);
  await writeCss(builds, DIST_CSS_DIR);
  await writeTsTokens(builds, GENERATED_DIR);
  await writeTailwindPreset(builds, path.join(GENERATED_DIR, 'tailwind', 'preset.ts'));
  await writeTokensJson(builds, DIST_CATALOG);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
