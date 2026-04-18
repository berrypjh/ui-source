import type { ReactNode } from 'react';

/**
 * label 또는 helperText처럼 표시 여부를 판단할 ReactNode가
 * 비어 있지 않은지 확인합니다.
 *
 * @param value 표시 여부를 판단할 ReactNode
 * @returns 내용이 있으면 true, 없으면 false
 */
export const hasTextFieldContent = (value: ReactNode): boolean => {
  return value != null && value !== '';
};

/**
 * helper text가 있을 때 사용할 aria-describedby용 id를 생성합니다.
 *
 * @param params helper text id 생성에 필요한 값
 * @param params.hasHelperText helper text 존재 여부
 * @param params.id 기준이 되는 입력 요소 id
 * @returns helper text가 있으면 helper text id, 없으면 undefined
 */
export const getTextFieldHelperTextId = ({
  hasHelperText,
  id,
}: {
  hasHelperText: boolean;
  id: string;
}) => {
  return hasHelperText ? `${id}-helper-text` : undefined;
};
