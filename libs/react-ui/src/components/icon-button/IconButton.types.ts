import type { ElementType, ReactNode } from 'react';
import type { ButtonColor, ButtonSize } from '@berrypjh/ui-core';

import type { ButtonBaseAutoAnchorProps, ButtonBaseProps } from '../button-base';

export type IconButtonEdge = 'start' | 'end' | false;

export type IconButtonOwnProps = {
  children?: ReactNode;
  className?: string;
  size?: ButtonSize;
  color?: ButtonColor;
  edge?: IconButtonEdge;
  loading?: boolean | null;
  loadingIndicator?: ReactNode;
};

export type IconButtonProps<C extends ElementType = 'button'> = Omit<
  ButtonBaseProps<C>,
  'children' | 'size' | 'color'
> &
  IconButtonOwnProps;

export type IconButtonAutoAnchorProps = Omit<
  ButtonBaseAutoAnchorProps,
  'children' | 'size' | 'color'
> &
  IconButtonOwnProps;

export type IconButtonRenderableProps = IconButtonAutoAnchorProps | IconButtonProps<ElementType>;
