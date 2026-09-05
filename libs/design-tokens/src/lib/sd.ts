import path from 'node:path';

import {
  expandTypesMap,
  getTransforms,
  register as registerTokensStudio,
} from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import type { Dictionary, Transform, TransformedToken } from 'style-dictionary/types';

import type { ThemeDef } from '../themes.js';

import { toRnNumeric, toWebDuration, toWebFontStack, toWebRem } from './platformValue.js';
import { getTokenType, getTokenValue } from './tokens.js';

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
  'duration',
]);

/**
 * Web rem 변환 대상 토큰 타입.
 * tokens-studio align-types preprocessor가 spacing/borderRadius/borderWidth를 `dimension`으로 정규화하므로
 * `dimension`을 포함시켜야 spacing/radius/border-width가 px → rem 변환된다.
 */
const WEB_REM_TYPES = new Set(['dimension', 'fontSize', 'lineHeight']);

/** RN용 숫자형 토큰(spacing/radius/fontSize 등) 값을 number로 변환하는 SD transform. */
const rnNumberTransform: Transform = {
  name: 'ds/rn/number',
  type: 'value',
  transitive: true,
  filter: (t) => {
    const type = getTokenType(t);
    return typeof type === 'string' && RN_NUMERIC_TYPES.has(type);
  },
  transform: (t: TransformedToken) => toRnNumeric(getTokenValue(t)),
};

/**
 * Web용 rem 변환 transform. spacing/fontSize/lineHeight 값을 px → rem으로 변환.
 * html font-size override에 반응하도록 unitless/px 값을 rem 기반으로 노출.
 */
const webRemTransform: Transform = {
  name: 'ds/web/rem',
  type: 'value',
  transitive: true,
  filter: (t) => {
    const type = getTokenType(t);
    return typeof type === 'string' && WEB_REM_TYPES.has(type);
  },
  transform: (t: TransformedToken) => toWebRem(getTokenValue(t)),
};

/** duration 토큰을 Web에서 `140ms` 형태로 노출하는 transform. */
const webDurationTransform: Transform = {
  name: 'ds/web/duration',
  type: 'value',
  transitive: true,
  filter: (t) => getTokenType(t) === 'duration',
  transform: (t: TransformedToken) => toWebDuration(getTokenValue(t)),
};

/** fontFamily 토큰을 Web에서 fallback 스택으로 노출하는 transform. */
const webFontFamilyTransform: Transform = {
  name: 'ds/web/fontFamily',
  type: 'value',
  transitive: true,
  filter: (t) => getTokenType(t) === 'fontFamily',
  transform: (t: TransformedToken) => toWebFontStack(getTokenValue(t)),
};

let registered = false;

/** Tokens Studio + 자체 transform을 SD에 1회만 등록. 중복 호출 안전. */
const registerOnce = () => {
  if (registered) return;
  registered = true;
  registerTokensStudio(StyleDictionary);
  StyleDictionary.registerTransform(rnNumberTransform);
  StyleDictionary.registerTransform(webRemTransform);
  StyleDictionary.registerTransform(webDurationTransform);
  StyleDictionary.registerTransform(webFontFamilyTransform);
};

/** `arr`에서 `rm`에 포함된 항목을 제거한 새 배열을 반환. */
const without = (arr: string[], rm: string[]) => {
  const set = new Set(rm);
  return arr.filter((x) => !set.has(x));
};

const baseTransforms = getTransforms({ platform: 'css' })
  .filter((t): t is string => typeof t === 'string')
  .filter((t) => !t.startsWith('name/'));

const WEB_TRANSFORMS = [
  ...without(baseTransforms, ['ts/color/css/hexrgba', 'ts/size/px']),
  'ds/web/rem',
  'ds/web/duration',
  'ds/web/fontFamily',
  'name/kebab',
];

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
