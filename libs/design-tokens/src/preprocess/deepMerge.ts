type PlainObject = Record<string, any>;

const isPlainObject = (v: unknown): v is PlainObject => {
  return !!v && typeof v === 'object' && !Array.isArray(v);
};

const isTokenLeaf = (v: unknown): v is { value?: unknown; $value?: unknown } => {
  return isPlainObject(v) && ('value' in v || '$value' in v);
};

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
