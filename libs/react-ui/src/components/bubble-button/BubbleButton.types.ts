import type { CSSProperties, ElementType, ReactNode } from 'react';

import type { ButtonBaseAutoAnchorProps, ButtonBaseProps } from '../button-base';

export type BubbleButtonOwnProps = {
  icon?: ReactNode;
  label: ReactNode;
  delay?: number;
};

export type BubbleButtonProps<C extends ElementType = 'button'> = Omit<
  ButtonBaseProps<C>,
  'children' | 'variant'
> &
  BubbleButtonOwnProps & {
    style?: CSSProperties;
  };

export type BubbleButtonAutoAnchorProps = Omit<ButtonBaseAutoAnchorProps, 'children' | 'variant'> &
  BubbleButtonOwnProps & {
    style?: CSSProperties;
  };

export type BubbleButtonRenderableProps =
  | BubbleButtonAutoAnchorProps
  | BubbleButtonProps<ElementType>;
