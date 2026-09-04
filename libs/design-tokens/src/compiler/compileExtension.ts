/**
 * Consumer extension compiler.
 *
 * 새 Style Dictionary 설정을 만들지 않는다. `buildThemeDictionaries`가 만든 Shared 사전과
 * Command 04의 합성 모델을 기존 generator에 그대로 먹인다 — CSS 변수 이름, RGB 파생,
 * RN 트리 모양이 Shared 빌드와 한 구현을 공유한다.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

import type { TransformedToken } from 'style-dictionary/types';

import { type ComposedTheme, composeExtension } from '../extension/compose.js';
import type { Diagnostic } from '../extension/diagnostics.js';
import { warnings } from '../extension/diagnostics.js';
import type { TokenExtension } from '../extension/types.js';
import { CONTRACT_VERSION } from '../lib/contract.js';
import { block, type Decl, declsFromDict } from '../lib/genCss.js';
import { themeFileSource } from '../lib/genTsTokens.js';
import type { ThemeBuild } from '../lib/sd.js';
import { classifyTokenPath } from '../lib/tokens.js';
import type { ThemeName } from '../themes.js';

import { scopeSelector } from './selector.js';

export type CompileOptions = {
  /** 산출물을 쓸 디렉터리. 절대 경로. */
  readonly outDir: string;
  /**
   * Consumer CSS를 감쌀 selector (`[data-brand="acme"]` 등).
   * 생략하면 Shared와 같은 테마 selector를 그대로 쓴다.
   */
  readonly scope?: string;
};

/** compiler가 남기는 최소 manifest. 새 metadata 체계를 만들지 않는다. */
export type CompileManifest = {
  readonly extension: string;
  readonly contractVersion: number;
  readonly modes: readonly ThemeName[];
  /** outDir 기준 상대 경로. 정렬되어 있다. */
  readonly files: readonly string[];
  readonly warnings: readonly Diagnostic[];
};

export type CompileResult =
  | {
      readonly ok: true;
      readonly manifest: CompileManifest;
      readonly diagnostics: readonly Diagnostic[];
    }
  | {
      readonly ok: false;
      readonly manifest?: undefined;
      readonly diagnostics: readonly Diagnostic[];
    };

/** 합성 맵에서 값을 읽는 reader. generator가 사전을 순회하며 호출한다. */
const readFrom =
  (composed: ReadonlyMap<string, unknown>) =>
  (token: TransformedToken): unknown =>
    composed.get(classifyTokenPath(token.path).join('.'));

/** 부모 디렉터리를 만들고 파일을 쓴다. */
const write = async (file: string, content: string) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, 'utf8');
};

/**
 * Shared 값과 달라진 선언만 고른다.
 * color 하나를 바꾸면 `--ds-x` 와 `--ds-x-rgb` 가 함께 delta에 들어온다 —
 * RGB 파생은 `declsFromDict`가 Shared 빌드와 같은 방식으로 처리한다.
 */
const changedDecls = (build: ThemeBuild, composed: ComposedTheme): Decl[] => {
  const tokens = [...build.web.allTokens];
  const shared = new Map(declsFromDict(tokens).map((d) => [d.name, d.value]));

  return declsFromDict(tokens, readFrom(composed.web)).filter(
    (d) => shared.get(d.name) !== d.value,
  );
};

/**
 * RN `tokensByMode` 레코드를 만드는 진입 모듈 소스.
 *
 * import는 확장자 없이 쓴다. 이 산출물은 `.ts` 파일 그대로 번들러(Metro/Rollup/Vite)가
 * 소비한다 — Metro는 `./x.js`를 `x.ts`로 바꿔 찾지 않으므로 확장자를 붙이면 깨진다.
 * (design-tokens 패키지 자신은 Node ESM으로도 로드되므로 거기서는 `.js`가 필요하다.)
 */
const rnIndexSource = (modes: readonly string[]): string => {
  const imports = modes
    .map((m) => `import { tokens as ${m} } from './themes/${m}/tokens';`)
    .join('\n');
  const entries = modes.map((m) => `  ${m},`).join('\n');

  return `/* eslint-disable */
// AUTO-GENERATED — consumer RN tokens
${imports}

export const tokensByMode = {
${entries}
} as const;

export default tokensByMode;
`;
};

/**
 * extension을 컴파일해 Consumer 산출물을 쓴다.
 *
 * - `css/variables.{theme}.css` : Shared 대비 달라진 변수만. non-override 토큰은 Shared CSS가 계속 담당한다.
 * - `rn/themes/{theme}/tokens.ts` + `rn/index.ts` : `tokensByMode`로 바로 쓸 수 있는 완전한 레코드.
 *
 * Web TS 트리는 만들지 않는다 — Web은 CSS 변수로 동작하므로 두 번째 진실 원본이 된다.
 * 검증에 실패하면 아무 파일도 쓰지 않는다.
 */
export const compileExtension = async (
  builds: readonly ThemeBuild[],
  extension: TokenExtension,
  { outDir, scope }: CompileOptions,
): Promise<CompileResult> => {
  const composition = composeExtension(builds, extension);

  if (!composition.ok) {
    return { ok: false, diagnostics: composition.diagnostics };
  }

  const files: string[] = [];
  const cssBlocks: string[] = [];

  for (const composed of composition.themes) {
    const build = builds.find((b) => b.theme === composed.theme);
    if (!build) continue;

    const css = block(scopeSelector(composed.selector, scope), changedDecls(build, composed));
    const cssFile = path.join('css', `variables.${composed.theme}.css`);

    await write(path.join(outDir, cssFile), css);
    files.push(cssFile);
    cssBlocks.push(css);

    // RN은 CSS 변수가 없으므로 완전한 값 트리가 필요하다.
    const rnFile = path.join('rn', 'themes', composed.theme, 'tokens.ts');
    await write(
      path.join(outDir, rnFile),
      themeFileSource(composed.theme, build.rn, readFrom(composed.rn)),
    );
    files.push(rnFile);
  }

  await write(path.join(outDir, 'css', 'variables.css'), cssBlocks.join('\n'));
  files.push(path.join('css', 'variables.css'));

  const modes = composition.themes.map((t) => t.theme);
  await write(path.join(outDir, 'rn', 'index.ts'), rnIndexSource(modes));
  files.push(path.join('rn', 'index.ts'));

  const manifest: CompileManifest = {
    extension: extension.name,
    contractVersion: CONTRACT_VERSION,
    modes,
    files: [...files].sort(),
    warnings: warnings(composition.diagnostics),
  };

  await write(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  // 여기 도달했다면 composeExtension이 이미 error 없음을 보장한다.
  return { ok: true, manifest, diagnostics: composition.diagnostics };
};
