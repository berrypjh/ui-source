import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 패키지별 시나리오 등록부.
 * `MEASURE_TARGET` 환경변수로 선택한다 (기본 `design-tokens`, 후방 호환).
 *
 * 새 패키지 추가는 여기 항목 추가만 하면 됨.
 */
const TARGETS = {
  'design-tokens': {
    pkg: path.resolve('libs/design-tokens'),
    scenarios: {
      baseline: [
        'package.json',
        'README.md',
        'dist/index.d.ts',
        'dist/web.d.ts',
        'dist/.generated/web/index.d.ts',
        'dist/.generated/web/themes/light/tokens.d.ts',
        'dist/.generated/web/themes/dark/tokens.d.ts',
        'dist/.generated/web/themes/sepia/tokens.d.ts',
      ],
      'with-catalog': ['package.json', 'dist/tokens.json'],
      'catalog-only': ['dist/tokens.json'],
      'agents+catalog': ['dist/AGENTS.md', 'dist/tokens.json'],

      // TSV 변형은 미채택 — 재평가 시 design-tokens lib에 `writeTokensTsv` 부활 후 주석 해제.
      // 'with-tsv': ['package.json', 'dist/tokens.tsv'],
      // 'tsv-only': ['dist/tokens.tsv'],
    } as Record<string, string[]>,
  },
  'ui-core': {
    pkg: path.resolve('libs/ui-core'),
    scenarios: {
      baseline: ['package.json', 'README.md', 'dist/index.d.ts'],
      'with-agents': ['package.json', 'dist/AGENTS.md'],
      'agents-only': ['dist/AGENTS.md'],
      'agents+tokens': ['dist/AGENTS.md', 'dist/tokens.json'],
      'tokens-only': ['dist/tokens.json'],
    } as Record<string, string[]>,
  },
  'react-ui': {
    pkg: path.resolve('libs/react-ui'),
    scenarios: {
      baseline: ['package.json', 'README.md', 'dist/types/index.d.ts'],
      'with-agents': ['package.json', 'dist/AGENTS.md'],
      'agents-only': ['dist/AGENTS.md'],
      'agents+tokens': ['dist/AGENTS.md', 'dist/tokens.json'],
      'tokens-only': ['dist/tokens.json'],
      // Command 02 — 생성 API 카탈로그. 기존 시나리오 의미는 그대로 둔다.
      'agents+api-catalog': ['dist/AGENTS.md', 'dist/llm-catalog.json'],
      'api-catalog-only': ['dist/llm-catalog.json'],
    } as Record<string, string[]>,
  },
  'react-native-ui': {
    pkg: path.resolve('libs/react-native-ui'),
    scenarios: {
      baseline: ['package.json', 'README.md', 'dist/index.d.ts'],
      'with-agents': ['package.json', 'dist/AGENTS.md'],
      'agents-only': ['dist/AGENTS.md'],
      'agents+tokens': ['dist/AGENTS.md', 'dist/tokens.json'],
      'tokens-only': ['dist/tokens.json'],
      // Command 02 — 생성 API 카탈로그. 기존 시나리오 의미는 그대로 둔다.
      'agents+api-catalog': ['dist/AGENTS.md', 'dist/llm-catalog.json'],
      'api-catalog-only': ['dist/llm-catalog.json'],
    } as Record<string, string[]>,
  },
} as const satisfies Record<string, { pkg: string; scenarios: Record<string, string[]> }>;

type TargetName = keyof typeof TARGETS;

const targetName = (process.env.MEASURE_TARGET ?? 'design-tokens') as TargetName;
const target = TARGETS[targetName];
if (!target) {
  console.error(
    `unknown MEASURE_TARGET "${targetName}". valid: ${Object.keys(TARGETS).join(', ')}`,
  );
  process.exit(1);
}

export const PKG = target.pkg;
export const scenarios = target.scenarios;
export const TARGET_NAME = targetName;

export const readFiles = async (rels: string[]): Promise<{ content: string; chars: number }> => {
  const parts: string[] = [];
  for (const rel of rels) {
    const abs = path.join(PKG, rel);
    try {
      const text = await fs.readFile(abs, 'utf8');
      parts.push(`=== ${rel} ===\n${text}`);
    } catch (e) {
      throw new Error(
        `missing file ${rel} — build the target package first. (${(e as Error).message})`,
      );
    }
  }
  const content = parts.join('\n\n');
  return { content, chars: content.length };
};

export const fmt = (n: number) => n.toLocaleString();

export const delta = (cur: number, base: number): string => {
  if (cur === base) return '—';
  const sign = cur < base ? '−' : '+';
  return `${sign}${((Math.abs(cur - base) / base) * 100).toFixed(1)}%`;
};

export type Row = {
  name: string;
  files: number;
  chars: number;
  tokens: number;
};

export const printTable = (provider: string, rows: Row[]): void => {
  console.log(`target:   ${TARGET_NAME}`);
  console.log(`provider: ${provider}\n`);
  const base = rows[0];
  const nameW = Math.max(10, ...rows.map((r) => r.name.length));
  const headers = [
    'scenario'.padEnd(nameW),
    'files'.padStart(5),
    'chars'.padStart(9),
    'tokens'.padStart(9),
    'Δ'.padStart(7),
  ];
  console.log(headers.join('  '));
  console.log('-'.repeat(headers.join('  ').length));
  for (const r of rows) {
    console.log(
      [
        r.name.padEnd(nameW),
        String(r.files).padStart(5),
        fmt(r.chars).padStart(9),
        fmt(r.tokens).padStart(9),
        (r === base ? '—' : delta(r.tokens, base.tokens)).padStart(7),
      ].join('  '),
    );
  }
};
