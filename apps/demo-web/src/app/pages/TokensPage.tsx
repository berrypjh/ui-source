import { useMemo, useState } from 'react';

import { Web } from '@berrypjh/react-ui';

import { Mono, Page, Section } from '../shell/ui';

import { TokenPreview } from './TokenPreview';

/**
 * 토큰 탐색.
 *
 * 수백 개 swatch 를 나열하면 찾을 수 없다. 검색과 카테고리 필터를 앞에 두고,
 * 행은 이름 · 값 · CSS 변수 · 미리보기만 담아 조밀하게 만든다.
 * 세 열은 각각 끄고 켤 수 있다 — 값만 대조할 때와 눈으로 훑을 때 필요한 열이 다르다.
 */

type Row = { path: string; value: string; cssVar: string; category: string };

type ColumnId = 'preview' | 'value' | 'cssVar';

const COLUMNS: { id: ColumnId; label: string; width: string }[] = [
  { id: 'value', label: '값', width: 'w-[160px]' },
  { id: 'cssVar', label: 'CSS 변수', width: 'w-[280px]' },
  { id: 'preview', label: '미리보기', width: 'w-[140px]' },
];

const kebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

/** 토큰 트리를 평탄한 행으로. `Web.Light.tokens` 는 ui-core 패스스루로 노출된다. */
const flatten = (node: unknown, path: string[] = []): Row[] => {
  if (node === null || typeof node !== 'object') {
    const category = path[0] ?? '';
    return [
      {
        path: path.join('.'),
        value: String(node),
        cssVar: `--ds-${kebab(path.slice(1).join('-'))}`,
        category,
      },
    ];
  }
  return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
    flatten(v, [...path, k]),
  );
};

/** 정렬 가능한 값의 크기. 같은 차원끼리만 비교하려고 차원을 함께 돌려준다. */
const magnitude = (value: string): [dimension: string, size: number] | null => {
  const v = value.trim();
  const length = /^(-?[\d.]+)(rem|em|px)$/.exec(v);
  if (length) return ['length', Number(length[1]) / (length[2] === 'px' ? 16 : 1)];
  const time = /^([\d.]+)(ms|s)$/.exec(v);
  if (time) return ['time', Number(time[1]) * (time[2] === 's' ? 1000 : 1)];
  if (/^-?[\d.]+$/.test(v)) return ['number', Number(v)];
  return null;
};

const parentOf = (path: string) => path.slice(0, path.lastIndexOf('.'));

/**
 * 스케일 토큰을 작은 값에서 큰 값 순으로 놓는다.
 *
 * 이름 순으로 두면 `spacing.2xl` 이 `spacing.2xs` 앞에 와서 스케일이 읽히지 않는다.
 * 한 부모 아래 형제 값이 모두 같은 차원의 수치일 때만 정렬하고, 색처럼 비교할 수 없는
 * 값은 원래 순서를 지킨다 — `pr100 → pr900` 은 이미 맞는 순서다.
 */
const sortScales = (rows: Row[]): Row[] => {
  const out: Row[] = [];
  for (let i = 0; i < rows.length; ) {
    let j = i;
    while (j < rows.length && parentOf(rows[j].path) === parentOf(rows[i].path)) j += 1;
    const group = rows.slice(i, j).map((row) => ({ row, size: magnitude(row.value) }));
    const dimensions = new Set(group.map((g) => g.size?.[0]));
    const comparable = group.length > 1 && !dimensions.has(undefined) && dimensions.size === 1;
    if (comparable) group.sort((a, b) => (a.size?.[1] ?? 0) - (b.size?.[1] ?? 0));
    out.push(...group.map((g) => g.row));
    i = j;
  }
  return out;
};

const ALL: Row[] = sortScales(flatten(Web.Light.tokens));
const CATEGORIES = [...new Set(ALL.map((r) => r.category))].sort();

/**
 * 선택 상태는 채워서 알린다 — 테두리 색만 바꾸면 옆 칩과 구분이 안 된다.
 *
 * 채움은 `background.primary` + `text.contrastText` 를 쓴다. 이 쌍은 세 테마 모두
 * 4.5:1 을 넘도록 설계된 조합이다. `background.dark` 는 dark 테마에서 밝은 색으로
 * 뒤집히는데 `contrastText` 는 밝은 채로 남아 글자가 사라진다.
 */
const chipClass = (on: boolean) =>
  [
    'px-md py-xs text-xxsm rounded-sm border cursor-pointer transition-colors',
    on
      ? 'border-stroke-primary bg-background-primary text-text-contrastText'
      : 'border-stroke-default bg-background-surface text-text-light hover:text-text-default',
  ].join(' ');

const Check = () => (
  <svg viewBox="0 0 12 12" className="w-[10px] h-[10px]" aria-hidden focusable="false">
    <path
      d="M2.5 6.5 5 9l4.5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TokensPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [shown, setShown] = useState<ColumnId[]>(['preview', 'value', 'cssVar']);

  const isOn = (id: ColumnId) => shown.includes(id);
  const toggle = (id: ColumnId) =>
    setShown((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL.filter(
      (r) =>
        (category === 'all' || r.category === category) &&
        (q === '' || r.path.toLowerCase().includes(q) || r.cssVar.includes(q)),
    );
  }, [query, category]);

  return (
    <Page
      testId="tokens-page"
      title="Tokens"
      lead="이름이나 CSS 변수로 찾습니다. 값은 현재 테마 기준입니다."
    >
      <Section title="검색" note={`${rows.length} / ${ALL.length}개`}>
        <div className="flex flex-wrap gap-lg items-center mb-lg">
          <label className="flex-1 min-w-[240px]">
            <span className="sr-only">토큰 검색</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름 또는 CSS 변수로 검색"
              data-testid="token-search"
              className="w-full px-lg py-sm text-xsm rounded-sm border border-field-border bg-background-surface text-text-default placeholder:text-text-placeholder focus:outline-none focus:border-stroke-primary"
            />
          </label>
          <div role="group" aria-label="카테고리" className="flex flex-wrap gap-xs">
            {['all', ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={chipClass(category === c)}
              >
                {c === 'all' ? '전체' : c}
              </button>
            ))}
          </div>
        </div>

        <div
          role="group"
          aria-label="열 표시"
          data-testid="token-columns"
          className="flex flex-wrap gap-xs items-center mb-lg"
        >
          <span className="text-text-light text-xxsm mr-xs">표시</span>
          {COLUMNS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              aria-pressed={isOn(c.id)}
              data-testid={`token-column-${c.id}`}
              className={chipClass(isOn(c.id))}
            >
              <span className="inline-flex items-center gap-xs">
                {/* 열 토글은 서로 독립이라 칩마다 켜짐을 따로 표시한다. 자리는 늘 비워 둬 글자가 밀리지 않는다. */}
                <span className="inline-flex w-[10px] justify-center">
                  {isOn(c.id) && <Check />}
                </span>
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="text-text-light text-xsm py-2xl text-center">
            일치하는 토큰이 없습니다. 다른 이름으로 찾아보세요.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xsm border-collapse">
              <thead>
                <tr className="text-text-light text-xxsm">
                  <th className="text-left font-semiBold pb-md pr-lg">토큰</th>
                  {COLUMNS.filter((c) => isOn(c.id)).map((c) => (
                    <th key={c.id} className={`text-left font-semiBold pb-md pr-lg ${c.width}`}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 300).map((r) => (
                  <tr key={r.path} className="border-t border-stroke-light">
                    <td className="py-md pr-lg text-text-default align-middle">{r.path}</td>
                    {isOn('value') && (
                      <td className="py-md pr-lg align-middle font-mono text-xxsm text-text-light">
                        {r.value}
                      </td>
                    )}
                    {isOn('cssVar') && (
                      <td className="py-md pr-lg align-middle">
                        <Mono>{r.cssVar}</Mono>
                      </td>
                    )}
                    {isOn('preview') && (
                      <td className="py-md pr-lg align-middle">
                        <TokenPreview path={r.path} value={r.value} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 300 && (
              <p className="text-text-light text-xxsm mt-lg">
                상위 300개만 보여줍니다. 검색어를 좁혀 주세요.
              </p>
            )}
          </div>
        )}
      </Section>
    </Page>
  );
};

export default TokensPage;
