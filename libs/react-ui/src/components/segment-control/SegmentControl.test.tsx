import { useState } from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createRenderer, describeConformance } from '../../../test';

import { SegmentControl } from './SegmentControl';
import { segmentControlClasses } from './SegmentControl.constants';
import type { SegmentOption } from './SegmentControl.types';

type View = 'list' | 'grid';

const baseOptions: readonly SegmentOption<View>[] = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
];

describe('<SegmentControl />', () => {
  const { render } = createRenderer();

  describeConformance(
    <SegmentControl<View> value="list" onChange={() => undefined} options={baseOptions} />,
    () => ({
      render,
      classes: segmentControlClasses,
      refInstanceof: HTMLDivElement,
      skip: ['polymorphicProp'],
    }),
  );

  describe('root', () => {
    it('role="group"으로 렌더링하고 옵션을 button으로 표시해야 한다', () => {
      render(
        <SegmentControl<View>
          value="list"
          onChange={() => undefined}
          options={baseOptions}
          aria-label="View mode"
        />,
      );

      const group = screen.getByRole('group', { name: 'View mode' });

      expect(group).toHaveClass(segmentControlClasses.root);
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('선택된 옵션에 aria-pressed=true와 active 클래스를 적용해야 한다', () => {
      render(
        <SegmentControl<View> value="grid" onChange={() => undefined} options={baseOptions} />,
      );

      const list = screen.getByRole('button', { name: 'List' });
      const grid = screen.getByRole('button', { name: 'Grid' });

      expect(list).toHaveAttribute('aria-pressed', 'false');
      expect(grid).toHaveAttribute('aria-pressed', 'true');
      expect(grid).toHaveClass(segmentControlClasses.active);
      expect(list).not.toHaveClass(segmentControlClasses.active);
    });
  });

  describe('interaction', () => {
    it('옵션 클릭 시 onChange가 호출되어야 한다', async () => {
      const onChange = vi.fn();
      const { user } = render(
        <SegmentControl<View> value="list" onChange={onChange} options={baseOptions} />,
      );

      await user.click(screen.getByRole('button', { name: 'Grid' }));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('grid');
    });

    it('controlled value 변경에 따라 active 옵션이 갱신되어야 한다', () => {
      const Controlled = () => {
        const [value, setValue] = useState<View>('list');
        return (
          <>
            <SegmentControl<View> value={value} onChange={setValue} options={baseOptions} />
            <button type="button" onClick={() => setValue('grid')}>
              set-grid
            </button>
          </>
        );
      };

      const { user } = render(<Controlled />);

      expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');

      return user.click(screen.getByRole('button', { name: 'set-grid' })).then(() => {
        expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute(
          'aria-pressed',
          'true',
        );
      });
    });
  });

  describe('prop: disabled', () => {
    it('disabled 옵션을 비활성화해야 한다', () => {
      const options: readonly SegmentOption<View>[] = [
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid', disabled: true },
      ];
      render(<SegmentControl<View> value="list" onChange={() => undefined} options={options} />);

      expect(screen.getByRole('button', { name: 'Grid' })).toBeDisabled();
    });
  });

  describe('prop: ariaLabel', () => {
    it('아이콘 전용 옵션의 aria-label을 button에 전달해야 한다', () => {
      const options: readonly SegmentOption<View>[] = [
        { value: 'list', label: <span aria-hidden="true">≣</span>, ariaLabel: 'List view' },
        { value: 'grid', label: <span aria-hidden="true">▦</span>, ariaLabel: 'Grid view' },
      ];
      render(<SegmentControl<View> value="list" onChange={() => undefined} options={options} />);

      expect(screen.getByRole('button', { name: 'List view' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Grid view' })).toBeInTheDocument();
    });
  });
});
