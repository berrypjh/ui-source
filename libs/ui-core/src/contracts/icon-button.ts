import type { ButtonColor, ButtonSize } from './button';

export type IconButtonEdge = 'start' | 'end' | false;

export interface IconButtonProps {
  color?: ButtonColor;
  size?: ButtonSize;
  edge?: IconButtonEdge;

  disabled?: boolean;
}
