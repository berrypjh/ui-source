import type { Meta, StoryObj } from '@storybook/react-vite';

import { BoxedInput } from './BoxedInput';

const meta = {
  title: 'Components/BoxedInput',
  component: BoxedInput,
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
} satisfies Meta<typeof BoxedInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

export const Playground: Story = {
  render: (args) => <BoxedInput {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <BoxedInput size="sm" placeholder="Small" />
      <BoxedInput size="md" placeholder="Medium" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={columnStyle}>
      <BoxedInput color="primary" placeholder="Primary" />
      <BoxedInput color="secondary" placeholder="Secondary" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={columnStyle}>
      <BoxedInput placeholder="Default" />
      <BoxedInput placeholder="Disabled" disabled />
      <BoxedInput placeholder="Read Only" readOnly defaultValue="Read only value" />
      <BoxedInput placeholder="Error" error />
    </div>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <div style={columnStyle}>
      <BoxedInput startAdornment={<span>$</span>} placeholder="Amount" />
      <BoxedInput endAdornment={<span>kg</span>} placeholder="Weight" />
      <BoxedInput
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
      <BoxedInput multiline rows={3} placeholder="Multiline input" />
      <BoxedInput multiline rows={5} placeholder="Taller multiline" />
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <BoxedInput fullWidth placeholder="Full width input" />
      <BoxedInput fullWidth placeholder="Full width error" error />
    </div>
  ),
};
