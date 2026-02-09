import type { Tokens } from '../tokens';

export type ThemeMode = 'light' | 'dark';

export interface Theme<T extends Tokens = Tokens> {
  mode: ThemeMode;
  tokens: T;
}
