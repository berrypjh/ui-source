// SCSS 모음. rollup-plugin-postcss가 extract하므로 JS 번들에는 남지 않음.
import './styles';

// 토큰/테마/유틸은 ui-core를 캡슐화해 직접 노출.
// 컴포넌트 prop 계약(BoxProps/ButtonProps/...)은 react-ui 자체 props에서 wrap되어 있어 제외.
export * from './components';
export * from './theme';
export type {
  ColorToken,
  RadiusToken,
  RNTokens,
  SpacingToken,
  Theme,
  ThemeDef,
  ThemeName,
} from '@berrypjh/ui-core';
export { createTheme, cx, getColor, Native, themes, Web } from '@berrypjh/ui-core';
