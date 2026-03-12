import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';

import { ButtonBase, buttonBaseClasses } from './ButtonBase';
import { createRenderer, describeConformance } from '../../../test';

describe('<ButtonBase />', () => {
  const { render } = createRenderer();

  describeConformance(<ButtonBase>hello</ButtonBase>, () => ({
    render,
    classes: buttonBaseClasses,
    refInstanceof: HTMLButtonElement,
    polymorphicPropName: 'component',
    testPolymorphicPropWith: 'a',
  }));

  describe('root node', () => {
    it('기본 type은 button이다', () => {
      const { setProps } = render(<ButtonBase>hello</ButtonBase>);
      expect(screen.getByText('hello')).toHaveAttribute('type', 'button');

      setProps({ type: undefined });
      expect(screen.getByText('hello')).toHaveAttribute('type', 'button');
    });

    it('button의 type을 변경할 수 있다', () => {
      render(<ButtonBase type="submit">Hello</ButtonBase>);
      expect(screen.getByText('Hello')).toHaveAttribute('type', 'submit');
    });

    it('type이 "button"이면 role="button"을 적용하지 않는다', () => {
      render(<ButtonBase type="button">Hello</ButtonBase>);
      expect(screen.getByText('Hello')).not.toHaveAttribute('role');
    });

    it('href가 제공되면 버튼을 자동으로 anchor 요소로 변경한다', () => {
      const { container } = render(<ButtonBase href="https://google.com">Hello</ButtonBase>);
      const button = container.firstChild;

      expect(button).toHaveProperty('nodeName', 'A');
      expect(button).not.toHaveAttribute('role');
      expect(button).not.toHaveAttribute('type');
      expect(button).toHaveAttribute('href', 'https://google.com');
    });

    it('href 없이 anchor를 사용하면 role="button"을 적용한다', () => {
      render(<ButtonBase component="a">Hello</ButtonBase>);
      const button = screen.getByRole('button');

      expect(button).toHaveProperty('nodeName', 'A');
      expect(button).not.toHaveAttribute('type');
    });

    it('props를 다시 주입할 수 있다', () => {
      const { setProps } = render(<ButtonBase disabled={false}>hello</ButtonBase>);

      setProps({ disabled: true });

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
