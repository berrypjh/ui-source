/**
 * Consumer compiler 진입점.
 *
 * `buildThemeDictionaries`가 Style Dictionary를 사용하므로, 이 subpath를 쓰는 Consumer는
 * `style-dictionary`와 `@tokens-studio/sd-transforms`를 함께 설치해야 한다
 * (package.json의 optional peerDependencies).
 */
export * from './compiler/index.js';
