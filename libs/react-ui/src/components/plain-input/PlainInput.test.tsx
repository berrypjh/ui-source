import type { ComponentProps } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlainInput, plainInputClasses } from './PlainInput';
import { FormControl } from '../form-control';
import { inputBaseClasses } from '../input-base';
import { createRenderer, describeConformance } from '../../../test';

describe('<PlainInput />', () => {
  const { render } = createRenderer();

  describeConformance(<PlainInput />, () => ({
    render,
    classes: plainInputClasses,
    refInstanceof: HTMLDivElement,
    skip: ['polymorphicProp'],
  }));

  describe('rendering', () => {
    it('기본적으로 root와 native input을 렌더링해야 한다', () => {
      render(<PlainInput data-testid="root" inputProps={{ 'data-testid': 'input' } as never} />);

      const root = screen.getByTestId('root');
      const input = screen.getByTestId('input');

      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(plainInputClasses.root);
      expect(root).toHaveClass(inputBaseClasses.root);

      expect(input).toBeInTheDocument();
      expect(input).toHaveClass(plainInputClasses.input);
      expect(input).toHaveClass(inputBaseClasses.input);
    });

    it('color={undefined}여도 렌더링 중 에러가 나지 않아야 한다', () => {
      expect(() => {
        render(<PlainInput color={undefined} />);
      }).not.toThrow();
    });

    it('className을 root에 병합해야 한다', () => {
      render(<PlainInput data-testid="root" className="custom-root" />);

      const root = screen.getByTestId('root');

      expect(root).toHaveClass(plainInputClasses.root);
      expect(root).toHaveClass('custom-root');
    });

    it('root props를 InputBase root에 전달해야 한다', () => {
      render(<PlainInput data-testid="root" data-test="test" />);

      expect(screen.getByTestId('root')).toHaveAttribute('data-test', 'test');
    });

    it('inputProps를 native input에 전달해야 한다', () => {
      render(
        <PlainInput
          inputProps={
            {
              'data-testid': 'input',
              maxLength: 5,
            } as never
          }
        />,
      );

      const input = screen.getByTestId('input');

      expect(input).toHaveProperty('maxLength', 5);
    });

    it('multiline이면 textarea를 렌더링해야 한다', () => {
      render(<PlainInput multiline />);

      const textarea = screen.getByRole('textbox');

      expect(textarea.tagName.toLowerCase()).toBe('textarea');
    });

    it('startAdornment와 endAdornment를 렌더링해야 한다', () => {
      render(
        <PlainInput
          startAdornment={<span data-testid="start-adornment">start</span>}
          endAdornment={<span data-testid="end-adornment">end</span>}
        />,
      );

      expect(screen.getByTestId('start-adornment')).toBeInTheDocument();
      expect(screen.getByTestId('end-adornment')).toBeInTheDocument();
    });
  });

  describe('InputBase state forwarding', () => {
    it('error prop을 InputBase root에 전달해야 한다', () => {
      render(<PlainInput data-testid="root" error />);

      expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.error);
    });

    it('size="sm"을 InputBase root와 native input에 전달해야 한다', () => {
      render(<PlainInput size="sm" data-testid="root" />);

      const root = screen.getByTestId('root');
      const input = screen.getByRole('textbox');

      expect(root).toHaveClass(inputBaseClasses.sizeSm);
      expect(input).toHaveClass(inputBaseClasses.inputSizeSm);
    });

    it('multiline, startAdornment, endAdornment 상태 클래스를 root에 적용해야 한다', () => {
      render(
        <PlainInput
          data-testid="root"
          multiline
          startAdornment={<span data-testid="start">start</span>}
          endAdornment={<span data-testid="end">end</span>}
        />,
      );

      const root = screen.getByTestId('root');

      expect(root).toHaveClass(inputBaseClasses.multiline);
      expect(root).toHaveClass(inputBaseClasses.adornedStart);
      expect(root).toHaveClass(inputBaseClasses.adornedEnd);
    });

    it('disabled prop을 InputBase root와 native input에 전달해야 한다', () => {
      render(
        <PlainInput disabled data-testid="root" inputProps={{ 'data-testid': 'input' } as never} />,
      );

      const root = screen.getByTestId('root');
      const input = screen.getByTestId('input');

      expect(root).toHaveClass(inputBaseClasses.disabled);
      expect(input).toBeDisabled();
    });
  });

  describe('with FormControl', () => {
    it('FormControl error 상태를 받아와야 한다', () => {
      render(
        <FormControl error>
          <PlainInput data-testid="root" />
        </FormControl>,
      );

      expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.error);
    });

    it('FormControl size="sm" 상태를 받아와야 한다', () => {
      render(
        <FormControl size="sm">
          <PlainInput data-testid="root" />
        </FormControl>,
      );

      const root = screen.getByTestId('root');
      const input = screen.getByRole('textbox');

      expect(root).toHaveClass(inputBaseClasses.sizeSm);
      expect(input).toHaveClass(inputBaseClasses.inputSizeSm);
    });

    it('FormControl hiddenLabel 상태를 받아와야 한다', () => {
      render(
        <FormControl hiddenLabel>
          <PlainInput />
        </FormControl>,
      );

      expect(screen.getByRole('textbox')).toHaveClass(inputBaseClasses.inputHiddenLabel);
    });

    it('FormControl 상태는 props로 override할 수 있어야 한다', () => {
      const PlainInputInForm = (props: ComponentProps<typeof PlainInput>) => (
        <FormControl error size="md" hiddenLabel>
          <PlainInput data-testid="root" {...props} />
        </FormControl>
      );

      const { setProps } = render(<PlainInputInForm />);

      let root = screen.getByTestId('root');
      let input = screen.getByRole('textbox');

      expect(root).toHaveClass(inputBaseClasses.error);
      expect(input).toHaveClass(inputBaseClasses.inputHiddenLabel);
      expect(root).not.toHaveClass(inputBaseClasses.sizeSm);

      setProps({
        error: false,
        size: 'sm',
      });

      root = screen.getByTestId('root');
      input = screen.getByRole('textbox');

      expect(root).not.toHaveClass(inputBaseClasses.error);
      expect(root).toHaveClass(inputBaseClasses.sizeSm);
      expect(input).toHaveClass(inputBaseClasses.inputSizeSm);
    });
  });

  describe('input class composition', () => {
    it('native input에 plain input 전용 클래스와 custom class를 함께 유지해야 한다', () => {
      render(
        <PlainInput inputProps={{ 'data-testid': 'input', className: 'custom-input' } as never} />,
      );

      const input = screen.getByTestId('input');

      expect(input).toHaveClass(plainInputClasses.input);
      expect(input).toHaveClass(inputBaseClasses.input);
      expect(input).toHaveClass('custom-input');
    });
  });
});
