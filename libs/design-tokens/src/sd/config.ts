import path from 'node:path';
import { expandTypesMap, getTransforms } from '@tokens-studio/sd-transforms';
import type { ThemeName } from '../types';

/**
 * 배열에서 특정 값 목록을 제외한 새 배열을 반환합니다.
 *
 * @param arr 원본 배열
 * @param remove 제거할 값 목록
 * @returns `remove`에 포함되지 않은 원소들로 구성된 새 배열
 */
const without = (arr: string[], remove: string[]): string[] => {
  const set = new Set(remove);
  return arr.filter((x) => !set.has(x));
};

/**
 * 주어진 테마/입력 파일/출력 경로를 기반으로 Style Dictionary 설정 객체를 생성합니다.
 *
 * 이 설정은 Tokens Studio export(JSON)를 입력으로 받아,
 * 테마별로 아래 산출물을 생성하도록 플랫폼을 구성합니다:
 * - `css`: CSS Variables (`variables.css`)
 * - `json`: 평탄화된 토큰 목록(`tokens.json`)
 * - `web`: Web용 TypeScript 토큰(`tokens.ts`)
 * - `rn`: React Native용 TypeScript 토큰(`tokens.ts`)
 *
 * 테마 셀렉터 규칙
 * - global: `:root`
 * - dark: `[data-theme="dark"], .theme-dark`
 *
 * @param args 설정 생성 인자
 * @param args.theme 테마 이름(`global` | `dark`)
 * @param args.sourceFileAbs 입력 토큰 파일의 절대 경로
 * @param args.out 각 플랫폼별 buildPath(디렉터리 경로)
 * @param args.out.css CSS 산출물 디렉터리
 * @param args.out.json JSON 산출물 디렉터리
 * @param args.out.web Web(TS) 산출물 디렉터리
 * @param args.out.rn RN(TS) 산출물 디렉터리
 * @returns Style Dictionary `extend()`에 전달 가능한 설정 객체
 */
export const makeSdConfig = (args: {
  theme: ThemeName;
  sourceFileAbs: string;
  out: {
    css: string;
    json: string;
    web: string;
    rn: string;
  };
}) => {
  const themeSelector = args.theme === 'global' ? ':root' : '[data-theme="dark"], .theme-dark';

  const base = getTransforms({ platform: 'css' });
  const baseStrings = base.filter((t): t is string => typeof t === 'string');

  // name/* 제거 후 name/kebab 강제
  const baseNoName = baseStrings.filter((t) => !t.startsWith('name/'));
  const NAME = 'name/kebab' as const;

  // CSS용
  const cssTransforms = [...without(baseNoName, ['ts/color/css/hexrgba']), NAME];

  // Web TS용
  const webTsTransforms = [...cssTransforms];

  // RN용
  const rnTransforms = [
    ...without(baseNoName, ['ts/size/px', 'ts/size/css/letterspacing', 'ts/color/css/hexrgba']),
    'ds/rn/number',
    NAME,
  ];

  return {
    preprocessors: ['tokens-studio'],

    expand: {
      typesMap: expandTypesMap,
    },

    source: [args.sourceFileAbs],

    platforms: {
      css: {
        buildPath: `${args.out.css}${path.sep}`,
        transforms: ['ds/fontWeight/name-to-number', ...cssTransforms],
        files: [
          {
            destination: 'variables.css',
            format: 'ds/css/variables',
            options: {
              selector: themeSelector,
              prefix: 'ds',
              includeRgb: true,
            },
          },
        ],
      },

      json: {
        buildPath: `${args.out.json}${path.sep}`,
        transforms: ['ds/fontWeight/name-to-number', ...cssTransforms],
        files: [
          {
            destination: 'tokens.json',
            format: 'ds/json/flat-tokens',
            options: {
              prefix: 'ds',
            },
          },
        ],
      },

      web: {
        buildPath: `${args.out.web}${path.sep}`,
        transforms: ['ds/fontWeight/name-to-number', ...webTsTransforms],
        files: [
          {
            destination: 'tokens.ts',
            format: 'ds/ts/theme-tokens',
            options: {
              theme: args.theme,
            },
          },
        ],
      },

      rn: {
        buildPath: `${args.out.rn}${path.sep}`,
        transforms: ['ds/fontWeight/name-to-number', ...rnTransforms],
        files: [
          {
            destination: 'tokens.ts',
            format: 'ds/ts/theme-tokens',
            options: {
              theme: args.theme,
            },
          },
        ],
      },
    },
  };
};
