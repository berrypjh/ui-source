import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';

import { ButtonBase } from './BaseButton';
import { createRenderer } from '../../test/createRenderer';

describe('<ButtonBase />', () => {
  const { render } = createRenderer();

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
