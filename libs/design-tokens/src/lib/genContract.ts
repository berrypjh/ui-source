/**
 * Contract metadata sidecar — `dist/contract.json`.
 *
 * `tokens.json`(값 인벤토리)의 ABI는 건드리지 않는다. 어떤 토큰을 override할 수 있고
 * 무엇이 internal primitive인지는 이 파일이 따로 알려준다.
 * 형식은 `genCatalog.ts`와 같은 positional tuple + `schema` 문자열 방식을 따른다.
 */
import fs from 'node:fs/promises';

import { CONTRACT_VERSION, INTERNAL_PRIMITIVE_ROOTS, publicContractEntries } from './contract.js';

/** `[type, visibility, overridable, stability, deprecatedReplacement]`. */
export type ContractRow = [string, string, boolean, string, string | null];

export type ContractMetadata = {
  schema: string;
  contractVersion: number;
  /** Consumer override가 막힌 primitive root. 이 아래는 전부 internal이다. */
  internalPrimitiveRoots: string[];
  tokens: Record<string, ContractRow>;
};

const SCHEMA = 'contract[path] = [type, visibility, overridable, stability, deprecatedReplacement]';

/** contract 항목을 metadata 형태로 만든다. path 오름차순으로 결정적이다. */
export const buildContractMetadata = (): ContractMetadata => {
  const tokens: Record<string, ContractRow> = {};

  for (const entry of [...publicContractEntries].sort((a, b) => a.path.localeCompare(b.path))) {
    tokens[entry.path] = [
      entry.type,
      entry.visibility,
      entry.overridable,
      entry.stability,
      entry.deprecated ? (entry.replacement ?? null) : null,
    ];
  }

  return {
    schema: SCHEMA,
    contractVersion: CONTRACT_VERSION,
    internalPrimitiveRoots: [...INTERNAL_PRIMITIVE_ROOTS].sort(),
    tokens,
  };
};

/** 토큰 한 줄 직렬화 — `genCatalog`와 같은 조밀한 형태. */
export const serializeContractMetadata = (metadata: ContractMetadata): string => {
  const lines = Object.entries(metadata.tokens).map(
    ([path, row]) => `    ${JSON.stringify(path)}: ${JSON.stringify(row)}`,
  );

  return [
    '{',
    `  "schema": ${JSON.stringify(metadata.schema)},`,
    `  "contractVersion": ${metadata.contractVersion},`,
    `  "internalPrimitiveRoots": ${JSON.stringify(metadata.internalPrimitiveRoots)},`,
    `  "tokens": {`,
    lines.join(',\n'),
    '  }',
    '}',
    '',
  ].join('\n');
};

/** `dist/contract.json` 을 쓴다. */
export const writeContractMetadata = async (outFileAbs: string): Promise<void> => {
  await fs.writeFile(outFileAbs, serializeContractMetadata(buildContractMetadata()), 'utf8');
};
