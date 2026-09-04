/**
 * Compiler가 수집하는 구조적 진단.
 *
 * 경고를 console에 흘리지 않고 결과에 실어 보내므로, 호출자가 모아서 보고하거나
 * CI에서 임계값을 걸 수 있다.
 */
import type { ThemeName } from '../themes.js';

export type DiagnosticSeverity = 'error' | 'warning';

export type Platform = 'web' | 'rn';

export type DiagnosticCode =
  // 구조
  | 'missing-name'
  // path / contract
  | 'unknown-path'
  | 'primitive-target'
  | 'non-overridable'
  | 'removed-token'
  | 'duplicate-path'
  // 타입
  | 'type-mismatch'
  | 'platform-incompatible'
  // 참조
  | 'unknown-reference'
  | 'primitive-reference'
  | 'dangling-reference'
  | 'reference-cycle'
  // 합성 이후
  | 'incomplete-composition'
  // 수명주기
  | 'deprecated-token';

export type Diagnostic = {
  readonly severity: DiagnosticSeverity;
  readonly code: DiagnosticCode;
  /** 문제를 일으킨 extension 이름. */
  readonly extension?: string;
  /** 문제가 발생한 테마/모드. 모든 모드 공통이면 생략. */
  readonly mode?: ThemeName;
  /** 문제가 된 canonical path. */
  readonly path?: string;
  /** 한쪽 플랫폼에서만 실패할 때의 플랫폼 이름. */
  readonly platform?: Platform;
  /** 순환 참조 체인. */
  readonly chain?: readonly string[];
  /** deprecated token의 대체 path. */
  readonly replacement?: string;
  readonly message: string;
};

/** 위치 정보를 사람이 읽는 접두사로. */
const locate = (d: Diagnostic): string => {
  const parts = [
    d.extension && `extension "${d.extension}"`,
    d.mode && `mode "${d.mode}"`,
    d.platform && `platform "${d.platform}"`,
  ].filter(Boolean);
  return parts.length ? `${parts.join(', ')}: ` : '';
};

/** 진단 하나를 한 줄 문자열로. */
export const formatDiagnostic = (d: Diagnostic): string =>
  `[${d.severity}] ${d.code} — ${locate(d)}${d.message}`;

export const errors = (ds: readonly Diagnostic[]): Diagnostic[] =>
  ds.filter((d) => d.severity === 'error');

export const warnings = (ds: readonly Diagnostic[]): Diagnostic[] =>
  ds.filter((d) => d.severity === 'warning');

/**
 * 진단을 결정적으로 정렬한다. severity → code → mode → path → platform.
 * 같은 입력이면 항상 같은 순서를 준다.
 */
export const sortDiagnostics = (ds: readonly Diagnostic[]): Diagnostic[] =>
  [...ds].sort(
    (a, b) =>
      a.severity.localeCompare(b.severity) ||
      a.code.localeCompare(b.code) ||
      (a.mode ?? '').localeCompare(b.mode ?? '') ||
      (a.path ?? '').localeCompare(b.path ?? '') ||
      (a.platform ?? '').localeCompare(b.platform ?? ''),
  );
