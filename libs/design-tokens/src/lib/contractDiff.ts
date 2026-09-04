/**
 * 두 contract metadata를 비교해 upgrade 안전성을 분류한다.
 *
 * 릴리스 자동화나 codemod는 아직 만들지 않는다 — 여기서는 순수 비교 함수만 둔다.
 */
import type { ContractMetadata, ContractRow } from './genContract.js';

export type ContractChangeKind =
  | 'added-public'
  | 'deprecated'
  | 'removed-public'
  | 'type-changed'
  | 'visibility-narrowed'
  | 'overridable-revoked';

export type ContractChange = {
  readonly kind: ContractChangeKind;
  readonly path: string;
  readonly breaking: boolean;
  readonly from?: string;
  readonly to?: string;
  /** deprecated일 때 제안되는 대체 path. */
  readonly replacement?: string;
  readonly message: string;
};

const TYPE = 0;
const VISIBILITY = 1;
const OVERRIDABLE = 2;
const DEPRECATED_REPLACEMENT = 4;

/** breaking 여부는 종류만으로 결정된다 — 호출부가 임의로 바꾸지 않는다. */
const BREAKING: Record<ContractChangeKind, boolean> = {
  'added-public': false,
  deprecated: false,
  'removed-public': true,
  'type-changed': true,
  'visibility-narrowed': true,
  'overridable-revoked': true,
};

const change = (
  kind: ContractChangeKind,
  path: string,
  message: string,
  extra: { from?: string; to?: string; replacement?: string } = {},
): ContractChange => ({ kind, path, breaking: BREAKING[kind], message, ...extra });

/** 한 토큰의 이전/이후 행을 비교한다. */
const diffRow = (path: string, prev: ContractRow, next: ContractRow): ContractChange[] => {
  const changes: ContractChange[] = [];

  if (prev[TYPE] !== next[TYPE]) {
    changes.push(
      change('type-changed', path, `"${path}" changed type from ${prev[TYPE]} to ${next[TYPE]}`, {
        from: String(prev[TYPE]),
        to: String(next[TYPE]),
      }),
    );
  }

  if (prev[VISIBILITY] === 'public' && next[VISIBILITY] !== 'public') {
    changes.push(
      change(
        'visibility-narrowed',
        path,
        `"${path}" is no longer public (${prev[VISIBILITY]} -> ${next[VISIBILITY]})`,
        { from: String(prev[VISIBILITY]), to: String(next[VISIBILITY]) },
      ),
    );
  }

  if (prev[OVERRIDABLE] === true && next[OVERRIDABLE] === false) {
    changes.push(change('overridable-revoked', path, `"${path}" is no longer overridable`));
  }

  if (!prev[DEPRECATED_REPLACEMENT] && next[DEPRECATED_REPLACEMENT]) {
    changes.push(
      change('deprecated', path, `"${path}" is deprecated; use "${next[DEPRECATED_REPLACEMENT]}"`, {
        replacement: String(next[DEPRECATED_REPLACEMENT]),
      }),
    );
  }

  return changes;
};

export type ContractDiff = {
  /** path 오름차순, 같은 path 안에서는 종류 순. 결정적이다. */
  readonly changes: readonly ContractChange[];
  /** breaking 변경이 하나라도 있으면 true — major가 필요하다. */
  readonly breaking: boolean;
};

/**
 * 이전 contract metadata와 이후 metadata를 비교한다.
 * 순수 함수이며 입력을 변형하지 않는다.
 */
export const diffContracts = (prev: ContractMetadata, next: ContractMetadata): ContractDiff => {
  const changes: ContractChange[] = [];

  for (const [path, prevRow] of Object.entries(prev.tokens)) {
    const nextRow = next.tokens[path];

    if (!nextRow) {
      changes.push(
        change('removed-public', path, `"${path}" was removed from the public contract`),
      );
      continue;
    }

    changes.push(...diffRow(path, prevRow, nextRow));
  }

  for (const path of Object.keys(next.tokens)) {
    if (!prev.tokens[path]) {
      changes.push(change('added-public', path, `"${path}" was added to the public contract`));
    }
  }

  changes.sort((a, b) => a.path.localeCompare(b.path) || a.kind.localeCompare(b.kind));

  return { changes, breaking: changes.some((c) => c.breaking) };
};
