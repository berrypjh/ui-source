import type { Transform, TransformedToken } from 'style-dictionary/types';

type ReactNativeNumericTokenType =
  | 'spacing'
  | 'borderRadius'
  | 'borderWidth'
  | 'fontSizes'
  | 'lineHeights'
  | 'letterSpacing'
  | 'dimension';

const REACT_NATIVE_NUMERIC_TOKEN_TYPES = new Set<ReactNativeNumericTokenType>([
  'spacing',
  'borderRadius',
  'borderWidth',
  'fontSizes',
  'lineHeights',
  'letterSpacing',
  'dimension',
]);

/**
 * 값이 "순수 객체(Plain Object)"인지 판별합니다.
 * - null/undefined 제외
 * - typeof === "object"
 * - Array 제외
 *
 * @param value 검사할 값
 * @returns value가 Record<string, unknown> 형태의 객체면 true
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value);
};

/**
 * 숫자처럼 보이는 값들(예를 들어 "12px", "12")을 재귀적으로 number로 강제 변환합니다.
 *
 * @param value 변환할 값
 * @returns 변환된 값(가능한 경우 number로 치환)
 */
const coerceNumberLikeValues = (value: unknown): unknown => {
  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();

    // "12px" → 12
    const pixelsMatch = trimmed.match(/^(-?\d+(\.\d+)?)px$/i);
    if (pixelsMatch) return Number(pixelsMatch[1]);

    // "12" → 12
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);

    return value;
  }

  if (Array.isArray(value)) {
    return value.map(coerceNumberLikeValues);
  }

  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      result[key] = coerceNumberLikeValues(nestedValue);
    }
    return result;
  }

  return value;
};

/**
 * Style Dictionary 토큰에서 "디자인 토큰 타입"을 최대한 안전하게 추출합니다.
 *
 * Tokens Studio / SD 파이프라인에서 타입 필드가
 * `type`, `$type`, `original.type`, `original.$type` 등으로 분산될 수 있어
 * 우선순위대로 값을 찾아 반환합니다.
 *
 * @param designToken 변환된 토큰
 * @returns 토큰 타입 문자열(없으면 undefined)
 */
const getDesignTokenType = (designToken: TransformedToken): string | undefined => {
  return (designToken.type ??
    designToken.$type ??
    designToken.original?.type ??
    designToken.original?.$type) as string | undefined;
};

/**
 * Style Dictionary 커스텀 Transform: React Native에서 숫자여야 하는 값들을 number로 변환합니다.
 */
export const reactNativeNumberTransform: Transform = {
  name: 'ds/rn/number',
  type: 'value',
  transitive: true,

  filter: (designToken: TransformedToken) => {
    const tokenType = getDesignTokenType(designToken);
    return (
      typeof tokenType === 'string' &&
      REACT_NATIVE_NUMERIC_TOKEN_TYPES.has(tokenType as ReactNativeNumericTokenType)
    );
  },

  transform: (designToken: TransformedToken) => coerceNumberLikeValues(designToken.value),
};
