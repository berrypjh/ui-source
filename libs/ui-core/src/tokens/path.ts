type AnyFn = (...args: unknown[]) => unknown;

type IsPlainObject<T> = T extends object
  ? T extends AnyFn
    ? false
    : T extends readonly unknown[]
      ? false
      : true
  : false;

export type LeafDotPath<T> =
  IsPlainObject<T> extends true
    ? {
        [K in keyof T & string]: IsPlainObject<T[K]> extends true ? `${K}.${LeafDotPath<T[K]>}` : K;
      }[keyof T & string]
    : never;

export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
