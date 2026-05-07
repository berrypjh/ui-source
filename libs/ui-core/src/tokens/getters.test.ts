/* eslint-disable @typescript-eslint/no-explicit-any */
import { getColor } from './getters';
import type { RNTokens, Theme } from './types';

const mockTheme = {
  mode: 'light',
  tokens: {
    color: { primary: '#0000FF' },
  },
} as unknown as Theme<RNTokens>;

describe('getColor', () => {
  it('tokens.color 그룹에서 값을 읽는다', () => {
    expect(getColor(mockTheme, 'primary' as any)).toBe('#0000FF');
  });
});
