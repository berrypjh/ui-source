import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SegmentControl } from './SegmentControl';
import type { SegmentControlProps, SegmentOption } from './SegmentControl.types';

type View = 'list' | 'grid' | 'gallery';

const viewOptions: readonly SegmentOption<View>[] = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'gallery', label: 'Gallery' },
];

const meta = {
  title: 'Components/SegmentControl',
  component: SegmentControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    'aria-label': 'View mode',
    options: viewOptions,
    value: 'list' as View,
    onChange: () => undefined,
  },
  argTypes: {
    value: { control: 'select', options: ['list', 'grid', 'gallery'] },
    options: { control: false },
    onChange: { action: 'changed' },
    className: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof SegmentControl<View>>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

export const Playground: Story = {
  render: (rawArgs) => {
    const args = rawArgs as SegmentControlProps<View>;
    const [value, setValue] = useState<View>(args.value);
    return (
      <SegmentControl<View>
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
    );
  },
};

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<View>('list');
    return (
      <SegmentControl<View>
        aria-label="View mode"
        options={viewOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const TwoOptions: Story = {
  render: () => {
    type Mode = 'on' | 'off';
    const [value, setValue] = useState<Mode>('on');
    return (
      <SegmentControl<Mode>
        aria-label="Toggle"
        options={[
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState<View>('list');
    return (
      <SegmentControl<View>
        aria-label="View mode with disabled option"
        options={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid', disabled: true },
          { value: 'gallery', label: 'Gallery' },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    type Align = 'left' | 'center' | 'right';
    const [value, setValue] = useState<Align>('left');
    return (
      <SegmentControl<Align>
        aria-label="Alignment"
        options={[
          { value: 'left', label: <span aria-hidden="true">⟸</span>, ariaLabel: 'Align left' },
          { value: 'center', label: <span aria-hidden="true">≡</span>, ariaLabel: 'Align center' },
          { value: 'right', label: <span aria-hidden="true">⟹</span>, ariaLabel: 'Align right' },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Stacked: Story = {
  render: () => {
    const [view, setView] = useState<View>('list');
    type Sort = 'name' | 'date';
    const [sort, setSort] = useState<Sort>('name');
    return (
      <div style={columnStyle}>
        <SegmentControl<View>
          aria-label="View mode"
          options={viewOptions}
          value={view}
          onChange={setView}
        />
        <SegmentControl<Sort>
          aria-label="Sort"
          options={[
            { value: 'name', label: 'Name' },
            { value: 'date', label: 'Date' },
          ]}
          value={sort}
          onChange={setSort}
        />
      </div>
    );
  },
};
