import type { TokenExtension } from './types.js';

/**
 * Consumer extension 정의를 만든다.
 *
 * `const` 타입 파라미터가 리터럴 추론을 보존하므로 Consumer가 `as const` 를 붙이지 않아도
 * path와 값이 좁은 타입으로 남는다. 반환값은 얕게 freeze 되어 실수로 정의를 바꾸는 것을 막는다.
 *
 * 런타임 검증은 하지 않는다 — 컴파일 타임 타입이 authoring을 잡고,
 * `validateExtension` 이 compiler와 같은 정의를 소비한다.
 *
 * @example
 * const brand = defineTokenExtension({
 *   name: 'acme',
 *   source: { brand: { primary: '#5B21B6', primaryDark: '#4C1D95' } },
 *   semantic: { 'color.background.primary': '{brand.primary}' },
 *   modes: { dark: { 'color.background.primary': '{brand.primaryDark}' } },
 * });
 */
export const defineTokenExtension = <const T extends TokenExtension>(definition: T): Readonly<T> =>
  Object.freeze(definition);
