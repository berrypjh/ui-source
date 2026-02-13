export type Primitive = string | number | boolean | null | undefined;

export type IsLeaf<T> = T extends Primitive
  ? true
  : T extends readonly any[]
    ? true
    : T extends Record<string, any>
      ? T[keyof T] extends Primitive
        ? true
        : false
      : true;

export type LeafDotPath<T> =
  IsLeaf<T> extends true
    ? never
    : {
        [K in keyof T & string]: IsLeaf<T[K]> extends true ? K : `${K}.${LeafDotPath<T[K]>}`;
      }[keyof T & string];

export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
