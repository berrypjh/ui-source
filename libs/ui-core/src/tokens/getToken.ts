import type { LeafDotPath, PathValue } from './path';

const readPath = (obj: unknown, path: string): unknown => {
  const parts = path.split('.');
  let cur: unknown = obj;

  for (const p of parts) {
    if (cur == null || (typeof cur !== 'object' && typeof cur !== 'function')) {
      throw new Error(`getToken: cannot read "${path}" (stuck at "${p}")`);
    }
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
};

export const getToken = <TObj, P extends LeafDotPath<TObj>>(
  obj: TObj,
  path: P,
): PathValue<TObj, P> => {
  return readPath(obj, path) as PathValue<TObj, P>;
};
