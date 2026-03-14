import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType } from 'react';

export type PropsOf<C extends ElementType> = ComponentPropsWithoutRef<C>;
export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];

type MergeProps<BaseProps, OverrideProps> = Omit<BaseProps, keyof OverrideProps> & OverrideProps;

export type PolymorphicComponentProps<
  C extends ElementType,
  OwnProps extends object = Record<string, never>,
> = MergeProps<
  PropsOf<C>,
  OwnProps & {
    component?: C;
  }
>;

export type PolymorphicComponentPropsWithRef<
  C extends ElementType,
  OwnProps extends object = Record<string, never>,
> = PolymorphicComponentProps<C, OwnProps> & {
  ref?: PolymorphicRef<C>;
};
