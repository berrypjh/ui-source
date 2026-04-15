import type { ComponentPropsWithRef, ElementType } from 'react';

type MergeProps<BaseProps, OverrideProps> = Omit<BaseProps, keyof OverrideProps> & OverrideProps;

export type PropsOf<C extends ElementType> = ComponentPropsWithRef<C>;

export type PolymorphicRef<C extends ElementType> = PropsOf<C>['ref'];

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
> = PolymorphicComponentProps<C, OwnProps>;
