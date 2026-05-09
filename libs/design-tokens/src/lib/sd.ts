import path from 'node:path';

import {
  expandTypesMap,
  getTransforms,
  register as registerTokensStudio,
} from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import type { Dictionary, Transform, TransformedToken } from 'style-dictionary/types';

import type { ThemeDef } from '../themes';

import { getTokenType, getTokenValue } from './tokens';

export type ThemeBuild = {
  theme: string;
  selector: string;
  web: Dictionary;
  rn: Dictionary;
};

const RN_NUMERIC_TYPES = new Set([
  'dimension',
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'fontWeight',
]);

/** 배열·객체가 아닌 평범한 record 객체인지 검사. */
const isPlainObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** 숫자/숫자 문자열을 number로 강제 변환. 객체·배열은 재귀 적용. 그 외는 원본. */
const coerceNum = (v: unknown): unknown => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const s = v.trim();
    return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : v;
  }
  if (Array.isArray(v)) return v.map(coerceNum);
  if (isPlainObj(v)) {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) o[k] = coerceNum(x);
    return o;
  }
  return v;
};

/** RN용 숫자형 토큰(spacing/radius/fontSize 등) 값을 number로 변환하는 SD transform. */
const rnNumberTransform: Transform = {
  name: 'ds/rn/number',
  type: 'value',
  transitive: true,
  filter: (t) => {
    const type = getTokenType(t);
    return typeof type === 'string' && RN_NUMERIC_TYPES.has(type);
  },
  transform: (t: TransformedToken) => coerceNum(getTokenValue(t)),
};

let registered = false;

/** Tokens Studio + 자체 transform을 SD에 1회만 등록. 중복 호출 안전. */
const registerOnce = () => {
  if (registered) return;
  registered = true;
  registerTokensStudio(StyleDictionary);
  StyleDictionary.registerTransform(rnNumberTransform);
};

/** `arr`에서 `rm`에 포함된 항목을 제거한 새 배열을 반환. */
const without = (arr: string[], rm: string[]) => {
  const set = new Set(rm);
  return arr.filter((x) => !set.has(x));
};

const baseTransforms = getTransforms({ platform: 'css' })
  .filter((t): t is string => typeof t === 'string')
  .filter((t) => !t.startsWith('name/'));

const WEB_TRANSFORMS = [...without(baseTransforms, ['ts/color/css/hexrgba']), 'name/kebab'];

const RN_TRANSFORMS = [
  ...without(baseTransforms, ['ts/size/px', 'ts/size/css/letterspacing', 'ts/color/css/hexrgba']),
  'ds/rn/number',
  'name/kebab',
];

/**
 * 테마별로 web/rn 두 사전을 in-memory로 빌드한다.
 * SD 파일 출력은 사용하지 않고 후속 generator가 사전을 직접 소비한다.
 */
export const buildThemeDictionaries = async (
  themes: readonly ThemeDef[],
  tokensDirAbs: string,
): Promise<ThemeBuild[]> => {
  registerOnce();

  const builds: ThemeBuild[] = [];
  for (const theme of themes) {
    const source = theme.sourceDirs.map((d) => path.join(tokensDirAbs, d, '*.json'));

    const sd = new StyleDictionary({
      log: { warnings: 'disabled', verbosity: 'silent' },
      preprocessors: ['tokens-studio'],
      expand: { typesMap: expandTypesMap },
      source,
      platforms: {
        web: { transforms: WEB_TRANSFORMS },
        rn: { transforms: RN_TRANSFORMS },
      },
    });

    builds.push({
      theme: theme.name,
      selector: theme.selector,
      web: await sd.getPlatformTokens('web'),
      rn: await sd.getPlatformTokens('rn'),
    });
  }
  return builds;
};
