/**
 * 플랫폼별 dimension 값 변환. Style Dictionary에 의존하지 않는 순수 함수다.
 *
 * `sd.ts`의 transform과 Consumer compiler가 같은 구현을 쓴다. 여기 따로 둔 이유는
 * authoring/합성 경로가 Style Dictionary를 런타임에 끌어오지 않게 하기 위해서다 —
 * `sd.ts`는 import 시점에 SD transform을 등록한다.
 */

/** rem 변환 base. CSS 표준 16px. */
const REM_BASE_PX = 16;

/** 배열·객체가 아닌 평범한 record 객체인지 검사. */
const isPlainObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** 숫자 또는 숫자 문자열을 number로 변환. 단위가 붙어 있으면 null. */
export const toNumeric = (v: unknown): number | null => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

/** 부동소수점 표기에서 불필요한 trailing 0 제거. `0.1250000` → `0.125`. */
const stripTrailingZeros = (n: number): string => {
  const s = n.toFixed(6);
  return s.replace(/\.?0+$/, '');
};

/** 숫자/숫자 문자열을 number로 강제 변환. 객체·배열은 재귀 적용. 그 외는 원본. */
export const toRnNumeric = (v: unknown): unknown => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const s = v.trim();
    return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : v;
  }
  if (Array.isArray(v)) return v.map(toRnNumeric);
  if (isPlainObj(v)) {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) o[k] = toRnNumeric(x);
    return o;
  }
  return v;
};

/** dimension 값을 Web rem 문자열로 변환. 단위가 이미 붙어 있으면 그대로 둔다. */
export const toWebRem = (v: unknown): unknown => {
  const n = toNumeric(v);
  if (n === null) return v;
  return `${stripTrailingZeros(n / REM_BASE_PX)}rem`;
};
