/**
 * Consumer 정의의 참조 그래프.
 *
 * alias 대상은 두 곳만 허용된다 — public contract token, 또는 같은 extension의 private source.
 * internal primitive 경유, dangling, 순환은 모두 진단으로 잡는다.
 *
 * Shared 토큰끼리의 참조는 Style Dictionary가 이미 해소했으므로 여기서 다시 풀지 않는다.
 * 이 그래프는 Consumer가 새로 들여온 간선만 다룬다.
 */
import { isInternalPrimitive, isOverridable } from '../lib/contract.js';
import type { ThemeName } from '../themes.js';

import type { Diagnostic } from './diagnostics.js';
import type { NormalizedExtension } from './normalize.js';
import { referenceTarget } from './normalize.js';

/** 한 모드에서 유효한 Consumer 간선: path -> alias 대상. */
export type ReferenceEdges = ReadonlyMap<string, string>;

/**
 * 한 모드 기준의 Consumer 참조 간선을 만든다.
 * mode override가 base override를 가린다 — 합성 우선순위와 같은 규칙이다.
 */
export const referenceEdgesForMode = (
  normalized: NormalizedExtension,
  mode: ThemeName,
): ReferenceEdges => {
  const edges = new Map<string, string>();

  for (const token of normalized.source) {
    if (token.reference) edges.set(token.path, token.reference);
  }

  // base(mode 없음) 먼저, 그다음 해당 mode가 덮어쓴다.
  for (const scope of [undefined, mode]) {
    for (const override of normalized.semantic) {
      if (override.mode !== scope) continue;
      if (override.reference) edges.set(override.path, override.reference);
      else edges.delete(override.path);
    }
  }

  return edges;
};

/** 해당 모드에서 Consumer가 값을 지정한 path 집합 (alias 여부 무관). */
const authoredPaths = (normalized: NormalizedExtension, mode: ThemeName): Set<string> => {
  const paths = new Set(normalized.source.map((t) => t.path));
  for (const override of normalized.semantic) {
    if (override.mode === undefined || override.mode === mode) paths.add(override.path);
  }
  return paths;
};

/**
 * alias 대상이 해소 가능한지 본다.
 * `sharedPaths`는 Shared 그래프에 실재하는 canonical path 집합이다.
 */
const classifyTarget = (
  target: string,
  authored: ReadonlySet<string>,
  sharedPaths: ReadonlySet<string>,
): 'ok' | 'primitive' | 'dangling' => {
  if (authored.has(target)) return 'ok';
  if (isInternalPrimitive(target)) return 'primitive';
  // public contract token은 Shared 그래프에 실재할 때만 해소된다.
  if (isOverridable(target) && sharedPaths.has(target)) return 'ok';
  return 'dangling';
};

/**
 * 한 모드의 참조를 검증한다.
 * 순환은 간선을 따라가며 찾고, 발견한 체인을 그대로 진단에 싣는다.
 */
export const validateReferences = (
  normalized: NormalizedExtension,
  mode: ThemeName,
  sharedPaths: ReadonlySet<string>,
): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];
  const edges = referenceEdgesForMode(normalized, mode);
  const authored = authoredPaths(normalized, mode);
  const extension = normalized.name;

  for (const [from, target] of edges) {
    const verdict = classifyTarget(target, authored, sharedPaths);

    if (verdict === 'primitive') {
      diagnostics.push({
        severity: 'error',
        code: 'primitive-reference',
        extension,
        mode,
        path: from,
        message: `"${from}" references internal primitive "${target}"; primitives are not part of the public contract`,
      });
    } else if (verdict === 'dangling') {
      diagnostics.push({
        severity: 'error',
        code: 'dangling-reference',
        extension,
        mode,
        path: from,
        message: `"${from}" references "${target}", which resolves to nothing`,
      });
    }
  }

  diagnostics.push(...detectCycles(edges, extension, mode));
  return diagnostics;
};

/** 간선을 따라가며 순환을 찾는다. 같은 순환은 한 번만 보고한다. */
const detectCycles = (edges: ReferenceEdges, extension: string, mode: ThemeName): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];
  const settled = new Set<string>();
  const reported = new Set<string>();

  for (const start of edges.keys()) {
    if (settled.has(start)) continue;

    const stack: string[] = [];
    const onStack = new Set<string>();
    let node: string | undefined = start;

    while (node !== undefined && !settled.has(node)) {
      if (onStack.has(node)) {
        const chain = [...stack.slice(stack.indexOf(node)), node];
        const key = [...chain].slice(0, -1).sort().join('|');

        if (!reported.has(key)) {
          reported.add(key);
          diagnostics.push({
            severity: 'error',
            code: 'reference-cycle',
            extension,
            mode,
            path: chain[0],
            chain,
            message: `reference cycle: ${chain.join(' -> ')}`,
          });
        }
        break;
      }

      stack.push(node);
      onStack.add(node);
      node = edges.get(node);
    }

    for (const visited of stack) settled.add(visited);
  }

  return diagnostics;
};

/**
 * alias 체인을 따라 최종 값을 얻는다.
 * `readAuthored`는 Consumer가 지정한 값을, `readShared`는 Shared 최종 값을 준다.
 * 순환은 이미 `validateReferences`가 걸러내므로 여기서는 방문 집합으로 방어만 한다.
 */
export const resolveValue = (
  path: string,
  readAuthored: (p: string) => unknown,
  readShared: (p: string) => unknown,
): unknown => {
  const seen = new Set<string>();
  let current = path;

  for (;;) {
    if (seen.has(current)) return undefined;
    seen.add(current);

    const authored = readAuthored(current);
    const value = authored === undefined ? readShared(current) : authored;
    const target = referenceTarget(value);

    if (target === undefined) return value;
    current = target;
  }
};
