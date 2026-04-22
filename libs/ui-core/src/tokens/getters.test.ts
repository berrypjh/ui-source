/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Theme, RNTokens } from './types';
import {
  getColor,
  getSpacing,
  getRadius,
  getBorderWidth,
  getBorder,
  getTypography,
  getShadow,
  getElevation,
  getComponent,
} from './getters';

const mockTheme = {
  mode: 'global',
  tokens: {
    color: { primary: '#0000FF' },
    spacing: { sm: 8 },
    radius: { md: 4 },
    borderWidth: { thin: 1 },
    border: { default: '1px solid black' },
    typography: { body: { fontSize: 16 } },
    shadow: { sm: '0 1px 2px rgba(0,0,0,0.1)' },
    elevation: { low: 1 },
    component: { button: { height: 40 } },
  },
} as unknown as Theme<RNTokens>;

describe('getters', () => {
  it('getColor은 tokens.color 그룹에서 값을 읽는다', () => {
    expect(getColor(mockTheme, 'primary' as any)).toBe('#0000FF');
  });

  it('getSpacing은 tokens.spacing 그룹에서 값을 읽는다', () => {
    expect(getSpacing(mockTheme, 'sm' as any)).toBe(8);
  });

  it('getRadius는 tokens.radius 그룹에서 값을 읽는다', () => {
    expect(getRadius(mockTheme, 'md' as any)).toBe(4);
  });

  it('getBorderWidth는 tokens.borderWidth 그룹에서 값을 읽는다', () => {
    expect(getBorderWidth(mockTheme, 'thin' as any)).toBe(1);
  });

  it('getBorder는 tokens.border 그룹에서 값을 읽는다', () => {
    expect(getBorder(mockTheme, 'default' as any)).toBe('1px solid black');
  });

  it('getTypography는 tokens.typography 그룹에서 값을 읽는다', () => {
    expect(getTypography(mockTheme, 'body' as any)).toEqual({ fontSize: 16 });
  });

  it('getShadow는 tokens.shadow 그룹에서 값을 읽는다', () => {
    expect(getShadow(mockTheme, 'sm' as any)).toBe('0 1px 2px rgba(0,0,0,0.1)');
  });

  it('getElevation은 tokens.elevation 그룹에서 값을 읽는다', () => {
    expect(getElevation(mockTheme, 'low' as any)).toBe(1);
  });

  it('getComponent는 tokens.component 그룹에서 값을 읽는다', () => {
    expect(getComponent(mockTheme, 'button' as any)).toEqual({ height: 40 });
  });
});
