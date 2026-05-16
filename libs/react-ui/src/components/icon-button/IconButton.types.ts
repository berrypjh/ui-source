import type { IconButtonEdge, IconButtonProps as CoreIconButtonProps } from '@berrypjh/ui-core';

import type { ElementType, ReactNode } from 'react';

import type { ButtonBaseAutoAnchorProps, ButtonBaseProps } from '../button-base';

export type { IconButtonEdge };

export type IconButtonOwnProps = CoreIconButtonProps & {
  children?: ReactNode;
  className?: string;
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
