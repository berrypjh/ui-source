import type { Transform, TransformedToken } from 'style-dictionary/types';

const FONT_WEIGHT_NAME_TO_NUMBER_MAP: Record<string, string> = {
  thin: '100',
  extralight: '200',
  ultralight: '200',
  light: '300',
  regular: '400',
  normal: '400',
  medium: '500',
  semibold: '600',
  demibold: '600',
  bold: '700',
  extrabold: '800',
  ultrabold: '800',
  black: '900',
};

/**
 * font weight 문자열을 매핑 키로 쓰기 좋게 정규화합니다.
 *
 * 예:
 * - `Semi Bold` → `semibold`
 * - `extra-bold` → `extrabold`
 * - `ultra_light` → `ultralight`
 *
 * @param inputText 원본 폰트 웨이트 문자열
 * @returns 정규화된 키 문자열
 */
const normalizeFontWeightKey = (inputText: string): string => {
  return inputText.replace(/[\s_-]+/g, '').toLowerCase();
};

/**
 * Style Dictionary 토큰에서 "디자인 토큰 타입"을 최대한 안전하게 추출합니다.
 *
 * Tokens Studio / Style Dictionary 파이프라인에서 타입 필드가
 * `type`, `$type`, `original.type`, `original.$type` 등으로 분산될 수 있어
 * 우선순위대로 값을 찾아 반환합니다.
 *
 * @param designToken Style Dictionary의 변환된 토큰
 * @returns 토큰 타입 문자열(없으면 undefined)
 */
const getDesignTokenType = (designToken: TransformedToken): string | undefined => {
  return (designToken.type ??
    designToken.$type ??
    designToken.original?.type ??
    designToken.original?.$type) as string | undefined;
};

/**
 * Style Dictionary 커스텀 Transform: fontWeights 타입 토큰의 값이 문자열일 때, 이름 → 숫자(문자열)로 변환합니다.
 */
export const fontWeightNameToNumberTransform: Transform = {
  name: 'ds/fontWeight/name-to-number',
  type: 'value',
  transitive: true,

  filter: (designToken: TransformedToken) => {
    const tokenType = getDesignTokenType(designToken);
    return tokenType === 'fontWeights' && typeof designToken.value === 'string';
  },

  transform: (designToken: TransformedToken) => {
    const rawValue = String(designToken.value).trim();

    // 이미 숫자면 그대로
    if (/^\d{3}$/.test(rawValue)) return rawValue;

    const normalizedKey = normalizeFontWeightKey(rawValue);
    return FONT_WEIGHT_NAME_TO_NUMBER_MAP[normalizedKey] ?? rawValue; // 매핑 없으면 원본 유지
  },
};
