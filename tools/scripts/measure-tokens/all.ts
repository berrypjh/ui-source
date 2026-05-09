import { encoding_for_model, type TiktokenModel } from 'tiktoken';

import { delta, fmt, readFiles, scenarios } from './shared';

/**
 * Anthropic count_tokens API + OpenAI tiktoken을 같은 시나리오에 동시 적용해
 * 한 표에서 두 provider를 비교한다.
 *
 * OpenAI 측은 항상 측정. Anthropic 측은 `ANTHROPIC_API_KEY`가 있을 때만 측정 (없으면 — 표시).
 *
 * 사용:
 *   pnpm tokens:measure                # OpenAI만
 *   ANTHROPIC_API_KEY=sk-... pnpm tokens:measure   # 둘 다
 *
 * 환경변수
 *   ANTHROPIC_API_KEY        (선택 — 없으면 Anthropic 칸은 — 표시)
 *   MEASURE_ANTHROPIC_MODEL  (선택, 기본 'claude-sonnet-4-6')
 *   MEASURE_OPENAI_MODEL     (선택, 기본 'gpt-4o')
 */

const ANTHROPIC_MODEL = process.env.MEASURE_ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';
const OPENAI_MODEL = (process.env.MEASURE_OPENAI_MODEL ?? 'gpt-4o') as TiktokenModel;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages/count_tokens';

const apiKey = process.env.ANTHROPIC_API_KEY;

const countAnthropic = async (content: string): Promise<number> => {
  const r = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey as string,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      messages: [{ role: 'user', content }],
    }),
  });
  if (!r.ok) throw new Error(`anthropic count_tokens ${r.status}: ${await r.text()}`);
  const data = (await r.json()) as { input_tokens: number };
  return data.input_tokens;
};

const countOpenAI = (content: string): number => {
  const enc = encoding_for_model(OPENAI_MODEL);
  try {
    return enc.encode(content).length;
  } finally {
    enc.free();
  }
};

type Row = {
  name: string;
  files: number;
  chars: number;
  anthropic: number | null;
  openai: number;
};

const main = async () => {
  console.log(`anthropic: ${apiKey ? ANTHROPIC_MODEL : '(skipped — set ANTHROPIC_API_KEY)'}`);
  console.log(`openai:    ${OPENAI_MODEL} (tiktoken local)\n`);

  const rows: Row[] = [];
  for (const [name, files] of Object.entries(scenarios)) {
    const { content, chars } = await readFiles(files);
    const openai = countOpenAI(content);
    const anthropic = apiKey ? await countAnthropic(content) : null;
    rows.push({ name, files: files.length, chars, anthropic, openai });
  }

  const base = rows[0];
  const nameW = Math.max(8, ...rows.map((r) => r.name.length));
  const cols = [
    'scenario'.padEnd(nameW),
    'files'.padStart(5),
    'chars'.padStart(9),
    'anthropic'.padStart(10),
    'Δ ant'.padStart(7),
    'openai'.padStart(9),
    'Δ oai'.padStart(7),
  ];
  console.log(cols.join('  '));
  console.log('-'.repeat(cols.join('  ').length));
  for (const r of rows) {
    const isBase = r === base;
    console.log(
      [
        r.name.padEnd(nameW),
        String(r.files).padStart(5),
        fmt(r.chars).padStart(9),
        (r.anthropic == null ? '—' : fmt(r.anthropic)).padStart(10),
        (isBase || r.anthropic == null || base.anthropic == null
          ? '—'
          : delta(r.anthropic, base.anthropic)
        ).padStart(7),
        fmt(r.openai).padStart(9),
        (isBase ? '—' : delta(r.openai, base.openai)).padStart(7),
      ].join('  '),
    );
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
