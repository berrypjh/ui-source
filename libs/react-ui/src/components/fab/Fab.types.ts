import type { ButtonColor, ButtonSize } from '@berrypjh/ui-core';

import type { ElementType, ReactNode } from 'react';

import type { ButtonBaseAutoAnchorProps, ButtonBaseProps } from '../button-base';

export type FabShape = 'circular' | 'extended';

export type FabOwnProps = {
  children?: ReactNode;
  className?: string;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: FabShape;
  icon?: ReactNode;
};

export type FabProps<C extends ElementType = 'button'> = Omit<
  ButtonBaseProps<C>,
  'children' | 'size' | 'color' | 'variant' | 'fullWidth'
> &
  FabOwnProps;

export type FabAutoAnchorProps = Omit<
  ButtonBaseAutoAnchorProps,
  'children' | 'size' | 'color' | 'variant' | 'fullWidth'
> &
  FabOwnProps;

export type FabRenderableProps = FabAutoAnchorProps | FabProps<ElementType>;
