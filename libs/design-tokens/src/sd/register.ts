import StyleDictionary from 'style-dictionary';
import { register as registerTokensStudio } from '@tokens-studio/sd-transforms';

import { dsCssVariablesFormat, tsThemeTokensFormat, jsonFlatTokensFormat } from './formats';
import { fontWeightNameToNumberTransform, reactNativeNumberTransform } from './transforms';

let done = false;

/**
 * Style Dictionary에 필요한 확장(Transforms/Formats)을 1회 등록합니다.
 */
export const registerAll = () => {
  if (done) return;
  done = true;

  // Tokens Studio 호환 등록
  registerTokensStudio(StyleDictionary);

  // 커스텀 transforms
  StyleDictionary.registerTransform(fontWeightNameToNumberTransform);
  StyleDictionary.registerTransform(reactNativeNumberTransform);

  // 커스텀 formats
  StyleDictionary.registerFormat(dsCssVariablesFormat);
  StyleDictionary.registerFormat(tsThemeTokensFormat);
  StyleDictionary.registerFormat(jsonFlatTokensFormat);
};
