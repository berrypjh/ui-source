import type { FabProps as CoreFabProps, FabShape } from '@berrypjh/ui-core';

import type { ElementType, ReactNode } from 'react';

import type { ButtonBaseAutoAnchorProps, ButtonBaseProps } from '../button-base';

export type { FabShape };

export type FabOwnProps = CoreFabProps & {
  children?: ReactNode;
  className?: string;
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
