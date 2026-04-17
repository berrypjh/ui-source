/**
 * 주어진 값이 비어 있지 않은 유효한 값인지 판별합니다.
 *
 * 배열이면 길이가 1 이상일 때 유효한 값으로 간주합니다.
 * 그 외에는 `null`, `undefined`, 빈 문자열이 아니면 유효한 값으로 간주합니다.
 *
 * @param value 판별할 값
 * @returns 유효한 값이면 `true`, 아니면 `false`
 */
export const hasFormValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value != null && value !== '';
};
