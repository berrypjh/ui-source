import * as React from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormHelperText } from './FormHelperText';
import { formHelperTextClasses } from './FormHelperText.constants';
import { FormControl } from '../form-control';
import { createRenderer, describeConformance } from '../../../test';

type VisualState = 'error' | 'disabled';

describe('<FormHelperText />', () => {
  const { render } = createRenderer();

  describeConformance(<FormHelperText />, () => ({
    render,
    classes: formHelperTextClasses,
    refInstanceof: HTMLParagraphElement,
    skip: ['polymorphicProp'],
  }));

  describe('rendering', () => {
    it('기본적으로 p 요소로 렌더링해야 한다', () => {
      render(<FormHelperText>Foo</FormHelperText>);

      const helperText = screen.getByText('Foo');

      expect(helperText.tagName.toLowerCase()).toBe('p');
      expect(helperText).toHaveClass(formHelperTextClasses.root);
    });

    it('기본적으로 sizeMd 클래스가 있어야 한다', () => {
      render(<FormHelperText data-testid="root">Foo</FormHelperText>);

      expect(screen.getByTestId('root')).toHaveClass(formHelperTextClasses.sizeMd);
    });

    it('className을 root에 병합해야 한다', () => {
      render(
        <FormHelperText data-testid="root" className="custom-helper-text">
          Foo
        </FormHelperText>,
      );

      const root = screen.getByTestId('root');

      expect(root).toHaveClass(formHelperTextClasses.root);
      expect(root).toHaveClass('custom-helper-text');
    });
  });

  describe('prop: error', () => {
    it('error 클래스가 있어야 한다', () => {
      const { container } = render(<FormHelperText error />);

      expect(container.firstElementChild).toHaveClass(formHelperTextClasses.error);
    });
  });

  describe('prop: disabled', () => {
    it('disabled 클래스가 있어야 한다', () => {
      const { container } = render(<FormHelperText disabled />);

      expect(container.firstElementChild).toHaveClass(formHelperTextClasses.disabled);
    });
  });

  describe('prop: size', () => {
    it('size="sm"이면 sizeSm 클래스가 있어야 한다', () => {
      render(
        <FormHelperText data-testid="root" size="sm">
          Foo
        </FormHelperText>,
      );

      expect(screen.getByTestId('root')).toHaveClass(formHelperTextClasses.sizeSm);
      expect(screen.getByTestId('root')).not.toHaveClass(formHelperTextClasses.sizeMd);
    });

    it('size="md"이면 sizeMd 클래스가 있어야 한다', () => {
      render(
        <FormHelperText data-testid="root" size="md">
          Foo
        </FormHelperText>,
      );

      expect(screen.getByTestId('root')).toHaveClass(formHelperTextClasses.sizeMd);
    });
  });

  describe('special placeholder behavior', () => {
    it("children이 단일 공백(' ')이면 zero-width placeholder를 렌더링해야 한다", () => {
      render(<FormHelperText data-testid="root"> </FormHelperText>);

      const root = screen.getByTestId('root');
      const placeholder = root.querySelector('span');

      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveAttribute('aria-hidden', 'true');
      expect(placeholder).toHaveTextContent('\u200B');
    });
  });

  describe('with FormControl', () => {
    (['error', 'disabled'] as const).forEach((visualState: VisualState) => {
      describe(visualState, () => {
        const FormHelperTextInFormControl = (
          props: React.ComponentProps<typeof FormHelperText>,
        ) => (
          <FormControl {...{ [visualState]: true }}>
            <FormHelperText {...props}>Foo</FormHelperText>
          </FormControl>
        );

        it(`${visualState} 클래스가 있어야 한다`, () => {
          render(<FormHelperTextInFormControl />);

          expect(screen.getByText('Foo')).toHaveClass(formHelperTextClasses[visualState]);
        });

        it('props로 override할 수 있어야 한다', () => {
          const { setProps } = render(
            <FormHelperTextInFormControl {...{ [visualState]: false }} />,
          );

          expect(screen.getByText('Foo')).not.toHaveClass(formHelperTextClasses[visualState]);

          setProps({ [visualState]: true });

          expect(screen.getByText('Foo')).toHaveClass(formHelperTextClasses[visualState]);
        });
      });
    });

    describe('size', () => {
      it('FormControl size="sm"이면 sizeSm 클래스가 있어야 한다', () => {
        render(
          <FormControl size="sm">
            <FormHelperText>Foo</FormHelperText>
          </FormControl>,
        );

        expect(screen.getByText('Foo')).toHaveClass(formHelperTextClasses.sizeSm);
      });

      it('size는 props로 override할 수 있어야 한다', () => {
        const FormHelperTextInFormControl = (
          props: React.ComponentProps<typeof FormHelperText>,
        ) => (
          <FormControl size="md">
            <FormHelperText {...props}>Foo</FormHelperText>
          </FormControl>
        );

        const { setProps } = render(<FormHelperTextInFormControl />);

        expect(screen.getByText('Foo')).not.toHaveClass(formHelperTextClasses.sizeSm);
        expect(screen.getByText('Foo')).toHaveClass(formHelperTextClasses.sizeMd);

        setProps({ size: 'sm' });

        expect(screen.getByText('Foo')).toHaveClass(formHelperTextClasses.sizeSm);
        expect(screen.getByText('Foo')).not.toHaveClass(formHelperTextClasses.sizeMd);
      });
    });
  });
});
