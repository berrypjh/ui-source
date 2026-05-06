import fs from 'node:fs/promises';
import path from 'node:path';

type FlatToken = {
  path: string[];
  pathString: string;
  type: string;
  value: unknown;
  cssVar: string;
  cssVarRgb: string;
};

/**
 * 객체에 깊은 경로로 값을 설정한다.
 *
 * @param obj 대상 객체
 * @param pathArr 설정할 경로(배열)
 * @param value 설정할 값
 */
const setDeep = (obj: Record<string, unknown>, pathArr: string[], value: unknown) => {
  if (pathArr.length === 0) return;

  let cur: Record<string, unknown> = obj;

  for (let i = 0; i < pathArr.length - 1; i++) {
    const k = pathArr[i];
    if (k == null) return;

    cur[k] ??= {};
    cur = cur[k];
  }

  const last = pathArr[pathArr.length - 1];
  if (last == null) return;

  cur[last] = value;
};

/**
 * Tailwind의 alpha 패턴을 만족하는 color 값 문자열을 생성한다.
 *
 * @param rgbVar RGB CSS 변수명(예: `--color-primary-500-rgb`)
 * @returns Tailwind alpha 호환 color 문자열
 */
const twColorFromRgbVar = (rgbVar: string) => {
  // Tailwind alpha 패턴: rgb(var(--x) / <alpha-value>)
  return `rgb(var(${rgbVar}) / <alpha-value>)`;
};

/**
 * Tailwind preset에서 사용할 CSS 변수 참조 문자열을 만든다.
 *
 * @param cssVar CSS 변수명(예: `--spacing-4`)
 * @returns `var(--spacing-4)` 형태의 문자열
 */
const twVar = (cssVar: string) => `var(${cssVar})`;

/**
 * 토큰 경로의 theme prefix를 제거한다.
 *
 * @param pathArr 원본 토큰 경로
 * @returns theme prefix가 제거된 경로
 */
const stripThemePrefix = (pathArr: string[]) => {
  if (pathArr.length === 0) return pathArr;
  const first = pathArr[0];
  if (first === 'global' || first === 'dark') return pathArr.slice(1);
  return pathArr;
};

/**
 * FlatToken의 경로를 normalize 한다.
 *
 * @param t 원본 flat token
 * @returns theme prefix가 정규화된 flat token
 */
const normalizeToken = (t: FlatToken): FlatToken => {
  const p = stripThemePrefix(t.path);
  return {
    ...t,
    path: p,
    pathString: p.join('.'),
  };
};

/**
 * 객체를 `as const`로 고정한 TS const 선언 문자열로 만든다.
 *
 * @param name const 변수명
 * @param obj 직렬화할 객체
 * @returns `const name = {...} as const;` 형태의 TS 코드 문자열
 */
const toTsConst = (name: string, obj: unknown) => {
  return `const ${name} = ${JSON.stringify(obj, null, 2)} as const;\n`;
};

/**
 * Style Dictionary 결과(JSON flat tokens)를 기반으로 Tailwind preset 파일을 생성한다.
 *
 * @param args 생성 옵션
 * @param args.distJsonDirAbs `global/`, `dark/` 하위에 tokens.json이 있는 디렉토리 절대경로
 * @param args.outFileAbs 생성될 preset TS 파일의 절대경로
 */
export const generateTailwindPreset = async (args: {
  distJsonDirAbs: string;
  outFileAbs: string;
}) => {
  const globalJson = path.join(args.distJsonDirAbs, 'global', 'tokens.json');
  const darkJson = path.join(args.distJsonDirAbs, 'dark', 'tokens.json');

  const globalTokensRaw: FlatToken[] = JSON.parse(await fs.readFile(globalJson, 'utf8'));
  const darkTokensRaw: FlatToken[] = JSON.parse(await fs.readFile(darkJson, 'utf8'));

  const globalTokens = globalTokensRaw.map(normalizeToken);
  const darkTokens = darkTokensRaw.map(normalizeToken);

  // union: dark가 global full set 기반이므로 dark를 우선으로 사용
  const byPath = new Map<string, FlatToken>();
  for (const t of globalTokens) byPath.set(t.pathString, t);
  for (const t of darkTokens) byPath.set(t.pathString, t);

  const all = [...byPath.values()];

  const flatKey = (pathArr: string[], dropFirst = false) => {
    const p = dropFirst ? pathArr.slice(1) : pathArr;
    return p.join('-');
  };

  const spacing: Record<string, string> = {};
  const borderRadius: Record<string, string> = {};
  const borderWidth: Record<string, string> = {};
  const boxShadow: Record<string, string> = {};
  const fontFamily: Record<string, string> = {};
  const fontWeight: Record<string, string> = {};
  const fontSize: Record<string, string> = {};
  const lineHeight: Record<string, string> = {};
  const letterSpacing: Record<string, string> = {};

  // colors만 중첩 허용(테일윈드는 colors 중첩을 잘 처리함)
  const colors: Record<string, unknown> = {};

  for (const t of all) {
    const p = t.path; // 이미 theme prefix strip 됨

    switch (t.type) {
      case 'color': {
        setDeep(colors, p, twColorFromRgbVar(t.cssVarRgb));
        break;
      }

      case 'spacing': {
        if (p[0] !== 'spacing') break;
        spacing[flatKey(p, true)] = twVar(t.cssVar);
        break;
      }

      case 'borderRadius': {
        if (p[0] !== 'radius') break;
        borderRadius[flatKey(p, true)] = twVar(t.cssVar);
        break;
      }

      case 'borderWidth': {
        // primitiveBorder.xs / semanticBorder.default ... 충돌 방지 위해 prefix 유지
        borderWidth[flatKey(p, false)] = twVar(t.cssVar);
        break;
      }

      case 'boxShadow': {
        // shadow.xs / elevation.1 ... 둘 다 들어올 수 있어서 prefix 유지
        boxShadow[flatKey(p, false)] = twVar(t.cssVar);
        break;
      }

      case 'fontFamilies': {
        if (p[0] !== 'fontFamilies') break;
        fontFamily[flatKey(p, true)] = twVar(t.cssVar);
        break;
      }

      case 'fontWeights': {
        // Tokens Studio export에서 그룹명이 fontWeight 인 케이스를 고려
        if (p[0] !== 'fontWeight' && p[0] !== 'fontWeights') break;
        fontWeight[flatKey(p, true)] = twVar(t.cssVar);
        break;
      }

      case 'fontSizes': {
        if (p[0] !== 'fontSize' && p[0] !== 'fontSizes') break;
        fontSize[flatKey(p, true)] = twVar(t.cssVar);
        break;
      }

      case 'lineHeights': {
        if (p[0] !== 'lineHeight' && p[0] !== 'lineHeights') break;
        lineHeight[flatKey(p, true)] = twVar(t.cssVar);
        break;
      }

      case 'letterSpacing': {
        if (p[0] !== 'letterSpacing') break;
        letterSpacing[flatKey(p, true)] = twVar(t.cssVar);
        break;
      }
    }
  }

  const presetTs = `/* eslint-disable */
// AUTO-GENERATED Tailwind preset
// Uses CSS variables from your generated variables.css

import type { Config } from 'tailwindcss';

${toTsConst('colors', colors)}
${toTsConst('spacing', spacing)}
${toTsConst('borderRadius', borderRadius)}
${toTsConst('borderWidth', borderWidth)}
${toTsConst('boxShadow', boxShadow)}
${toTsConst('fontFamily', fontFamily)}
${toTsConst('fontWeight', fontWeight)}
${toTsConst('fontSize', fontSize)}
${toTsConst('lineHeight', lineHeight)}
${toTsConst('letterSpacing', letterSpacing)}

export const preset = {
  // preset은 보통 소비자 프로젝트에서 content를 정의하지만,
  // Tailwind 타입(RequiredConfig) 만족을 위해 빈 배열로 둡니다.
  content: [],
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius,
      borderWidth,
      boxShadow,
      fontFamily,
      fontWeight,
      fontSize,
      lineHeight,
      letterSpacing
    }
  }
} satisfies Config;

export default preset;
`;

  await fs.mkdir(path.dirname(args.outFileAbs), { recursive: true });
  await fs.writeFile(args.outFileAbs, presetTs, 'utf8');
};
