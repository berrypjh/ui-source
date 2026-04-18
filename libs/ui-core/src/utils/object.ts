/**
 * 값이 null이 아닌 객체인지 판별합니다.
 *
 * 배열, Date, Map 등도 true가 될 수 있습니다.
 *
 * @param value 검사할 값
 * @returns null이 아닌 객체 여부
 */
export const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

/**
 * 값이 순수 객체(plain object)인지 판별합니다.
 *
 * 배열과 null은 제외합니다.
 * 일반적으로 object literal과 유사한 값을 판별할 때 사용합니다.
 *
 * @param value 검사할 값
 * @returns plain object 여부
 */
export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!isObjectRecord(value) || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
};
