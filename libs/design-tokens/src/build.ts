import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import StyleDictionary from 'style-dictionary';

import {
  generateTailwindPreset,
  mergeCssThemes,
  mergeThemeTs,
  writeCssSideEffectTypes,
} from './postprocess';
import { makeSdConfig, registerAll } from './sd';
import { ThemeName } from './types';
import { validateTokenFiles } from './validate';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const TOKENS_DIR = path.join(PROJECT_ROOT, 'tokens');
const TOKENS_LIGHT_GLOB = path.join(TOKENS_DIR, 'light', '*.json');
const TOKENS_DARK_GLOB = path.join(TOKENS_DIR, 'dark', '*.json');

const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const DIST_CSS_DIR = path.join(DIST_DIR, 'css');
const DIST_JSON_DIR = path.join(DIST_DIR, 'json');

const GENERATED_DIR = path.join(PROJECT_ROOT, 'src', '.generated');

const ensureDirs = async (): Promise<void> => {
  await fs.mkdir(DIST_CSS_DIR, { recursive: true });
  await fs.mkdir(DIST_JSON_DIR, { recursive: true });

  await fs.mkdir(path.join(GENERATED_DIR, 'web', 'themes'), { recursive: true });
  await fs.mkdir(path.join(GENERATED_DIR, 'rn', 'themes'), { recursive: true });
};

const buildTheme = async (
  theme: ThemeName,
  source: string[],
  include?: string[],
): Promise<void> => {
  const themeOutBase = {
    css: path.join(DIST_CSS_DIR, theme),
    json: path.join(DIST_JSON_DIR, theme),
    web: path.join(GENERATED_DIR, 'web', 'themes', theme),
    rn: path.join(GENERATED_DIR, 'rn', 'themes', theme),
  };

  const sdConfig = makeSdConfig({
    theme,
    source,
    include,
    out: themeOutBase,
  });

  const sd = new StyleDictionary(sdConfig);

  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();
};

/**
 * 주어진 글롭 패턴들에 매칭되는 파일 절대 경로들을 정렬해 반환합니다.
 */
const resolveTokenFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir);
  return entries
    .filter((e) => e.endsWith('.json'))
    .map((e) => path.join(dir, e))
    .sort();
};

const main = async (): Promise<void> => {
  await ensureDirs();

  // 토큰 입력 검증 (잘못된 형식/type을 SD 빌드 전에 차단)
  const lightFiles = await resolveTokenFiles(path.join(TOKENS_DIR, 'light'));
  const darkFiles = await resolveTokenFiles(path.join(TOKENS_DIR, 'dark'));
  await validateTokenFiles([...lightFiles, ...darkFiles]);

  // SD 등록(토큰스튜디오 호환 transforms/포맷)
  registerAll();

  // light: 베이스 풀세트
  await buildTheme('light', [TOKENS_LIGHT_GLOB]);

  // dark: light + dark override (뒤쪽 source가 deep-merge 우선)
  await buildTheme('dark', [TOKENS_LIGHT_GLOB, TOKENS_DARK_GLOB]);

  // CSS 병합 → dist/css/variables.css
  await mergeCssThemes({
    distCssDirAbs: DIST_CSS_DIR,
  });

  // import 타입 생성 → dist/css/index.d.ts
  await writeCssSideEffectTypes({
    outputDirAbs: DIST_CSS_DIR,
  });

  // web/rn tokens.ts 각각 병합 → src/.generated/web/tokens.ts, src/.generated/rn/tokens.ts
  await mergeThemeTs({
    generatedDirAbs: GENERATED_DIR,
  });

  // Tailwind preset 생성
  await generateTailwindPreset({
    distJsonDirAbs: DIST_JSON_DIR,
    outFileAbs: path.join(GENERATED_DIR, 'tailwind', 'preset.ts'),
  });
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
