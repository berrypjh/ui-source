import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export type PopoverProps = {
  children: ReactNode;
  /** controlled open state */
  open?: boolean;
  /** uncontrolled 초기값 */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type PopoverTriggerProps = {
  /** 단일 React element. 클릭 핸들러와 aria 속성이 자동 주입된다. */
  children: ReactElement;
};

export type PopoverPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** role="dialog"를 지정할지. false면 컨슈머가 role을 직접 설정. 기본 true. */
  asDialog?: boolean;
};
