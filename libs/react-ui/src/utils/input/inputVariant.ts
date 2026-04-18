import { PlainInput } from '../../components/plain-input';
import { FilledInput } from '../../components/filled-input';
import { BoxedInput } from '../../components/boxed-input';
import type { FieldVariant } from '../../types';

const variantComponent = {
  plain: PlainInput,
  filled: FilledInput,
  boxed: BoxedInput,
} as const;

/**
 * TextField variant에 대응하는 입력 컴포넌트를 반환합니다.
 *
 * @param variant 입력 필드 variant
 * @returns variant에 대응하는 입력 컴포넌트
 */
export const getTextFieldInputComponent = (variant: FieldVariant) => {
  return variantComponent[variant];
};
