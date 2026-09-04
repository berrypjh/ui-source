/**
 * Sample Consumer fixture를 실제 public compiler로 컴파일한다.
 *
 * Demo가 쓰는 CSS는 손으로 쓰지 않는다 — 이 스크립트 산출물이다.
 * 출력 위치는 `_generated/`라 저장소 관례대로 커밋되지 않는다.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { themes } from '@berrypjh/design-tokens';
import { buildThemeDictionaries, compileExtension } from '@berrypjh/design-tokens/compiler';

import { SAMPLE_SCOPE, sampleConsumer } from '../../fixtures/sampleConsumer';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const TOKENS_DIR = path.join(REPO_ROOT, 'libs/design-tokens/tokens');

const TARGETS = {
  web: path.join(REPO_ROOT, 'apps/demo-web/src/_generated/sample-consumer'),
  native: path.join(REPO_ROOT, 'apps/demo-mobile/src/_generated/sample-consumer'),
} as const;

const main = async (): Promise<void> => {
  const requested = process.argv.find((a) => a.startsWith('--target='))?.split('=')[1] ?? 'web';
  const outDir = TARGETS[requested as keyof typeof TARGETS];
  if (!outDir)
    throw new Error(`unknown target "${requested}". valid: ${Object.keys(TARGETS).join(', ')}`);

  const builds = await buildThemeDictionaries(themes, TOKENS_DIR);
  const result = await compileExtension(builds, sampleConsumer, { outDir, scope: SAMPLE_SCOPE });

  if (!result.ok) {
    for (const d of result.diagnostics) console.error(`[${d.severity}] ${d.code} — ${d.message}`);
    throw new Error(`sample consumer failed to compile (${result.diagnostics.length} diagnostics)`);
  }

  for (const warning of result.manifest.warnings) console.warn(`[warning] ${warning.message}`);
  console.log(
    `${result.manifest.extension} → ${path.relative(REPO_ROOT, outDir)} (${result.manifest.files.length} files, scope ${SAMPLE_SCOPE})`,
  );
};

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
