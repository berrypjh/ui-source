import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputBase } from './InputBase';

const meta = {
  title: 'Components/InputBase',
  component: InputBase,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    placeholder: 'Placeholder',
    size: 'md',
    color: 'primary',
    disabled: false,
    error: false,
    fullWidth: false,
    readOnly: false,
    multiline: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    multiline: { control: 'boolean' },
    rows: { control: 'number' },
    placeholder: { control: 'text' },
    startAdornment: { control: false },
    endAdornment: { control: false },
    inputProps: { control: false },
    textareaProps: { control: false },
    inputRef: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof InputBase>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

export const Playground: Story = {
  render: (args) => <InputBase {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase size="sm" placeholder="Small" />
      <InputBase size="md" placeholder="Medium" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase color="primary" placeholder="Primary" />
      <InputBase color="secondary" placeholder="Secondary" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase placeholder="Default" />
      <InputBase placeholder="Disabled" disabled />
      <InputBase placeholder="Read Only" readOnly defaultValue="Read only value" />
      <InputBase placeholder="Error" error />
    </div>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase startAdornment={<span>$</span>} placeholder="Amount" />
      <InputBase endAdornment={<span>kg</span>} placeholder="Weight" />
      <InputBase
        startAdornment={<span>@</span>}
        endAdornment={<span>.com</span>}
        placeholder="domain"
      />
    </div>
  ),
};

export const Multiline: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase multiline rows={3} placeholder="Multiline input" />
      <InputBase multiline rows={5} placeholder="Taller multiline" />
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <InputBase fullWidth placeholder="Full width input" />
      <InputBase fullWidth placeholder="Full width error" error />
    </div>
  ),
};
