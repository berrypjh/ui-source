/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from './getToken';

const tokens = {
  color: {
    primary: '#0000FF',
    neutral: '#888888',
  },
  spacing: {
    sm: '8px',
    md: '16px',
  },
};

describe('getToken', () => {
  it('단일 depth 경로에서 값을 읽는다', () => {
    expect(getToken(tokens, 'color' as any)).toBe(tokens.color);
  });

  it('leaf 값을 읽는다', () => {
    expect(getToken(tokens, 'color.primary')).toBe('#0000FF');
  });

  it('서로 다른 top-level 키를 구분해 읽는다', () => {
    expect(getToken(tokens, 'spacing.sm')).toBe('8px');
    expect(getToken(tokens, 'spacing.md')).toBe('16px');
  });

  it('존재하지 않는 경로는 undefined를 반환한다', () => {
    expect(getToken(tokens as any, 'color.unknown' as any)).toBeUndefined();
  });

  it('중간 노드가 null이면 에러를 던진다', () => {
    const obj = { a: null };
    expect(() => getToken(obj as any, 'a.b' as any)).toThrow('getToken');
  });

  it('중간 노드가 primitive이면 에러를 던진다', () => {
    const obj = { a: 42 };
    expect(() => getToken(obj as any, 'a.b' as any)).toThrow('getToken');
  });
});
