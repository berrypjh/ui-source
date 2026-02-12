import type { JsonObject } from './json.js';

export type TokenSet = JsonObject;

export type TokensStudioMetadata = {
  version?: string;
  updatedAt?: string;
  tokenSetOrder?: string[];
};

export type TokensStudioExport = {
  values: Record<string, TokenSet>;
  $metadata?: TokensStudioMetadata;
  $themes?: unknown[];
};
