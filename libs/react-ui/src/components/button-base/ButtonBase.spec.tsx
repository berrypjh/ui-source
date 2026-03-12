import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';

import { ButtonBase } from './ButtonBase';
import { createRenderer, describeConformance } from '../../../test';

const buttonBaseClasses = {
  root: 'ui-button',
} as const;

describe('<ButtonBase />', () => {
  const { render } = createRenderer();

  describeConformance(<ButtonBase>hello</ButtonBase>, () => ({
    render,
    classes: buttonBaseClasses,
    refInstanceof: HTMLButtonElement,
    polymorphicPropName: 'component',
    testPolymorphicPropWith: 'a',
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'rootClass', 'polymorphicProp'],
  }));

  it('기본 type은 button이다', () => {
    render(<ButtonBase>hello</ButtonBase>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('props를 다시 주입할 수 있다', () => {
    const { setProps } = render(<ButtonBase disabled={false}>hello</ButtonBase>);

    setProps({ disabled: true });

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
