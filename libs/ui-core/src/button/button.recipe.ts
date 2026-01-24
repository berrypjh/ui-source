import type { ButtonRecipe, ResolveButtonRecipeInput } from './button.types';

const sizeRecipe = (
  size: NonNullable<ResolveButtonRecipeInput['size']>,
): Omit<ButtonRecipe, 'bg' | 'fg' | 'border' | 'focusRing'> => {
  switch (size) {
    case 'sm':
      return {
        height: 32,
        paddingX: 'space.3',
        paddingY: 'space.2',
        radius: 'radius.2',
        gap: 'space.2',
        iconSize: 16,
        fontFamily: 'typography.fontFamily.base',
        fontWeight: 'typography.fontWeight.semibold',
        fontSize: 'typography.fontSize.2',
        lineHeight: 'typography.lineHeight.2',
        borderWidth: 1,
        focusRingWidth: 3,
      };

    case 'lg':
      return {
        height: 48,
        paddingX: 'space.4',
        paddingY: 'space.3',
        radius: 'radius.4',
        gap: 'space.3',
        iconSize: 20,
        fontFamily: 'typography.fontFamily.base',
        fontWeight: 'typography.fontWeight.semibold',
        fontSize: 'typography.fontSize.4',
        lineHeight: 'typography.lineHeight.4',
        borderWidth: 1,
        focusRingWidth: 3,
      };

    case 'md':
    default:
      return {
        height: 40,
        paddingX: 'space.3',
        paddingY: 'space.2',
        radius: 'radius.3',
        gap: 'space.2',
        iconSize: 18,
        fontFamily: 'typography.fontFamily.base',
        fontWeight: 'typography.fontWeight.semibold',
        fontSize: 'typography.fontSize.3',
        lineHeight: 'typography.lineHeight.3',
        borderWidth: 1,
        focusRingWidth: 3,
      };
  }
};

export const resolveButtonRecipe = (input: ResolveButtonRecipeInput = {}): ButtonRecipe => {
  const variant = input.variant ?? 'primary';
  const size = input.size ?? 'md';

  const sized = sizeRecipe(size);
  const radius = sized.radius;

  switch (variant) {
    case 'secondary':
      return {
        ...sized,
        radius,
        bg: {
          default: 'color.surface.0',
          hover: 'color.surface.50',
          pressed: 'color.surface.100',
          disabled: 'color.surface.100',
        },
        fg: { default: 'color.text.900', disabled: 'color.text.400' },
        border: {
          default: 'color.border.300',
          hover: 'color.border.400',
          disabled: 'color.border.200',
        },
        focusRing: 'color.overlay.brandFocus',
      };

    case 'primary':
    default:
      return {
        ...sized,
        radius,
        bg: {
          default: 'color.brand.600',
          hover: 'color.brand.700',
          pressed: 'color.brand.800',
          disabled: 'color.brand.600',
        },
        fg: { default: 'color.surface.0', disabled: 'color.surface.0' },
        border: {
          default: 'color.brand.600',
          hover: 'color.brand.700',
          disabled: 'color.brand.600',
        },
        focusRing: 'color.overlay.brandFocus',
      };
  }
};
