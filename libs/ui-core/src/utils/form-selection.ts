import { stringifyValue } from './form-value';
import { isObjectRecord } from './object';

/**
 * 두 값을 선택 비교용 기준으로 비교합니다.
 *
 * 객체는 참조 동일성으로 비교하고,
 * 원시값은 문자열로 정규화해서 비교합니다.
 *
 * @param optionValue 옵션 값
 * @param currentValue 현재 선택 값
 * @returns 두 값의 선택 동등 여부
 */
export const isValueEqual = (optionValue: unknown, currentValue: unknown): boolean => {
  if (isObjectRecord(optionValue) || isObjectRecord(currentValue)) {
    return optionValue === currentValue;
  }

  return stringifyValue(optionValue) === stringifyValue(currentValue);
};

/**
 * 특정 옵션이 현재 선택 상태인지 판별합니다.
 *
 * multiple 모드에서는 배열 내 포함 여부를 확인하고,
 * 단일 선택 모드에서는 단일 값과 비교합니다.
 *
 * @param optionValue 옵션 값
 * @param currentValue 현재 선택 값
 * @param multiple 다중 선택 여부
 * @returns 선택 여부
 */
export const isOptionSelected = (
  optionValue: unknown,
  currentValue: unknown,
  multiple: boolean,
): boolean => {
  if (multiple) {
    if (!Array.isArray(currentValue)) {
      return false;
    }

    return currentValue.some((item) => isValueEqual(optionValue, item));
  }

  return isValueEqual(optionValue, currentValue);
};
