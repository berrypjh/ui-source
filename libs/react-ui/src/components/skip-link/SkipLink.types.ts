import type { ComponentPropsWithRef, ReactNode } from 'react';

export type SkipLinkOwnProps = {
  /** 포커스 이동 대상 element의 id (href는 `#{targetId}`로 구성). */
  targetId: string;
  children: ReactNode;
};

export type SkipLinkProps = Omit<ComponentPropsWithRef<'a'>, 'href' | 'children'> &
  SkipLinkOwnProps;
