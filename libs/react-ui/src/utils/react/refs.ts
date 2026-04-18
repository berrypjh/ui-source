/**
 * 전달받은 ref에 value를 할당합니다.
 *
 * 함수형 ref와 object ref를 모두 지원합니다.
 *
 * @param ref 할당할 ref
 * @param value ref에 연결할 값
 */
export const assignRef = (ref: unknown, value: unknown) => {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref && typeof ref === 'object' && 'current' in ref) {
    ref.current = value;
  }
};
