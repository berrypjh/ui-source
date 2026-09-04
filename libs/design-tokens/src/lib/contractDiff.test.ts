import { describe, expect, it } from 'vitest';

import { diffContracts } from './contractDiff.js';
import { buildContractMetadata, type ContractMetadata } from './genContract.js';

const base = (): ContractMetadata => ({
  schema: 's',
  contractVersion: 1,
  internalPrimitiveRoots: ['color.primary'],
  tokens: {
    'color.text.default': ['color', 'public', true, 'stable', null],
    'borderWidth.semantic.focus': ['dimension', 'public', true, 'stable', null],
  },
});

/** base에서 한 군데만 바꾼 사본. */
const mutate = (fn: (m: ContractMetadata) => void): ContractMetadata => {
  const next = JSON.parse(JSON.stringify(base())) as ContractMetadata;
  fn(next);
  return next;
};

const only = (next: ContractMetadata) => diffContracts(base(), next);

describe('non-breaking changes', () => {
  it('classifies an added public token as non-breaking', () => {
    const d = only(
      mutate((m) => {
        m.tokens['color.text.brand'] = ['color', 'public', true, 'experimental', null];
      }),
    );
    expect(d.breaking).toBe(false);
    expect(d.changes).toEqual([
      expect.objectContaining({ kind: 'added-public', path: 'color.text.brand', breaking: false }),
    ]);
  });

  it('classifies a deprecation as non-breaking and suggests the replacement', () => {
    const d = only(
      mutate((m) => {
        m.tokens['color.text.default'][4] = 'color.text.primary';
      }),
    );
    expect(d.breaking).toBe(false);
    expect(d.changes[0]).toMatchObject({
      kind: 'deprecated',
      breaking: false,
      replacement: 'color.text.primary',
    });
  });

  it('reports nothing when the contract is unchanged', () => {
    expect(only(base())).toEqual({ changes: [], breaking: false });
  });
});

describe('breaking changes', () => {
  it('classifies a removed public token as breaking', () => {
    const d = only(
      mutate((m) => {
        delete m.tokens['color.text.default'];
      }),
    );
    expect(d.breaking).toBe(true);
    expect(d.changes[0]).toMatchObject({ kind: 'removed-public', path: 'color.text.default' });
  });

  it('classifies a type change as breaking', () => {
    const d = only(
      mutate((m) => {
        m.tokens['color.text.default'][0] = 'dimension';
      }),
    );
    expect(d.breaking).toBe(true);
    expect(d.changes[0]).toMatchObject({ kind: 'type-changed', from: 'color', to: 'dimension' });
  });

  it('classifies public -> internal as breaking', () => {
    const d = only(
      mutate((m) => {
        m.tokens['color.text.default'][1] = 'internal';
      }),
    );
    expect(d.breaking).toBe(true);
    expect(d.changes[0]).toMatchObject({ kind: 'visibility-narrowed' });
  });

  it('classifies overridable true -> false as breaking', () => {
    const d = only(
      mutate((m) => {
        m.tokens['color.text.default'][2] = false;
      }),
    );
    expect(d.breaking).toBe(true);
    expect(d.changes[0]).toMatchObject({ kind: 'overridable-revoked' });
  });

  it('reports several breaking changes on one token', () => {
    const d = only(
      mutate((m) => {
        m.tokens['color.text.default'] = ['dimension', 'internal', false, 'stable', null];
      }),
    );
    expect(d.changes.map((c) => c.kind).sort()).toEqual([
      'overridable-revoked',
      'type-changed',
      'visibility-narrowed',
    ]);
  });
});

describe('diff behaviour', () => {
  it('orders changes deterministically', () => {
    const next = mutate((m) => {
      m.tokens['a.b.c'] = ['color', 'public', true, 'stable', null];
      delete m.tokens['borderWidth.semantic.focus'];
    });
    expect(diffContracts(base(), next).changes.map((c) => c.path)).toEqual([
      'a.b.c',
      'borderWidth.semantic.focus',
    ]);
  });

  it('does not mutate either input', () => {
    const prev = base();
    const next = mutate((m) => delete m.tokens['color.text.default']);
    const before = [JSON.stringify(prev), JSON.stringify(next)];
    diffContracts(prev, next);
    expect([JSON.stringify(prev), JSON.stringify(next)]).toEqual(before);
  });

  it('sees the real contract as unchanged against itself', () => {
    expect(diffContracts(buildContractMetadata(), buildContractMetadata())).toEqual({
      changes: [],
      breaking: false,
    });
  });
});
