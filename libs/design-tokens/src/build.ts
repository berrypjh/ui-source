import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

import { splitAndMergeThemes } from './preprocess';
import { registerAll, makeSdConfig, type ThemeName } from './sd';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const TOKENS_INPUT = path.join(PROJECT_ROOT, 'tokens', 'data.json');
const TOKENS_GEN_DIR = path.join(PROJECT_ROOT, 'tokens', '_generated');

const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const DIST_CSS_DIR = path.join(DIST_DIR, 'css');
const DIST_JSON_DIR = path.join(DIST_DIR, 'json');

const GENERATED_DIR = path.join(PROJECT_ROOT, 'src', '.generated');

const ensureDirs = async (): Promise<void> => {
  await fs.mkdir(TOKENS_GEN_DIR, { recursive: true });
  await fs.mkdir(DIST_CSS_DIR, { recursive: true });
  await fs.mkdir(DIST_JSON_DIR, { recursive: true });

  await fs.mkdir(path.join(GENERATED_DIR, 'web', 'themes'), { recursive: true });
  await fs.mkdir(path.join(GENERATED_DIR, 'rn', 'themes'), { recursive: true });
  await fs.mkdir(path.join(GENERATED_DIR, 'tailwind'), { recursive: true });
};

const buildTheme = async (theme: ThemeName, sourceFileAbs: string): Promise<void> => {
  const themeOutBase = {
    css: path.join(DIST_CSS_DIR, theme),
    json: path.join(DIST_JSON_DIR, theme),
    web: path.join(GENERATED_DIR, 'web', 'themes', theme),
    rn: path.join(GENERATED_DIR, 'rn', 'themes', theme),
  };

  const sdConfig = makeSdConfig({
    theme,
    sourceFileAbs,
    out: themeOutBase,
  });

  const sd = new StyleDictionary(sdConfig);

  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();
};

const main = async (): Promise<void> => {
  await ensureDirs();

  // 테마 별 JSON 생성
  const { globalFileAbs, darkMergedFileAbs } = await splitAndMergeThemes({
    inputFileAbs: TOKENS_INPUT,
    outputDirAbs: TOKENS_GEN_DIR,
  });

  // SD 등록(토큰스튜디오 호환)
  registerAll();

  // global SD
  await buildTheme('global', globalFileAbs);

  // dark SD
  await buildTheme('dark', darkMergedFileAbs);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
