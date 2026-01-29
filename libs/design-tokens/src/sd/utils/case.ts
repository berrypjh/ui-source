/**
 * 문자열을 kebab-case 형태로 변환합니다.
 *
 * @param inputText 변환할 원본 문자열
 * @returns kebab-case로 정규화된 문자열
 */
export const toKebabCase = (inputText: string): string => {
  return inputText
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};

/**
 * 토큰의 path(세그먼트 배열)를 기반으로 CSS 변수명을 생성합니다.
 *
 * @param variablePrefix CSS 변수 접두어(예: `"ds"`). 없으면(undefined) 접두어 없이 생성합니다.
 * @param tokenPathSegments 토큰 경로 세그먼트 배열(예: `["color", "primary", "pr500"]`)
 * @returns 생성된 CSS 변수명
 */
export const makeCssVariableName = (
  variablePrefix: string | undefined,
  tokenPathSegments: string[],
): string => {
  const kebabCasedPath = toKebabCase(tokenPathSegments.join('-'));
  return variablePrefix ? `--${variablePrefix}-${kebabCasedPath}` : `--${kebabCasedPath}`;
};
