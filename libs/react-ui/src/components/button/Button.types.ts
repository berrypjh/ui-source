import type { ElementType, ReactNode } from 'react';

import type { ButtonBaseAutoAnchorProps, ButtonBaseProps } from '../button-base';

export type ButtonLoadingPosition = 'start' | 'center' | 'end';

export type ButtonExtraProps = {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  loadingIndicator?: ReactNode;
  loadingPosition?: ButtonLoadingPosition;
};

export type ButtonProps<C extends ElementType = 'button'> = ButtonBaseProps<C> & ButtonExtraProps;

export type ButtonAutoAnchorProps = ButtonBaseAutoAnchorProps & ButtonExtraProps;

export type ButtonRenderableProps = ButtonAutoAnchorProps | ButtonProps<ElementType>;
