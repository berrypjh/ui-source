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

/**
 * 현재 값이 화면에 표시할 수 있는 값인지 판별합니다.
 *
 * multiple 모드에서는 비어 있지 않은 배열만 표시 가능한 값으로 봅니다.
 *
 * @param value 현재 값
 * @param multiple 다중 선택 여부
 * @returns 표시 가능한 값 여부
 */
export const hasDisplayValue = (value: unknown, multiple: boolean): boolean => {
  if (multiple) {
    return Array.isArray(value) && value.length > 0;
  }

  return value !== '' && value != null;
};

/**
 * 값을 비교 및 data attribute 용 문자열로 정규화합니다.
 *
 * 배열은 각 항목을 문자열로 변환한 뒤 쉼표로 연결합니다.
 *
 * @param value 문자열로 변환할 값
 * @returns 정규화된 문자열 값
 */
export const stringifyValue = (value: unknown): string => {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifyValue(item)).join(',');
  }

  return String(value);
};
