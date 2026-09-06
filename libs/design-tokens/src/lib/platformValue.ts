/** rem 변환 base. CSS 표준 16px. */
const REM_BASE_PX = 16;

/** 배열·객체가 아닌 평범한 record 객체인지 검사. */
const isPlainObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** 숫자 또는 숫자 문자열을 number로 변환. 단위가 붙어 있으면 null. */
const toNumeric = (v: unknown): number | null => {
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

/** duration 값을 Web `ms` 문자열로 변환. 단위가 이미 붙어 있으면 그대로 둔다. */
export const toWebDuration = (v: unknown): unknown => {
  const n = toNumeric(v);
  return n === null ? v : `${n}ms`;
};

/**
 * Web fallback 서체. 웹폰트가 늦거나 실패해도 한글이 기본 명조로 떨어지지 않게 한다.
 * macOS / Windows 의 기본 한글 고딕을 차례로 두고 마지막에 generic 을 둔다.
 */
const WEB_FONT_FALLBACK = ["'Apple SD Gothic Neo'", "'Malgun Gothic'", 'system-ui', 'sans-serif'];

/**
 * fontFamily 값을 Web CSS 스택으로 변환.
 *
 * RN 은 등록된 서체 이름 하나만 받으므로 스택을 토큰 값에 넣을 수 없다. 그래서 이름은
 * 토큰에 하나만 두고, fallback 은 Web 출력에서만 붙인다.
 */
export const toWebFontStack = (v: unknown): unknown => {
  if (typeof v !== 'string' || v.trim() === '') return v;
  const name = v.trim();
  // 이미 스택이면 그대로 둔다. transitive transform 이라 composite 의 해석된 값에서 다시 돈다.
  if (name.includes(',')) return name;
  const primary = /^[A-Za-z][\w-]*$/.test(name) ? name : `'${name}'`;
  return [primary, ...WEB_FONT_FALLBACK].join(', ');
};

/** dimension 값을 Web rem 문자열로 변환. 단위가 이미 붙어 있으면 그대로 둔다. */
export const toWebRem = (v: unknown): unknown => {
  const n = toNumeric(v);
  if (n === null) return v;
  return `${stripTrailingZeros(n / REM_BASE_PX)}rem`;
};
