/**
 * 컴파일 타임 타입 테스트.
 *
 * `tsc -p tsconfig.spec.json` 이 이 파일을 검사한다. `@ts-expect-error` 가 붙은 줄에서
 * 에러가 사라지면 "Unused '@ts-expect-error' directive" 로 typecheck가 실패하므로,
 * 별도 type-test 러너 없이 authoring 타입의 negative case를 고정할 수 있다.
 *
 * 런타임 동작은 `extension.test.ts` 가 검증한다.
 */
import { defineTokenExtension } from './defineTokenExtension.js';

/* ── 통과해야 하는 정의 ─────────────────────────────────────────── */

export const minimal = defineTokenExtension({ name: 'minimal' });

export const brandOnly = defineTokenExtension({
  name: 'brand-only',
  source: { brand: { primary: '#5B21B6', spacingUnit: 4 } },
});

export const full = defineTokenExtension({
  name: 'full',
  source: {
    brand: {
      primary: '#5B21B6',
      primaryDark: '#4C1D95',
      ink: { strong: '#111827', muted: '#6B7280' },
    },
  },
  semantic: {
    'color.background.primary': '{brand.primary}',
    'color.text.default': '{brand.ink.strong}',
    'color.text.link': '#2563EB',
    'borderWidth.semantic.focus': 3,
    'border.primary.width': '2px',
  },
  modes: {
    dark: { 'color.background.primary': '{brand.primaryDark}' },
    sepia: { 'color.text.default': '{brand.ink.muted}' },
  },
});

/** DTCG 명시 형태 — `$type` 이 contract와 일치하면 통과한다. */
export const explicitType = defineTokenExtension({
  name: 'explicit-type',
  semantic: {
    'color.text.default': { $value: '#111827', $type: 'color' },
    'borderWidth.semantic.focus': { $value: 2, $type: 'dimension' },
  },
});

/* ── 컴파일 에러여야 하는 정의 ──────────────────────────────────── */

export const rejectsUnknownPath = defineTokenExtension({
  name: 'unknown-path',
  // @ts-expect-error contract에 없는 path
  semantic: { 'color.text.doesNotExist': '#FFFFFF' },
});

export const rejectsPrimitiveTarget = defineTokenExtension({
  name: 'primitive-target',
  // @ts-expect-error internal primitive는 override 대상이 아니다
  semantic: { 'color.primary.pr700': '#FFFFFF' },
});

export const rejectsRawScaleTarget = defineTokenExtension({
  name: 'raw-scale-target',
  // @ts-expect-error spacing 은 v1 public 표면이 아니다
  semantic: { 'spacing.md': 8 },
});

export const rejectsLocalRuntimeToken = defineTokenExtension({
  name: 'local-runtime-token',
  // @ts-expect-error 컴포넌트 local `--ui-*` 토큰은 contract 밖이다
  semantic: { 'ui.btn.bg': '#FFFFFF' },
});

export const rejectsWrongExplicitType = defineTokenExtension({
  name: 'wrong-explicit-type',
  // @ts-expect-error color path 에 dimension $type
  semantic: { 'color.text.default': { $value: '#111827', $type: 'dimension' } },
});

export const rejectsColorValueOnDimensionPath = defineTokenExtension({
  name: 'color-on-dimension',
  // @ts-expect-error dimension path 에 hex 값
  semantic: { 'borderWidth.semantic.focus': '#111827' },
});

export const rejectsNumberOnColorPath = defineTokenExtension({
  name: 'number-on-color',
  // @ts-expect-error color path 에 숫자 값
  semantic: { 'color.text.default': 12 },
});

export const rejectsUnknownMode = defineTokenExtension({
  name: 'unknown-mode',
  // @ts-expect-error 등록되지 않은 테마 이름
  modes: { midnight: { 'color.text.default': '#FFFFFF' } },
});

export const rejectsUnknownPathInMode = defineTokenExtension({
  name: 'unknown-path-in-mode',
  // @ts-expect-error mode 안에서도 contract path만 허용된다
  modes: { dark: { 'color.text.nope': '#FFFFFF' } },
});

/* ── readonly 보장 ──────────────────────────────────────────────── */

export const readonlyShape = () => {
  // @ts-expect-error 정의는 readonly 다
  full.name = 'renamed';
  // @ts-expect-error semantic override는 readonly 다
  full.semantic['color.text.link'] = '#000000';
};
