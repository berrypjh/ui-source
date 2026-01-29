type PlainObject = Record<string, any>;

/**
 * "순수 객체(Plain Object)"인지 판별합니다.
 * - null/undefined 제외
 * - typeof === "object"
 * - Array 제외
 *
 * @param v 검사할 값
 * @returns v가 PlainObject이면 true
 */
const isPlainObject = (v: unknown): v is PlainObject => {
  return !!v && typeof v === 'object' && !Array.isArray(v);
};

/**
 * Tokens Studio 스타일의 "토큰 leaf" 노드인지 판별합니다.
 * leaf는 보통 `{ value: ... }` 또는 `{ $value: ... }` 형태를 가집니다.
 *
 * @param v 검사할 값
 * @returns v가 토큰 leaf 형태이면 true
 */
const isTokenLeaf = (v: unknown): v is { value?: unknown; $value?: unknown } => {
  return isPlainObject(v) && ('value' in v || '$value' in v);
};

/**
 * 디자인 토큰 JSON을 "토큰 규칙"에 맞게 깊은 병합합니다.
 *
 * @param base 원본 토큰 객체
 * @param override 덮어쓸 토큰 객체
 * @returns 병합된 결과 토큰 객체
 */
export const deepMergeTokens = (base: any, override: any): any => {
  if (isTokenLeaf(base) || isTokenLeaf(override)) {
    return override ?? base;
  }

  if (Array.isArray(base) || Array.isArray(override)) {
    return override ?? base;
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override ?? base;
  }

  const out: PlainObject = { ...base };

  for (const [k, v] of Object.entries(override)) {
    out[k] = k in out ? deepMergeTokens(out[k], v) : v;
  }

  return out;
};
