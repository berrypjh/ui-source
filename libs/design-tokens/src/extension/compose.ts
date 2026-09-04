/**
 * Shared 그래프와 Consumer 정의를 합성한다.
 *
 * 우선순위: Shared base → Shared mode delta → Consumer base override → Consumer mode override.
 * 앞의 두 단계는 Style Dictionary가 테마별 사전을 만들 때 이미 적용해 두었으므로,
 * 여기서는 그 최종 값 위에 Consumer 값만 얹는다. 어떤 입력도 변형하지 않는다.
 */
import { publicContractEntries, resolveTokenContract } from '../lib/contract.js';
import { toRnNumeric, toWebRem } from '../lib/platformValue.js';
import type { ThemeBuild } from '../lib/sd.js';
import { classifyTokenPath, colorToRgbChannels } from '../lib/tokens.js';
import type { ThemeName } from '../themes.js';

import type { Diagnostic, Platform } from './diagnostics.js';
import { errors, sortDiagnostics } from './diagnostics.js';
import type { NormalizedExtension, NormalizedOverride } from './normalize.js';
import { normalizeExtension } from './normalize.js';
import { resolveValue, validateReferences } from './references.js';
import type { TokenExtension } from './types.js';
import { validateExtension } from './validate.js';

/** 한 테마·플랫폼의 최종 토큰 맵. canonical path -> 값. */
export type ComposedTokens = ReadonlyMap<string, unknown>;

export type ComposedTheme = {
  readonly theme: ThemeName;
  readonly selector: string;
  readonly web: ComposedTokens;
  readonly rn: ComposedTokens;
};

export type CompositionResult = {
  /** error 진단이 하나도 없으면 true. */
  readonly ok: boolean;
  readonly diagnostics: readonly Diagnostic[];
  /** `ok`가 false면 비어 있다. */
  readonly themes: readonly ComposedTheme[];
};

const PLATFORMS: readonly Platform[] = ['web', 'rn'];

/** Shared 사전을 canonical path -> 값 맵으로. */
const sharedMap = (build: ThemeBuild, platform: Platform): Map<string, unknown> => {
  const dict = platform === 'web' ? build.web : build.rn;
  const map = new Map<string, unknown>();
  for (const token of dict.allTokens) {
    map.set(classifyTokenPath(token.path).join('.'), token.$value);
  }
  return map;
};

/** contract 타입에 맞춰 authoring 값을 플랫폼 값으로 변환. */
const platformValue = (
  type: 'color' | 'dimension',
  value: unknown,
  platform: Platform,
): unknown => {
  if (type !== 'dimension') return value;
  return platform === 'web' ? toWebRem(value) : toRnNumeric(value);
};

/**
 * 해당 모드에서 적용될 Consumer override를 path -> override 로 정리한다.
 * base를 깔고 mode가 덮어쓴다.
 */
const overridesForMode = (
  normalized: NormalizedExtension,
  mode: ThemeName,
): Map<string, NormalizedOverride> => {
  const map = new Map<string, NormalizedOverride>();
  for (const scope of [undefined, mode]) {
    for (const override of normalized.semantic) {
      if (override.mode === scope) map.set(override.path, override);
    }
  }
  return map;
};

/**
 * Consumer private source의 모드 정책.
 * source는 모드에 독립적이다 — 모든 모드에서 같은 값으로 해소된다.
 * 모드별 브랜드 값은 source 키를 나누고 `modes`에서 각각 참조해 표현한다.
 */
const sourceMap = (normalized: NormalizedExtension): Map<string, unknown> =>
  new Map(normalized.source.map((t) => [t.path, t.value]));

/** 합성 결과가 플랫폼에서 실제로 쓸 수 있는 값인지 본다. */
const checkPlatform = (
  path: string,
  type: 'color' | 'dimension',
  value: unknown,
  platform: Platform,
  extension: string,
  mode: ThemeName,
): Diagnostic | undefined => {
  if (type === 'dimension' && platform === 'rn' && typeof toRnNumeric(value) !== 'number') {
    return {
      severity: 'error',
      code: 'platform-incompatible',
      extension,
      mode,
      path,
      platform,
      message: `"${path}" resolves to "${String(value)}", which React Native cannot use as a numeric dimension`,
    };
  }

  if (type === 'color' && platform === 'web' && colorToRgbChannels(value) === null) {
    return {
      severity: 'error',
      code: 'platform-incompatible',
      extension,
      mode,
      path,
      platform,
      message: `"${path}" resolves to "${String(value)}", from which the web build cannot derive --ds-*-rgb channels`,
    };
  }

  return undefined;
};

/** contract에 있으나 Shared 그래프에서 사라진 path — 제거된 토큰. */
const removedContractPaths = (sharedPaths: ReadonlySet<string>): Set<string> =>
  new Set(publicContractEntries.map((e) => e.path).filter((p) => !sharedPaths.has(p)));

/** deprecated 토큰을 겨냥한 override에 대한 경고. */
const deprecationWarnings = (
  normalized: NormalizedExtension,
  mode: ThemeName,
  paths: Iterable<string>,
): Diagnostic[] => {
  const out: Diagnostic[] = [];

  for (const path of paths) {
    const entry = publicContractEntries.find((e) => e.path === path);
    if (!entry?.deprecated) continue;

    out.push({
      severity: 'warning',
      code: 'deprecated-token',
      extension: normalized.name,
      mode,
      path,
      ...(entry.replacement ? { replacement: entry.replacement } : {}),
      message: entry.replacement
        ? `"${path}" is deprecated; use "${entry.replacement}" instead`
        : `"${path}" is deprecated`,
    });
  }

  return out;
};

/**
 * Consumer extension을 Shared 테마 사전 위에 합성한다.
 *
 * `builds`는 `buildThemeDictionaries`의 결과를 그대로 받는다 — DTCG 파싱과
 * Shared 참조 해소는 Style Dictionary가 한 것을 재사용한다.
 *
 * extension을 주지 않으면 Shared 기본값을 그대로 담은 결과를 돌려준다.
 */
export const composeExtension = (
  builds: readonly ThemeBuild[],
  extension?: TokenExtension,
): CompositionResult => {
  const normalized = extension
    ? normalizeExtension(extension)
    : { name: '', source: [], semantic: [] };

  const diagnostics: Diagnostic[] = extension
    ? validateExtension(extension, { checkReferences: false }).map((issue) => ({
        severity: 'error' as const,
        code: issue.code,
        extension: normalized.name,
        ...(issue.path ? { path: issue.path } : {}),
        message: issue.message,
      }))
    : [];

  const themes: ComposedTheme[] = [];
  const source = sourceMap(normalized);

  for (const build of builds) {
    const mode = build.theme as ThemeName;
    const web = sharedMap(build, 'web');
    const sharedPaths = new Set(web.keys());

    diagnostics.push(...validateReferences(normalized, mode, sharedPaths));

    const overrides = overridesForMode(normalized, mode);
    diagnostics.push(...deprecationWarnings(normalized, mode, overrides.keys()));

    const removed = removedContractPaths(sharedPaths);
    for (const path of overrides.keys()) {
      if (!removed.has(path)) continue;
      diagnostics.push({
        severity: 'error',
        code: 'removed-token',
        extension: normalized.name,
        mode,
        path,
        message: `"${path}" is declared in the public contract but no longer exists in the shared token graph`,
      });
    }

    const composed: Record<Platform, Map<string, unknown>> = {
      web,
      rn: sharedMap(build, 'rn'),
    };

    for (const platform of PLATFORMS) {
      const target = composed[platform];
      const shared = new Map(target);

      for (const [path, override] of overrides) {
        const type = resolveTokenContract(path, override.type).type;

        const resolved = resolveValue(
          path,
          (p) => (overrides.has(p) ? overrides.get(p)?.value : source.get(p)),
          (p) => shared.get(p),
        );

        if (resolved === undefined) continue; // 순환 — 이미 보고됨

        const value = platformValue(type, resolved, platform);
        const issue = checkPlatform(path, type, value, platform, normalized.name, mode);
        if (issue) diagnostics.push(issue);

        target.set(path, value);
      }

      // 합성 이후 완전성 — Shared가 주던 토큰이 사라지면 안 된다.
      for (const path of shared.keys()) {
        if (target.has(path)) continue;
        diagnostics.push({
          severity: 'error',
          code: 'incomplete-composition',
          extension: normalized.name,
          mode,
          path,
          platform,
          message: `"${path}" is missing from the composed model but exists in the shared graph`,
        });
      }
    }

    themes.push({
      theme: mode,
      selector: build.selector,
      web: composed.web,
      rn: composed.rn,
    });
  }

  const sorted = sortDiagnostics(diagnostics);
  const ok = errors(sorted).length === 0;

  return { ok, diagnostics: sorted, themes: ok ? themes : [] };
};
