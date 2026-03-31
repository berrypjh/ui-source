import type { Meta, StoryObj } from '@storybook/react-vite';

import { MenuItem } from '../menu-item';
import { Select } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    placeholder: 'Select an option',
    variant: 'boxed',
    size: 'md',
    color: 'primary',
    disabled: false,
    error: false,
    fullWidth: false,
    multiple: false,
    displayEmpty: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['boxed', 'filled', 'plain'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    multiple: { control: 'boolean' },
    displayEmpty: { control: 'boolean' },
    placeholder: { control: 'text' },
    children: { control: false },
    renderValue: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
  alignItems: 'center',
};

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

const DefaultOptions = () => (
  <>
    <MenuItem value="apple">Apple</MenuItem>
    <MenuItem value="banana">Banana</MenuItem>
    <MenuItem value="cherry">Cherry</MenuItem>
    <MenuItem value="disabled" disabled>Disabled option</MenuItem>
  </>
);

export const Playground: Story = {
  render: (args) => (
    <Select {...args}>
      <DefaultOptions />
    </Select>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={columnStyle}>
      <Select variant="boxed" placeholder="Boxed">
        <DefaultOptions />
      </Select>
      <Select variant="filled" placeholder="Filled">
        <DefaultOptions />
      </Select>
      <Select variant="plain" placeholder="Plain">
        <DefaultOptions />
      </Select>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <Select size="sm" placeholder="Small">
        <DefaultOptions />
      </Select>
      <Select size="md" placeholder="Medium">
        <DefaultOptions />
      </Select>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={columnStyle}>
      <Select color="primary" placeholder="Primary">
        <DefaultOptions />
      </Select>
      <Select color="secondary" placeholder="Secondary">
        <DefaultOptions />
      </Select>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={columnStyle}>
      <Select placeholder="Default">
        <DefaultOptions />
      </Select>
      <Select placeholder="Disabled" disabled>
        <DefaultOptions />
      </Select>
      <Select placeholder="Error" error>
        <DefaultOptions />
      </Select>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Select multiple placeholder="Select multiple" defaultValue={[]}>
      <DefaultOptions />
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <div style={columnStyle}>
      <Select defaultValue="apple">
        <DefaultOptions />
      </Select>
      <Select multiple defaultValue={['apple', 'cherry']}>
        <DefaultOptions />
      </Select>
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <Select fullWidth placeholder="Full width select">
        <DefaultOptions />
      </Select>
      <Select fullWidth placeholder="Full width error" error>
        <DefaultOptions />
      </Select>
    </div>
  ),
};
