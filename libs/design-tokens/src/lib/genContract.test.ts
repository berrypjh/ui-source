import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { publicContractEntries } from './contract.js';
import { buildContractMetadata, serializeContractMetadata } from './genContract.js';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../dist');

describe('contract metadata', () => {
  const metadata = buildContractMetadata();

  it('covers every public contract entry', () => {
    expect(Object.keys(metadata.tokens).sort()).toEqual(
      publicContractEntries.map((e) => e.path).sort(),
    );
  });

  it('carries type, visibility, overridable and stability per token', () => {
    for (const entry of publicContractEntries) {
      const [type, visibility, overridable, stability] = metadata.tokens[entry.path];
      expect(type).toBe(entry.type);
      expect(visibility).toBe(entry.visibility);
      expect(overridable).toBe(entry.overridable);
      expect(stability).toBe(entry.stability);
    }
  });

  it('lists the internal primitive roots', () => {
    expect(metadata.internalPrimitiveRoots).toContain('color.primary');
    expect(metadata.internalPrimitiveRoots).toContain('borderWidth.primitive');
    expect(metadata.internalPrimitiveRoots).toEqual([...metadata.internalPrimitiveRoots].sort());
  });

  it('excludes internal primitives from the token map', () => {
    expect(metadata.tokens['color.primary.pr700']).toBeUndefined();
  });

  it('declares a contract version and a self-describing schema', () => {
    expect(metadata.contractVersion).toBe(1);
    expect(metadata.schema).toContain('type, visibility, overridable, stability');
  });

  it('leaves the deprecation slot null while nothing is deprecated', () => {
    for (const row of Object.values(metadata.tokens)) expect(row[4]).toBeNull();
  });

  it('is deterministic and path-ordered', () => {
    const paths = Object.keys(metadata.tokens);
    expect(paths).toEqual([...paths].sort());
    expect(serializeContractMetadata(buildContractMetadata())).toBe(
      serializeContractMetadata(buildContractMetadata()),
    );
  });
});

describe('dist/contract.json', () => {
  it('is emitted by the shared build and parses', async () => {
    const raw = await fs.readFile(path.join(DIST, 'contract.json'), 'utf8');
    const parsed = JSON.parse(raw);
    expect(parsed.contractVersion).toBe(1);
    expect(parsed.tokens['color.text.default']).toEqual(['color', 'public', true, 'stable', null]);
  });

  it('keeps tokens.json a separate artifact with its own schema', async () => {
    const tokens = JSON.parse(await fs.readFile(path.join(DIST, 'tokens.json'), 'utf8'));
    expect(tokens.schema).toBe('tokens[path] = [cssVar, ...valuesInThemesOrder]');
    expect(tokens.tokens['color.text.default'][0]).toBe('--ds-text-default');
    // 값 인벤토리에는 governance 필드가 섞이지 않는다.
    expect(tokens).not.toHaveProperty('contractVersion');
  });
});
