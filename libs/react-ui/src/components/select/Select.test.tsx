import * as React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { spy } from 'sinon';

import { Select } from './Select';
import { selectClasses } from './Select.constants';
import { MenuItem } from '../menu-item';
import { FormControl } from '../form-control';
import { InputLabel } from '../input-label';
import { createRenderer, describeConformance } from '../../../test';

const getHiddenInputs = (container: HTMLElement): HTMLInputElement[] => {
  return Array.from(container.querySelectorAll('input[type="hidden"]')) as HTMLInputElement[];
};

const getHiddenInput = (container: HTMLElement): HTMLInputElement => {
  const [input] = getHiddenInputs(container);

  if (!(input instanceof HTMLInputElement)) {
    throw new Error('hidden input이 렌더링되지 않았습니다.');
  }

  return input;
};

const BasicOptions = () => (
  <React.Fragment>
    <MenuItem value="">None</MenuItem>
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
    <MenuItem value={30}>Thirty</MenuItem>
  </React.Fragment>
);

describe('<Select />', () => {
  const { render } = createRenderer();

  describeConformance(<Select value="" />, () => ({
    render,
    classes: selectClasses,
    refInstanceof: HTMLDivElement,
    skip: ['polymorphicProp'],
  }));

  describe('rendering', () => {
    it('hidden input을 렌더링하고 현재 value를 반영해야 한다', () => {
      const { container } = render(
        <Select value={10}>
          <BasicOptions />
        </Select>,
      );

      expect(getHiddenInput(container)).toHaveValue('10');
    });

    it('trigger는 combobox role을 가져야 한다', () => {
      render(
        <Select value="">
          <MenuItem value="">None</MenuItem>
        </Select>,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('null child를 허용해야 한다', () => {
      render(
        <Select open value={10}>
          {null}
          <MenuItem value={10}>Ten</MenuItem>
        </Select>,
      );

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    (['', 0, false, undefined, Number.NaN] as const).forEach((value) => {
      it(`falsy child "${String(value)}" 조건부 렌더링을 허용해야 한다`, () => {
        render(
          <Select open value={2}>
            {value && <MenuItem value={1}>One</MenuItem>}
            <MenuItem value={2}>Two</MenuItem>
          </Select>,
        );

        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Two' })).toBeInTheDocument();
      });
    });

    it('기본 hidden input에는 aria-hidden="true"가 있어야 한다', () => {
      const { container } = render(
        <Select value="10">
          <MenuItem value="10">Ten</MenuItem>
        </Select>,
      );

      expect(getHiddenInput(container)).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('opening and closing', () => {
    it('trigger click으로 메뉴를 열 수 있어야 한다', () => {
      render(
        <Select value="">
          <BasicOptions />
        </Select>,
      );

      fireEvent.click(screen.getByRole('combobox'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('trigger를 다시 click하면 메뉴를 닫아야 한다', () => {
      render(
        <Select value="">
          <BasicOptions />
        </Select>,
      );

      const trigger = screen.getByRole('combobox');

      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(trigger);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    ([' ', 'ArrowUp', 'ArrowDown', 'Enter'] as const).forEach((key) => {
      it(`${key} 키로 메뉴를 열 수 있어야 한다`, async () => {
        render(
          <Select value="">
            <MenuItem value="">None</MenuItem>
          </Select>,
        );

        const trigger = screen.getByRole('combobox');

        await act(async () => {
          trigger.focus();
        });

        fireEvent.keyDown(trigger, { key });

        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('defaultOpen이면 mount 시 열려 있어야 한다', () => {
      render(
        <Select defaultOpen value="">
          <BasicOptions />
        </Select>,
      );

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('outside click이면 닫혀야 한다', () => {
      render(
        <div>
          <button data-testid="outside">outside</button>
          <Select value="">
            <BasicOptions />
          </Select>
        </div>,
      );

      fireEvent.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId('outside'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('prop: onBlur', () => {
    it('blur 이벤트의 target에 name이 포함되어야 한다', async () => {
      const handleBlur = spy();

      render(
        <Select onBlur={handleBlur} name="blur-testing" value="">
          <MenuItem value="">None</MenuItem>
        </Select>,
      );

      const trigger = screen.getByRole('combobox');

      await act(async () => {
        trigger.focus();
        trigger.blur();
      });

      expect(handleBlur.callCount).toBe(1);
      expect(handleBlur.firstCall.args[0]?.target).toHaveProperty('name', 'blur-testing');
    });
  });

  describe('options', () => {
    it('option에는 data-value attribute가 있어야 한다', () => {
      render(
        <Select open value={10}>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
        </Select>,
      );

      const options = screen.getAllByRole('option');

      expect(options[0]).toHaveAttribute('data-value', '10');
      expect(options[1]).toHaveAttribute('data-value', '20');
    });

    it('같은 값을 다시 선택하면 onChange는 호출되지 않고 onClose만 호출되어야 한다', async () => {
      const handleChange = spy();
      const handleClose = spy();

      render(
        <Select open onChange={handleChange} onClose={handleClose} value="second">
          <MenuItem value="first">First</MenuItem>
          <MenuItem value="second">Second</MenuItem>
        </Select>,
      );

      await act(async () => {
        screen.getByRole('option', { name: 'Second' }).click();
      });

      expect(handleChange.callCount).toBe(0);
      expect(handleClose.callCount).toBe(1);
    });
  });

  describe('prop: onChange', () => {
    it('다른 option을 선택하면 onChange가 호출되어야 한다', async () => {
      const handleChange = spy();

      render(
        <Select onChange={handleChange} value="0">
          <MenuItem value="0">Zero</MenuItem>
          <MenuItem value="1">One</MenuItem>
          <MenuItem value="2">Two</MenuItem>
        </Select>,
      );

      fireEvent.click(screen.getByRole('combobox'));

      await act(async () => {
        screen.getByRole('option', { name: 'One' }).click();
      });

      expect(handleChange.callCount).toBe(1);
      expect(handleChange.firstCall.args[0]?.target).toHaveProperty('value', '1');
    });

    it('onChange가 onClose보다 먼저 호출되어야 한다', async () => {
      const eventLog: string[] = [];

      const handleChange = spy(() => {
        eventLog.push('CHANGE_EVENT');
      });

      const handleClose = spy(() => {
        eventLog.push('CLOSE_EVENT');
      });

      render(
        <Select onChange={handleChange} onClose={handleClose} value="0">
          <MenuItem value="0">Zero</MenuItem>
          <MenuItem value="1">One</MenuItem>
        </Select>,
      );

      fireEvent.click(screen.getByRole('combobox'));

      await act(async () => {
        screen.getByRole('option', { name: 'One' }).click();
      });

      expect(eventLog).toEqual(['CHANGE_EVENT', 'CLOSE_EVENT']);
    });

    it('같은 값을 선택하면 onChange가 호출되지 않아야 한다', async () => {
      const handleChange = spy();

      render(
        <Select onChange={handleChange} value="1">
          <MenuItem value="0">Zero</MenuItem>
          <MenuItem value="1">One</MenuItem>
          <MenuItem value="2">Two</MenuItem>
        </Select>,
      );

      fireEvent.click(screen.getByRole('combobox'));

      await act(async () => {
        screen.getByRole('option', { name: 'One' }).click();
      });

      expect(handleChange.callCount).toBe(0);
    });
  });

  describe('prop: value', () => {
    it('number value와 일치하는 option을 선택해야 한다', () => {
      render(
        <Select open value={20}>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>,
      );

      const options = screen.getAllByRole('option');

      expect(options[0]).not.toHaveAttribute('aria-selected', 'true');
      expect(options[1]).toHaveAttribute('aria-selected', 'true');
      expect(options[2]).not.toHaveAttribute('aria-selected', 'true');
    });

    it('stringified equality로 string value와도 일치해야 한다', () => {
      render(
        <Select open value="20">
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>,
      );

      const options = screen.getAllByRole('option');

      expect(options[0]).not.toHaveAttribute('aria-selected', 'true');
      expect(options[1]).toHaveAttribute('aria-selected', 'true');
      expect(options[2]).not.toHaveAttribute('aria-selected', 'true');
    });

    it('object value는 strict equality로 비교해야 한다', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };

      render(
        <Select open value={obj1}>
          <MenuItem value={obj1}>One</MenuItem>
          <MenuItem value={obj2}>Two</MenuItem>
        </Select>,
      );

      const options = screen.getAllByRole('option');

      expect(options[0]).toHaveAttribute('aria-selected', 'true');
      expect(options[1]).not.toHaveAttribute('aria-selected', 'true');
    });

    it('object value도 display text를 렌더링할 수 있어야 한다', () => {
      const value = {};

      render(
        <Select value={value}>
          <MenuItem value="">None</MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={value}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>,
      );

      expect(screen.getByRole('combobox')).toHaveTextContent('Twenty');
    });
  });

  describe('accessibility', () => {
    it('open이면 aria-expanded="true"여야 한다', () => {
      render(<Select open value="" />);

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    });

    it('닫혀 있으면 aria-expanded="false"여야 한다', () => {
      render(<Select value="" />);

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('disabled면 combobox에 aria-disabled="true"가 있어야 한다', () => {
      render(<Select disabled value="" />);

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    });

    it('disabled면 hidden input도 disabled여야 한다', () => {
      const { container } = render(<Select disabled value="" />);

      expect(getHiddenInput(container)).toBeDisabled();
    });

    it('required면 combobox에 aria-required="true"가 있어야 한다', () => {
      render(<Select required value="" />);

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
    });

    it('error면 aria-invalid="true"가 있어야 한다', () => {
      render(<Select error value="" />);

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('combobox는 listbox popup을 가진다고 알려야 한다', () => {
      render(<Select value="" />);

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('open이면 listbox를 렌더링해야 한다', () => {
      render(<Select open value="" />);

      expect(screen.getByRole('listbox')).toBeVisible();
    });

    it('open이면 aria-controls가 listbox id를 가리켜야 한다', () => {
      render(<Select open value="" />);

      const listbox = screen.getByRole('listbox');

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-controls', listbox.id);
    });

    it('닫혀 있으면 aria-controls가 없어야 한다', () => {
      render(<Select open={false} value="" />);

      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-controls');
    });

    it('각 option은 role="option"이어야 한다', () => {
      render(
        <Select open value="">
          <MenuItem value="1">First</MenuItem>
          <MenuItem value="2">Second</MenuItem>
        </Select>,
      );

      const options = screen.getAllByRole('option');

      expect(options[0]).toHaveTextContent('First');
      expect(options[1]).toHaveTextContent('Second');
    });

    it('labelId가 있으면 combobox와 listbox 모두 label을 참조할 수 있어야 한다', () => {
      render(
        <React.Fragment>
          <span id="select-label">Choose one:</span>
          <Select labelId="select-label" open value="">
            <MenuItem value="1">First</MenuItem>
          </Select>
        </React.Fragment>,
      );

      const combobox = screen.getByRole('combobox');
      const listbox = screen.getByRole('listbox');

      expect(combobox).toHaveAttribute('aria-labelledby', 'select-label');
      expect(listbox).toHaveAttribute('aria-labelledby', 'select-label');
    });

    it('aria-describedby를 전달할 수 있어야 한다', () => {
      render(
        <React.Fragment>
          <Select aria-describedby="select-helper-text" value="">
            <MenuItem value="">None</MenuItem>
          </Select>
          <span id="select-helper-text">Helper text content</span>
        </React.Fragment>,
      );

      const target = screen.getByRole('combobox');

      expect(target).toHaveAttribute('aria-describedby', 'select-helper-text');
      expect(target).toHaveAccessibleDescription('Helper text content');
    });
  });

  describe('prop: displayEmpty', () => {
    it('빈 값이어도 displayEmpty면 선택된 empty option 텍스트를 표시해야 한다', () => {
      render(
        <Select value="" displayEmpty>
          <MenuItem value="">Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>,
      );

      expect(screen.getByRole('combobox')).toHaveTextContent('Ten');
    });
  });

  it('renderValue로 표시값을 커스텀할 수 있어야 한다', () => {
    const renderValue = (value: unknown) => `0b${Number(value).toString(2)}`;

    render(
      <Select renderValue={renderValue} value={4}>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={4}>4</MenuItem>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('0b100');
  });

  describe('prop: open (controlled)', () => {
    const ControlledWrapper = () => {
      const [open, setOpen] = React.useState(false);

      return (
        <Select open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} value="">
          <MenuItem onClick={() => setOpen(false)} value="">
            Close
          </MenuItem>
        </Select>
      );
    };

    it('onOpen / onClose로 open 상태를 제어할 수 있어야 한다', async () => {
      render(<ControlledWrapper />);

      fireEvent.click(screen.getByRole('combobox'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      await act(async () => {
        screen.getByRole('option', { name: 'Close' }).click();
      });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('open=true면 열려 있어야 한다', () => {
      render(
        <Select open value="">
          <MenuItem value="">Hello</MenuItem>
        </Select>,
      );

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('with FormControl', () => {
    it('FormControl required/error/disabled를 반영해야 한다', () => {
      const { container } = render(
        <FormControl required error disabled>
          <Select value="">
            <MenuItem value="">None</MenuItem>
          </Select>
        </FormControl>,
      );

      const combobox = screen.getByRole('combobox');

      expect(combobox).toHaveAttribute('aria-required', 'true');
      expect(combobox).toHaveAttribute('aria-invalid', 'true');
      expect(combobox).toHaveAttribute('aria-disabled', 'true');

      const input = getHiddenInput(container);

      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('required');
    });
  });

  describe('integration', () => {
    it('InputLabel htmlFor와 연결되어 accessible name을 가져야 한다', () => {
      render(
        <React.Fragment>
          <InputLabel htmlFor="my-select">Age</InputLabel>
          <Select id="my-select" value="">
            <MenuItem value="">None</MenuItem>
          </Select>
        </React.Fragment>,
      );

      expect(screen.getByRole('combobox')).toHaveAccessibleName('Age');
    });

    it('labelId를 사용해 accessible name을 가질 수 있어야 한다', () => {
      render(
        <React.Fragment>
          <InputLabel id="my-label">Age</InputLabel>
          <Select labelId="my-label" value="">
            <MenuItem value="">None</MenuItem>
          </Select>
        </React.Fragment>,
      );

      expect(screen.getByRole('combobox')).toHaveAccessibleName('Age');
    });
  });

  describe('prop: autoFocus', () => {
    it('mount 후 자동으로 focus되어야 한다', () => {
      render(
        <Select value="" autoFocus>
          <MenuItem value="">None</MenuItem>
        </Select>,
      );

      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('events', () => {
    it('onKeyDown을 전달해야 한다', async () => {
      const handleKeyDown = spy();

      render(
        <Select value="one" onKeyDown={handleKeyDown}>
          <MenuItem value="one">One</MenuItem>
          <MenuItem value="two">Two</MenuItem>
        </Select>,
      );

      const trigger = screen.getByRole('combobox');

      await act(async () => {
        trigger.focus();
      });

      fireEvent.keyDown(trigger, { key: 'a' });

      expect(handleKeyDown.callCount).toBe(1);
      expect(handleKeyDown.firstCall.args[0]).toHaveProperty('key', 'a');
    });

    it('onMouseDown을 전달해야 한다', async () => {
      const handleMouseDown = spy();

      render(
        <Select value="one" onMouseDown={handleMouseDown}>
          <MenuItem value="one">One</MenuItem>
          <MenuItem value="two">Two</MenuItem>
        </Select>,
      );

      const trigger = screen.getByRole('combobox');

      await act(async () => {
        trigger.focus();
      });

      fireEvent.mouseDown(trigger);

      expect(handleMouseDown.callCount).toBe(1);
      expect(handleMouseDown.firstCall.args[0]).toHaveProperty('button', 0);
    });
  });
});
