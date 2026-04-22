import { createTheme } from './theme';

const mockTokens = {
  color: { primary: { value: '#0000FF' } },
  spacing: { sm: { value: 8 } },
};

describe('createTheme', () => {
  it('mode와 tokens를 포함한 Theme 객체를 반환한다', () => {
    const theme = createTheme({ mode: 'global', tokens: mockTokens });
    expect(theme.mode).toBe('global');
    expect(theme.tokens).toBe(mockTokens);
  });

  it('dark mode를 지원한다', () => {
    const theme = createTheme({ mode: 'dark', tokens: mockTokens });
    expect(theme.mode).toBe('dark');
  });

  it('tokens 참조를 그대로 유지한다 (복사하지 않는다)', () => {
    const tokens = { color: {} };
    const theme = createTheme({ mode: 'global', tokens });
    expect(theme.tokens).toBe(tokens);
  });

  it('반환된 객체는 mode, tokens 두 개의 키만 가진다', () => {
    const theme = createTheme({ mode: 'global', tokens: mockTokens });
    expect(Object.keys(theme)).toEqual(['mode', 'tokens']);
  });
});
