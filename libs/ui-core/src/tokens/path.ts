type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type TokenLeaf = { value: unknown; type?: unknown };

export type LeafDotPath<T> = T extends Primitive
  ? never
  : {
      [K in Extract<keyof T, string>]: T[K] extends TokenLeaf
        ? K
        : T[K] extends Primitive
          ? K
          : T[K] extends Record<string, unknown>
            ? `${K}.${LeafDotPath<T[K]>}`
            : K;
    }[Extract<keyof T, string>];

export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
