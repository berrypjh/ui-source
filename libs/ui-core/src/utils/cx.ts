type CxArg =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, boolean | undefined | null>;

/**
 * cx: 조건부 className 결합 유틸
 *
 * @param {...CxArg[]} args
 *  결합할 클래스 인자들.
 *  - `string | number`: 그대로 class로 추가 (trim 후 비어있으면 제외)
 *  - `false | null | undefined`: 무시
 *  - `Record<string, boolean | null | undefined>`: 값이 truthy인 key만 추가
 *
 * @returns {string}
 *  공백으로 결합된 className 문자열.
 */
export const cx = (...args: CxArg[]): string => {
  const out: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === 'string' || typeof arg === 'number') {
      const s = String(arg).trim();
      if (s) out.push(s);
      continue;
    }

    if (typeof arg === 'object') {
      for (const [key, val] of Object.entries(arg)) {
        if (val) out.push(key);
      }
    }
  }

  return out.join(' ');
};
