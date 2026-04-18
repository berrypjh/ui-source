import { isValidElement, type ReactNode } from 'react';

/**
 * ReactNode에서 사람이 읽을 수 있는 텍스트를 추출합니다.
 *
 * 문자열/숫자는 그대로 반환하고,
 * 배열과 ReactElement는 재귀적으로 순회해 텍스트를 합칩니다.
 *
 * @param node 텍스트를 추출할 노드
 * @returns 추출된 텍스트
 */
export const getNodeText = (node: ReactNode): string => {
  if (node == null || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((item) => getNodeText(item)).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }

  return '';
};
