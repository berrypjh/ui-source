/**
 * 테마 selector에 Consumer scope를 씌운다.
 *
 * 기존 selector 의미를 그대로 두고 앞에만 붙이므로, Demo에서 Default와 Sample을
 * 한 페이지에 나란히 두고 비교할 수 있다. 여러 브랜드를 런타임에 바꾸는 장치가 아니다.
 */

/** `:root`는 scope 자체로, 나머지는 각 comma 부분 앞에 scope를 붙인다. */
export const scopeSelector = (selector: string, scope?: string): string => {
  if (!scope) return selector;

  return selector
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      return trimmed === ':root' ? scope : `${scope}${trimmed}`;
    })
    .join(', ');
};
