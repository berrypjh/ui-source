import type { ButtonColor, ButtonSize } from './button';

export type FabShape = 'circular' | 'extended';

export interface FabProps {
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: FabShape;

  disabled?: boolean;
}
