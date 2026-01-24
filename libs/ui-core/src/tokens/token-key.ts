export type TokenKey = string;

/** "color.brand.600" -> "--color-brand-600" */
export const toCssVarName = (key: TokenKey): string => {
  return `--${key.replace(/\./g, '-').replace(/_/g, '-')}`;
};

/** "color.brand.600" -> "var(--color-brand-600)" */
export const cssVar = (key: TokenKey): string => {
  return `var(${toCssVarName(key)})`;
};

/** dot-path 조회: tokens.color.brand['600'] 등 */
export const getTokenValue = (obj: any, key: TokenKey): any => {
  const parts = key.split('.');
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
};
