import { printTable, readFiles, type Row, scenarios } from './shared';

/**
 * Anthropic count_tokens REST API로 시나리오별 input 토큰 수를 측정한다.
 * SDK 미사용, fetch만.
 *
 * 사용:
 *   ANTHROPIC_API_KEY=sk-... pnpm tokens:measure:claude
 *
 * 환경변수
 *   ANTHROPIC_API_KEY        (필수)
 *   MEASURE_ANTHROPIC_MODEL  (선택, 기본 'claude-sonnet-4-6')
 */

const MODEL = process.env.MEASURE_ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';
const API_URL = 'https://api.anthropic.com/v1/messages/count_tokens';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ANTHROPIC_API_KEY env var is required.');
  console.error('  export ANTHROPIC_API_KEY=sk-...');
  process.exit(1);
}

const countTokens = async (content: string): Promise<number> => {
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content }],
    }),
  });
  if (!r.ok) throw new Error(`count_tokens ${r.status}: ${await r.text()}`);
  const data = (await r.json()) as { input_tokens: number };
  return data.input_tokens;
};

const main = async () => {
  const rows: Row[] = [];
  for (const [name, files] of Object.entries(scenarios)) {
    const { content, chars } = await readFiles(files);
    const tokens = await countTokens(content);
    rows.push({ name, files: files.length, chars, tokens });
  }
  printTable(`Anthropic ${MODEL}`, rows);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
