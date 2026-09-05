import { describe, expect, it } from 'vitest';

import { NAV, titleFor } from './nav';

describe('정보 구조', () => {
  it('그룹은 작업 단위로 나뉜다', () => {
    expect(NAV.map((g) => g.label)).toEqual([null, '검증', 'Foundation', '컴포넌트']);
  });

  it('모든 경로가 유일하다', () => {
    const paths = NAV.flatMap((g) => g.items.map((i) => i.path));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('현재 경로의 페이지 이름을 찾는다', () => {
    expect(titleFor('/')).toBe('개요');
    expect(titleFor('/verify')).toBe('Runtime');
    expect(titleFor('/verify/profile')).toBe('Consumer Profile');
    expect(titleFor('/components/button')).toBe('Button');
  });

  it('알 수 없는 경로는 개요로 떨어진다', () => {
    expect(titleFor('/nope')).toBe('개요');
  });

  it('상위 경로는 정확히 일치할 때만 active 다', () => {
    // `/verify` 는 `/verify/profile` 의 접두사라, end 가 없으면 하위 페이지에서 둘 다 켜진다.
    const item = (path: string) => NAV.flatMap((g) => g.items).find((i) => i.path === path);
    expect(item('/verify')?.end).toBe(true);
    expect(item('/')?.end).toBe(true);
  });

  it('하위 경로가 없는 항목은 접두사 매칭을 허용한다', () => {
    const item = (path: string) => NAV.flatMap((g) => g.items).find((i) => i.path === path);
    expect(item('/tokens')?.end).toBe(false);
    expect(item('/verify/profile')?.end).toBe(false);
  });
});
