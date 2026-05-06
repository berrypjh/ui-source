import * as React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { spy } from 'sinon';
import { describe, expect, it } from 'vitest';

import { createRenderer, describeConformance } from '../../../test';
import { filledInputClasses } from '../filled-input';
import { formControlClasses } from '../form-control';
import { inputBaseClasses } from '../input-base';
import { plainInputClasses } from '../plain-input';

import { TextField } from './TextField';
import { textFieldClasses } from './TextField.constants';

describe('<TextField />', () => {
  const { render } = createRenderer();

  describeConformance(<TextField helperText="Helper text" label="Label" />, () => ({
    render,
    classes: textFieldClasses,
    refInstanceof: HTMLDivElement,
    polymorphicPropName: 'component',
    testPolymorphicPropWith: 'fieldset',
  }));

  describe('structure', () => {
    it('기본적으로 textbox 하나를 렌더링해야 한다', () => {
      render(<TextField />);

      expect(screen.getAllByRole('textbox')).toHaveLength(1);
    });

    it('root에 text field 클래스와 form control root 클래스가 있어야 한다', () => {
      render(<TextField data-testid="root" />);

      const root = screen.getByTestId('root');

      expect(root).toHaveClass(textFieldClasses.root);
      expect(root).toHaveClass(formControlClasses.root);
    });

    it('multiline이면 textarea를 렌더링해야 한다', () => {
      render(<TextField multiline />);

      expect(screen.getByRole('textbox').tagName.toLowerCase()).toBe('textarea');
    });

    it('fullWidth prop을 FormControl root와 Input root에 전달해야 한다', () => {
      render(<TextField fullWidth data-testid="root" />);

      const root = screen.getByTestId('root');
      const inputRoot = screen.getByRole('textbox').parentElement;

      expect(root).toHaveClass(formControlClasses.fullWidth);
      expect(inputRoot).toHaveClass(inputBaseClasses.fullWidth);
    });
  });

  describe('variant', () => {
    it('variant="plain"이면 PlainInput을 사용해야 한다', () => {
      render(<TextField variant="plain" />);

      const inputRoot = screen.getByRole('textbox').parentElement;

      expect(inputRoot).toHaveClass(plainInputClasses.root);
    });

    it('variant="filled"이면 FilledInput을 사용해야 한다', () => {
      render(<TextField variant="filled" />);

      const inputRoot = screen.getByRole('textbox').parentElement;

      expect(inputRoot).toHaveClass(filledInputClasses.root);
    });

    it('기본 variant는 boxed여야 한다', () => {
      render(<TextField />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('with a label', () => {
    it('label이 있으면 input의 accessible name으로 연결되어야 한다', () => {
      render(<TextField label="Foo bar" />);

      expect(screen.getByRole('textbox')).toHaveAccessibleName('Foo bar');
    });

    ['', undefined].forEach((label) => {
      it(`빈 label(${String(label)})이면 label element를 렌더링하지 않아야 한다`, () => {
        const { container } = render(<TextField label={label} />);

        expect(container.querySelector('label')).toBeNull();
      });
    });

    it('id prop이 있으면 label htmlFor와 input id가 연결되어야 한다', () => {
      render(<TextField id="my-field" label="Name" />);

      const label = screen.getByText('Name');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'my-field');
      expect(input).toHaveAttribute('id', 'my-field');
    });
  });

  describe('with helper text', () => {
    it('helperText를 렌더링해야 한다', () => {
      render(<TextField helperText="Foo bar" />);

      expect(screen.getByText('Foo bar')).toBeInTheDocument();
    });

    it('helperText는 input의 accessible description이어야 한다', () => {
      render(<TextField helperText="Foo bar" />);

      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Foo bar');
    });

    it('helperText가 있으면 id를 기반으로 helper text id를 연결해야 한다', () => {
      render(<TextField id="my-field" helperText="Helpful message" />);

      expect(screen.getByText('Helpful message')).toHaveAttribute('id', 'my-field-helper-text');
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'my-field-helper-text',
      );
    });
  });

  describe('events', () => {
    it('input 경로에서 onChange를 전달해야 한다', () => {
      const handleChange = spy();

      render(<TextField onChange={handleChange} />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'hello' },
      });

      expect(handleChange.callCount).toBe(1);
    });

    it('input 경로에서 onFocus와 onBlur를 전달해야 한다', () => {
      const handleFocus = spy();
      const handleBlur = spy();

      render(<TextField onFocus={handleFocus} onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');

      input.focus();
      input.blur();

      expect(handleFocus.callCount).toBe(1);
      expect(handleBlur.callCount).toBe(1);
    });

    it('onClick은 root slot에 등록되어야 한다', () => {
      const handleClick = spy((event: React.MouseEvent<HTMLElement>) => event.currentTarget);

      render(<TextField data-testid="root" onClick={handleClick} />);

      const input = screen.getByRole('textbox');
      const root = screen.getByTestId('root');

      fireEvent.click(input);

      expect(handleClick.callCount).toBe(1);
      expect(handleClick.returned(root)).toBe(true);
    });
  });

  describe('class merging', () => {
    it('className을 root에 병합해야 한다', () => {
      render(<TextField data-testid="root" className="custom-root" />);

      const root = screen.getByTestId('root');

      expect(root).toHaveClass(textFieldClasses.root);
      expect(root).toHaveClass('custom-root');
    });
  });

  describe('prop forwarding', () => {
    it('placeholder를 input에 전달해야 한다', () => {
      render(<TextField placeholder="Type here" />);

      expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    it('name을 input에 전달해야 한다', () => {
      render(<TextField name="email" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
    });

    it('required를 input에 전달해야 한다', () => {
      render(<TextField required />);

      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('disabled를 input에 전달해야 한다', () => {
      render(<TextField disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('prop: select', () => {
    it('select=true이면 combobox를 렌더링해야 한다', () => {
      render(
        <TextField select label="Currency" value="usd">
          <option value="usd">USD</option>
          <option value="krw">KRW</option>
        </TextField>,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('select는 label과 연결되어 accessible name을 가져야 한다', () => {
      render(
        <TextField select label="Currency" value="usd">
          <option value="usd">USD</option>
          <option value="krw">KRW</option>
        </TextField>,
      );

      expect(screen.getByRole('combobox')).toHaveAccessibleName('Currency');
    });

    it('helperText가 있으면 select도 accessible description을 가져야 한다', () => {
      render(
        <TextField select label="Currency" helperText="Choose one" value="usd">
          <option value="usd">USD</option>
          <option value="krw">KRW</option>
        </TextField>,
      );

      expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Choose one');
    });
  });
});
