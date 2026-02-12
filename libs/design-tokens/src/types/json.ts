export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export type JsonObject = { [key: string]: JsonValue };

export const isJsonObject = (v: unknown): v is JsonObject => {
  return !!v && typeof v === 'object' && !Array.isArray(v);
};
