import * as React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { spy } from 'sinon';

import { FormControl, useFormControl } from '../form-control';
import { InputBase, inputBaseClasses } from './InputBase';
import { createRenderer, describeConformance } from '../../../test';

type FormControlContextValue = NonNullable<ReturnType<typeof useFormControl>>;

const getFormControlHandle = (
  ref: React.RefObject<FormControlContextValue | null>,
): FormControlContextValue => {
  const current = ref.current;

  expect(current).not.toBeNull();

  if (current == null) {
    throw new Error('FormControl ref가 연결되지 않았습니다.');
  }

  return current;
};

const FilledStateLabel = (props: React.ComponentProps<'label'>) => {
  const formControl = useFormControl();

  return <label {...props}>filled: {String(formControl?.filled)}</label>;
};

const FocusedStateLabel = (props: React.ComponentProps<'label'>) => {
  const formControl = useFormControl();

  return <label {...props}>focused: {String(formControl?.focused)}</label>;
};

describe('<InputBase />', () => {
  const { render } = createRenderer();

  describeConformance(<InputBase />, () => ({
    render,
    classes: inputBaseClasses,
    refInstanceof: HTMLDivElement,
    skip: ['polymorphicProp'],
  }));

  describe('rendering', () => {
    it('root 내부에 기본 text input을 렌더링해야 한다', () => {
      const { container } = render(<InputBase />);
      const input = container.querySelector('input');

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveClass(inputBaseClasses.input);
      expect(input).not.toHaveAttribute('required');
    });

    it('size="sm"이면 root에 sizeSm 클래스가 있어야 한다', () => {
      render(<InputBase data-testid="root" size="sm" />);

      expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.sizeSm);
    });

    it('children을 root 내부에 렌더링해야 한다', () => {
      render(
        <InputBase>
          <span data-testid="child">child</span>
        </InputBase>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('multiline', () => {
    it('multiline이면 textarea를 렌더링해야 한다', () => {
      render(<InputBase multiline />);

      const textarea = screen.getByRole('textbox');

      expect(textarea.tagName.toLowerCase()).toBe('textarea');
    });

    it('rows가 지정되면 textarea를 렌더링해야 한다', () => {
      render(<InputBase multiline rows={4} />);

      const textarea = screen.getByRole('textbox');

      expect(textarea.tagName.toLowerCase()).toBe('textarea');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('textareaProps.rows가 rows보다 우선해야 한다', () => {
      render(<InputBase multiline rows={4} textareaProps={{ rows: 6 }} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
    });

    it('value를 textarea에 전달해야 한다', () => {
      render(<InputBase multiline value="Hello" />);

      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveValue('Hello');
    });

    it('rows 변경 시 focus 상태를 유지해야 한다', () => {
      const { setProps } = render(<InputBase multiline />);
      const textarea = screen.getByRole('textbox');

      act(() => {
        textarea.focus();
      });

      expect(textarea).toHaveFocus();

      setProps({ rows: 4 });

      expect(textarea).toHaveFocus();
    });
  });

  describe('prop: disabled', () => {
    it('disabled input을 렌더링해야 한다', () => {
      render(<InputBase data-testid="root" disabled />);

      const root = screen.getByTestId('root');
      const input = screen.getByRole('textbox');

      expect(root).toHaveClass(inputBaseClasses.disabled);
      expect(input).toBeDisabled();
    });

    it('disabled 상태에서도 root onClick은 전달되어야 한다', () => {
      const handleClick = spy();

      render(<InputBase data-testid="root" disabled onClick={handleClick} />);

      fireEvent.click(screen.getByTestId('root'));

      expect(handleClick.callCount).toBe(1);
    });
  });

  describe('prop: readOnly', () => {
    it('readonly input을 렌더링해야 한다', () => {
      render(<InputBase data-testid="root" readOnly />);

      const root = screen.getByTestId('root');
      const input = screen.getByRole('textbox');

      expect(root).toHaveClass(inputBaseClasses.readOnly);
      expect(input).toHaveProperty('readOnly', true);
    });
  });

  describe('event callbacks', () => {
    it('이벤트 콜백들을 호출해야 한다', () => {
      const handleChange = spy();
      const handleFocus = spy();
      const handleBlur = spy();
      const handleKeyUp = spy();
      const handleKeyDown = spy();

      render(
        <InputBase
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
        />,
      );

      const input = screen.getByRole('textbox');

      act(() => {
        input.focus();
      });
      expect(handleFocus.callCount).toBe(1);

      fireEvent.keyDown(input, { key: 'a' });
      expect(handleKeyDown.callCount).toBe(1);

      fireEvent.change(input, { target: { value: 'a' } });
      expect(handleChange.callCount).toBe(1);

      fireEvent.keyUp(input, { key: 'a' });
      expect(handleKeyUp.callCount).toBe(1);

      act(() => {
        input.blur();
      });
      expect(handleBlur.callCount).toBe(1);
    });

    it('inputProps.onChange와 onChange를 모두 호출해야 한다', () => {
      const handleInputPropsChange = spy();
      const handleChange = spy();

      render(
        <InputBase onChange={handleChange} inputProps={{ onChange: handleInputPropsChange }} />,
      );

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'hello' },
      });

      expect(handleInputPropsChange.callCount).toBe(1);
      expect(handleChange.callCount).toBe(1);
    });

    it('textareaProps.onChange와 onChange를 모두 호출해야 한다', () => {
      const handleTextareaPropsChange = spy();
      const handleChange = spy();

      render(
        <InputBase
          multiline
          onChange={handleChange}
          textareaProps={{ onChange: handleTextareaPropsChange }}
        />,
      );

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'hello' },
      });

      expect(handleTextareaPropsChange.callCount).toBe(1);
      expect(handleChange.callCount).toBe(1);
    });
  });

  describe('with FormControl', () => {
    it('FormControl 내부에서는 formControl 클래스가 있어야 한다', () => {
      render(
        <FormControl>
          <InputBase data-testid="root" />
        </FormControl>,
      );

      expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.formControl);
    });

    describe('callbacks', () => {
      it('root click 시 onClick과 focus가 동작해야 한다', () => {
        const handleClick = spy();
        const handleFocus = spy();

        render(
          <FormControl>
            <InputBase data-testid="root" onClick={handleClick} onFocus={handleFocus} />
          </FormControl>,
        );

        fireEvent.click(screen.getByTestId('root'));

        expect(handleClick.callCount).toBe(1);
        expect(handleFocus.callCount).toBe(1);
      });
    });

    describe('error', () => {
      const InputBaseInErrorForm = (props: React.ComponentProps<typeof InputBase>) => (
        <FormControl error>
          <InputBase data-testid="root" {...props} />
        </FormControl>
      );

      it('FormControl error 상태를 받아 error 클래스를 가져야 한다', () => {
        render(<InputBaseInErrorForm />);

        expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.error);
      });

      it('props로 error 상태를 override할 수 있어야 한다', () => {
        const { setProps } = render(<InputBaseInErrorForm />);

        expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.error);

        setProps({ error: false });
        expect(screen.getByTestId('root')).not.toHaveClass(inputBaseClasses.error);

        setProps({ error: true });
        expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.error);
      });
    });

    describe('size', () => {
      it('FormControl size="sm"이면 inputSizeSm 클래스가 있어야 한다', () => {
        render(
          <FormControl size="sm">
            <InputBase />
          </FormControl>,
        );

        expect(screen.getByRole('textbox')).toHaveClass(inputBaseClasses.inputSizeSm);
      });

      it('size는 props로 override할 수 있어야 한다', () => {
        const InputBaseInForm = (props: React.ComponentProps<typeof InputBase>) => (
          <FormControl size="md">
            <InputBase {...props} />
          </FormControl>
        );

        const { setProps } = render(<InputBaseInForm />);

        expect(screen.getByRole('textbox')).not.toHaveClass(inputBaseClasses.inputSizeSm);

        setProps({ size: 'sm' });

        expect(screen.getByRole('textbox')).toHaveClass(inputBaseClasses.inputSizeSm);
      });

      it('hiddenLabel이면 inputHiddenLabel 클래스가 있어야 한다', () => {
        render(
          <FormControl hiddenLabel margin="dense">
            <InputBase />
          </FormControl>,
        );

        expect(screen.getByRole('textbox')).toHaveClass(inputBaseClasses.inputHiddenLabel);
      });
    });

    describe('required', () => {
      it('FormControl required 상태를 input required 속성으로 반영해야 한다', () => {
        render(
          <FormControl required>
            <InputBase />
          </FormControl>,
        );

        expect(screen.getByRole('textbox')).toBeRequired();
      });
    });

    describe('focused', () => {
      it('FormControl context의 focused 상태를 우선 반영해야 한다', () => {
        const FormController = React.forwardRef<FormControlContextValue>((_props, ref) => {
          const formControl = useFormControl();

          if (!formControl) {
            throw new Error('FormController는 FormControl 내부에서만 사용해야 합니다.');
          }

          React.useImperativeHandle(ref, () => formControl, [formControl]);

          return null;
        });

        const controlRef = React.createRef<FormControlContextValue>();

        render(
          <FormControl>
            <FormController ref={controlRef} />
            <InputBase data-testid="root" />
          </FormControl>,
        );

        act(() => {
          screen.getByRole('textbox').focus();
        });

        expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.focused);

        act(() => {
          getFormControlHandle(controlRef).onBlur();
        });

        expect(screen.getByTestId('root')).not.toHaveClass(inputBaseClasses.focused);

        act(() => {
          getFormControlHandle(controlRef).onFocus();
        });

        expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.focused);
      });

      it('focused 상태를 FormControl 컨텍스트에 전파해야 한다', () => {
        render(
          <FormControl>
            <FocusedStateLabel data-testid="label" htmlFor="input" />
            <InputBase id="input" />
          </FormControl>,
        );

        expect(screen.getByTestId('label')).toHaveTextContent('focused: false');

        act(() => {
          screen.getByRole('textbox').focus();
        });

        expect(screen.getByTestId('label')).toHaveTextContent('focused: true');

        act(() => {
          screen.getByRole('textbox').blur();
        });

        expect(screen.getByTestId('label')).toHaveTextContent('focused: false');
      });
    });

    it('uncontrolled 상태에서 filled를 FormControl에 전파해야 한다', () => {
      render(
        <FormControl>
          <FilledStateLabel data-testid="label" />
          <InputBase />
        </FormControl>,
      );

      const textbox = screen.getByRole('textbox');

      expect(screen.getByTestId('label')).toHaveTextContent('filled: false');

      fireEvent.change(textbox, { target: { value: 'material' } });
      expect(screen.getByTestId('label')).toHaveTextContent('filled: true');

      fireEvent.change(textbox, { target: { value: '0' } });
      expect(screen.getByTestId('label')).toHaveTextContent('filled: true');

      fireEvent.change(textbox, { target: { value: '' } });
      expect(screen.getByTestId('label')).toHaveTextContent('filled: false');
    });

    it('controlled 상태에서 filled를 FormControl에 전파해야 한다', () => {
      const ControlledInputBase = (props: React.ComponentProps<typeof InputBase>) => (
        <FormControl>
          <FilledStateLabel data-testid="label" />
          <InputBase {...props} />
        </FormControl>
      );

      const { setProps } = render(<ControlledInputBase value="" />);

      expect(screen.getByTestId('label')).toHaveTextContent('filled: false');

      setProps({ value: 'material' });
      expect(screen.getByTestId('label')).toHaveTextContent('filled: true');

      setProps({ value: 0 });
      expect(screen.getByTestId('label')).toHaveTextContent('filled: true');

      setProps({ value: '' });
      expect(screen.getByTestId('label')).toHaveTextContent('filled: false');
    });
  });

  describe('prop: inputProps', () => {
    it('inputProps를 input에 적용해야 한다', () => {
      const { container } = render(<InputBase inputProps={{ className: 'foo', maxLength: 5 }} />);
      const input = container.querySelector('input');

      expect(input).toHaveClass('foo');
      expect(input).toHaveClass(inputBaseClasses.input);
      expect(input).toHaveProperty('maxLength', 5);
    });

    it('inputProps.ref로 native input ref를 받을 수 있어야 한다', () => {
      const inputRef = React.createRef<HTMLInputElement>();
      const { container } = render(<InputBase inputProps={{ ref: inputRef }} />);

      expect(inputRef.current).toBe(container.querySelector('input'));
    });

    it('같은 className을 중복 적용하지 않아야 한다', () => {
      const { container } = render(<InputBase inputProps={{ className: 'foo' }} />);
      const input = container.querySelector('input');

      expect(input).toHaveClass('foo');

      const matches = input?.className.match(/foo/g);

      expect(matches).toHaveLength(1);
    });

    it('inputProps.type이 type prop보다 우선해야 한다', () => {
      render(<InputBase type="password" inputProps={{ type: 'email' }} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });
  });

  describe('prop: textareaProps', () => {
    it('textareaProps를 textarea에 적용해야 한다', () => {
      render(<InputBase multiline textareaProps={{ className: 'foo', maxLength: 5 }} />);

      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveClass('foo');
      expect(textarea).toHaveClass(inputBaseClasses.input);
      expect(textarea).toHaveProperty('maxLength', 5);
    });

    it('textareaProps.ref로 native textarea ref를 받을 수 있어야 한다', () => {
      const textareaRef = React.createRef<HTMLTextAreaElement>();

      render(<InputBase multiline textareaProps={{ ref: textareaRef }} />);

      expect(textareaRef.current).toBe(screen.getByRole('textbox'));
    });

    it('같은 className을 중복 적용하지 않아야 한다', () => {
      render(<InputBase multiline textareaProps={{ className: 'foo' }} />);

      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveClass('foo');

      const matches = textarea.className.match(/foo/g);

      expect(matches).toHaveLength(1);
    });
  });

  describe('prop: startAdornment, endAdornment', () => {
    it('startAdornment를 input 앞에 렌더링해야 한다', () => {
      render(<InputBase startAdornment={<span data-testid="start-adornment">$</span>} />);

      expect(screen.getByTestId('start-adornment')).toBeInTheDocument();
    });

    it('endAdornment를 input 뒤에 렌더링해야 한다', () => {
      render(<InputBase endAdornment={<span data-testid="end-adornment">$</span>} />);

      expect(screen.getByTestId('end-adornment')).toBeInTheDocument();
    });

    it('startAdornment가 있으면 adornedStart 클래스가 있어야 한다', () => {
      render(
        <InputBase
          data-testid="root"
          startAdornment={<span data-testid="start-adornment">$</span>}
        />,
      );

      expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.adornedStart);
    });

    it('endAdornment가 있으면 adornedEnd 클래스가 있어야 한다', () => {
      render(
        <InputBase data-testid="root" endAdornment={<span data-testid="end-adornment">$</span>} />,
      );

      expect(screen.getByTestId('root')).toHaveClass(inputBaseClasses.adornedEnd);
    });
  });

  describe('prop: inputRef', () => {
    it('native input에 접근할 수 있어야 한다', () => {
      const inputRef = React.createRef<HTMLInputElement>();
      const { container } = render(<InputBase inputRef={inputRef} />);

      expect(inputRef.current).toBe(container.querySelector('input'));
    });

    it('multiline이면 native textarea에 접근할 수 있어야 한다', () => {
      const inputRef = React.createRef<HTMLTextAreaElement>();
      const { container } = render(<InputBase multiline inputRef={inputRef} />);

      expect(inputRef.current).toBe(container.querySelector('textarea'));
    });
  });
});
