/**
 * authoring shape → canonical path 변환. 내부 표현은 canonical dot-path 하나뿐이다.
 *
 * `source` 는 중첩 그룹으로 작성하지만 여기서 평탄화되고, `semantic`/`modes` 는 이미
 * canonical path를 key로 쓰므로 그대로 통과한다. 이후 compiler/validator는
 * 이 결과만 소비한다.
 */
import type { ThemeName } from '../themes.js';

import type { BrandGroup, TokenExtension } from './types.js';

/** 값이 alias인지 판별하고 대상 path를 돌려준다. */
export const referenceTarget = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const match = /^\{([^{}]+)\}$/.exec(value.trim());
  return match?.[1];
};

/** hex 리터럴이면 color, 그 외에는 dimension으로 본다. alias는 판별하지 않는다. */
const inferType = (value: unknown): 'color' | 'dimension' =>
  typeof value === 'string' && value.startsWith('#') ? 'color' : 'dimension';

/** `$value` 를 가진 DTCG 토큰 객체인가. */
const isTokenObject = (node: unknown): node is { $value: unknown; $type?: unknown } =>
  !!node && typeof node === 'object' && !Array.isArray(node) && '$value' in node;

/** 하위 그룹인가. */
const isGroup = (node: unknown): node is BrandGroup =>
  !!node && typeof node === 'object' && !Array.isArray(node) && !('$value' in node);

/** 평탄화된 Consumer brand 토큰. `--ds-*` 로 방출되지 않는다. */
export type NormalizedSourceToken = {
  readonly path: string;
  readonly value: string | number;
  readonly type: 'color' | 'dimension';
  /** alias면 대상 canonical path. */
  readonly reference?: string;
};

/** 평탄화된 public semantic override. */
export type NormalizedOverride = {
  readonly path: string;
  /** 지정하지 않으면 모든 mode에 적용되는 base 값. */
  readonly mode?: ThemeName;
  readonly value: string | number;
  readonly type: 'color' | 'dimension';
  /** 작성자가 명시한 `$type`. 검증에만 쓴다. */
  readonly declaredType?: string;
  readonly reference?: string;
};

/**
 * 정규화 결과. `source` 와 `semantic` 이 구조적으로 분리되어 있어
 * Consumer brand 값이 실수로 public 토큰이 되는 경로가 없다.
 */
export type NormalizedExtension = {
  readonly name: string;
  readonly source: readonly NormalizedSourceToken[];
  readonly semantic: readonly NormalizedOverride[];
};

/** 중첩 brand 그룹을 dot-path 토큰 목록으로 평탄화. */
const flattenSource = (
  group: BrandGroup,
  prefix: readonly string[] = [],
): NormalizedSourceToken[] => {
  const out: NormalizedSourceToken[] = [];

  for (const [key, node] of Object.entries(group)) {
    const path = [...prefix, key];

    if (isTokenObject(node)) {
      const value = node.$value as string | number;
      out.push({
        path: path.join('.'),
        value,
        type: (node.$type as 'color' | 'dimension') ?? inferType(value),
        ...withReference(value),
      });
      continue;
    }

    if (isGroup(node)) {
      out.push(...flattenSource(node, path));
      continue;
    }

    const value = node as string | number;
    out.push({ path: path.join('.'), value, type: inferType(value), ...withReference(value) });
  }

  return out;
};

/** alias면 `reference` 필드를 붙이고 아니면 아무것도 붙이지 않는다. */
const withReference = (value: unknown): { reference?: string } => {
  const target = referenceTarget(value);
  return target ? { reference: target } : {};
};

/** 한 mode 분량의 semantic override를 평탄화. */
const flattenOverrides = (
  overrides: Record<string, unknown>,
  mode: ThemeName | undefined,
): NormalizedOverride[] =>
  Object.entries(overrides).map(([path, raw]) => {
    const explicit = isTokenObject(raw);
    const value = (explicit ? raw.$value : raw) as string | number;
    const declaredType = explicit ? (raw.$type as string | undefined) : undefined;

    return {
      path,
      ...(mode ? { mode } : {}),
      value,
      type:
        declaredType === 'color' || declaredType === 'dimension' ? declaredType : inferType(value),
      ...(declaredType ? { declaredType } : {}),
      ...withReference(value),
    };
  });

/** 결정적 정렬 — mode(base 우선) 그다음 path. */
const byModeThenPath = (a: NormalizedOverride, b: NormalizedOverride): number =>
  (a.mode ?? '').localeCompare(b.mode ?? '') || a.path.localeCompare(b.path);

/**
 * authoring 정의를 canonical 표현으로 변환한다.
 * 순서는 결정적이라 같은 입력은 항상 같은 결과를 준다.
 */
export const normalizeExtension = (definition: TokenExtension): NormalizedExtension => {
  const source = flattenSource(definition.source ?? {}).sort((a, b) =>
    a.path.localeCompare(b.path),
  );

  const semantic = [
    ...flattenOverrides((definition.semantic ?? {}) as Record<string, unknown>, undefined),
    ...Object.entries(definition.modes ?? {}).flatMap(([mode, overrides]) =>
      flattenOverrides((overrides ?? {}) as Record<string, unknown>, mode as ThemeName),
    ),
  ].sort(byModeThenPath);

  return { name: definition.name, source, semantic };
};
