/**
 * Compiler 진입점.
 * Shared 빌드와 Consumer 빌드가 같은 Style Dictionary 파이프라인과 generator를 공유한다.
 */
export {
  compileExtension,
  type CompileManifest,
  type CompileOptions,
  type CompileResult,
} from './compileExtension.js';
export { scopeSelector } from './selector.js';
/** Shared 기본 산출물 빌드. `src/build.ts` 스크립트가 얇게 감싼다. */
export { type BuildPaths, buildTokenOutputs } from '../lib/pipeline.js';
export { buildThemeDictionaries, type ThemeBuild } from '../lib/sd.js';
