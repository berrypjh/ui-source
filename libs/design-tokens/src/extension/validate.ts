/**
 * Extension 정의의 런타임 검증.
 *
 * 타입이 잡아주는 것(오타난 path, 잘못된 `$type`)을 런타임에서도 확인해
 * JS 소비자와 동적으로 만들어진 정의까지 보호한다.
 * 전체 토큰 그래프 대조는 Command 04에서 한다 — 여기서는 contract와 extension 내부만 본다.
 */
import {
  isInternalPrimitive,
  isOverridable,
  isPublicPath,
  resolveTokenContract,
} from '../lib/contract.js';

import { normalizeExtension, referenceTarget } from './normalize.js';
import type { TokenExtension } from './types.js';

export type ExtensionIssueCode =
  | 'missing-name'
  | 'unknown-path'
  | 'primitive-target'
  | 'non-overridable'
  | 'type-mismatch'
  | 'unknown-reference'
  | 'primitive-reference'
  | 'duplicate-path';

export type ExtensionIssue = {
  readonly code: ExtensionIssueCode;
  /** 문제가 된 canonical path (`missing-name` 은 제외). */
  readonly path?: string;
  readonly message: string;
};

/** 값이 실제로 어떤 DTCG 타입인지. alias는 대상 타입을 따르므로 판정하지 않는다. */
const actualType = (value: unknown): 'color' | 'dimension' | undefined => {
  if (referenceTarget(value)) return undefined;
  if (typeof value === 'number') return 'dimension';
  if (typeof value !== 'string') return undefined;
  return value.startsWith('#') ? 'color' : 'dimension';
};

export type ValidateOptions = {
  /**
   * alias 대상까지 볼지 여부. 기본값 true.
   * composer는 모드별로 `validateReferences`가 더 정확한 진단을 내므로 false로 끈다.
   */
  readonly checkReferences?: boolean;
};

/**
 * 정의를 검증하고 문제 목록을 돌려준다. 빈 배열이면 통과다.
 * 던지지 않으므로 compiler가 모든 문제를 한 번에 모아 보고할 수 있다.
 */
export const validateExtension = (
  definition: TokenExtension,
  { checkReferences = true }: ValidateOptions = {},
): ExtensionIssue[] => {
  const issues: ExtensionIssue[] = [];
  const normalized = normalizeExtension(definition);

  if (!definition.name.trim()) {
    issues.push({ code: 'missing-name', message: 'extension name must not be empty' });
  }

  // extension 안에서 alias 대상이 될 수 있는 private source path.
  const sourcePaths = new Set(normalized.source.map((t) => t.path));

  /** alias 대상이 허용된 곳을 가리키는지 확인한다. */
  const checkReference = (from: string, target: string) => {
    if (!checkReferences) return;
    if (sourcePaths.has(target) || isOverridable(target)) return;

    if (isInternalPrimitive(target)) {
      issues.push({
        code: 'primitive-reference',
        path: from,
        message: `"${from}" references internal primitive "${target}"; primitives are not part of the public contract`,
      });
      return;
    }

    issues.push({
      code: 'unknown-reference',
      path: from,
      message: `"${from}" references "${target}", which is neither a public contract token nor a source token of this extension`,
    });
  };

  for (const token of normalized.source) {
    if (token.reference) checkReference(token.path, token.reference);
  }

  const seen = new Set<string>();

  for (const override of normalized.semantic) {
    const key = `${override.mode ?? '*'}:${override.path}`;
    if (seen.has(key)) {
      issues.push({
        code: 'duplicate-path',
        path: override.path,
        message: `"${override.path}" is overridden twice for ${override.mode ?? 'all modes'}`,
      });
    }
    seen.add(key);

    if (isInternalPrimitive(override.path)) {
      issues.push({
        code: 'primitive-target',
        path: override.path,
        message: `"${override.path}" is an internal primitive and cannot be overridden`,
      });
      continue;
    }

    if (!isOverridable(override.path)) {
      issues.push(
        isPublicPath(override.path)
          ? {
              code: 'non-overridable',
              path: override.path,
              message: `"${override.path}" is a public token but is not overridable`,
            }
          : {
              code: 'unknown-path',
              path: override.path,
              message: `"${override.path}" is not a public override contract path`,
            },
      );
      continue;
    }

    const expected = resolveTokenContract(override.path, override.type).type;

    if (override.declaredType && override.declaredType !== expected) {
      issues.push({
        code: 'type-mismatch',
        path: override.path,
        message: `"${override.path}" declares $type "${override.declaredType}" but the contract expects "${expected}"`,
      });
    }

    const actual = actualType(override.value);
    if (actual && actual !== expected) {
      issues.push({
        code: 'type-mismatch',
        path: override.path,
        message: `"${override.path}" expects a ${expected} value but received "${String(override.value)}"`,
      });
    }

    if (override.reference) checkReference(override.path, override.reference);
  }

  return issues;
};

/** 검증에 실패하면 모든 문제를 한 메시지로 묶어 던진다. */
export const assertValidExtension = (definition: TokenExtension): void => {
  const issues = validateExtension(definition);
  if (issues.length === 0) return;

  const detail = issues.map((i) => `  - [${i.code}] ${i.message}`).join('\n');
  throw new Error(`Invalid token extension "${definition.name}":\n${detail}`);
};
