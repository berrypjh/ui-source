import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlainInput } from './PlainInput';

const meta = {
  title: 'Components/PlainInput',
  component: PlainInput,
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
} satisfies Meta<typeof PlainInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

export const Playground: Story = {
  render: (args) => <PlainInput {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput size="sm" placeholder="Small" />
      <PlainInput size="md" placeholder="Medium" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput color="primary" placeholder="Primary" />
      <PlainInput color="secondary" placeholder="Secondary" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput placeholder="Default" />
      <PlainInput placeholder="Disabled" disabled />
      <PlainInput placeholder="Read Only" readOnly defaultValue="Read only value" />
      <PlainInput placeholder="Error" error />
    </div>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput startAdornment={<span>$</span>} placeholder="Amount" />
      <PlainInput endAdornment={<span>kg</span>} placeholder="Weight" />
      <PlainInput
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
      <PlainInput multiline rows={3} placeholder="Multiline input" />
      <PlainInput multiline rows={5} placeholder="Taller multiline" />
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <PlainInput fullWidth placeholder="Full width input" />
      <PlainInput fullWidth placeholder="Full width error" error />
    </div>
  ),
};
