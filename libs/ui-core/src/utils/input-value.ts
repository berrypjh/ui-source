/**
 * 입력값을 input 요소에서 사용할 문자열로 변환합니다.
 *
 * 배열 값은 빈 문자열로 변환하고,
 * null 또는 undefined도 빈 문자열로 변환합니다.
 *
 * @param value 변환할 원본 값
 * @returns input 요소에 넣을 문자열 값
 */
export const toInputString = (value: unknown): string => {
  if (Array.isArray(value)) {
    return '';
  }

  if (value == null) {
    return '';
  }

  return String(value);
};
