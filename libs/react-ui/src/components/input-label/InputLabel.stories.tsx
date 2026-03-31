import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputLabel } from './InputLabel';

const meta = {
  title: 'Components/InputLabel',
  component: InputLabel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Label',
    size: 'md',
    color: 'primary',
    disabled: false,
    error: false,
    focused: false,
    required: false,
  },
  argTypes: {
    children: { control: 'text' },
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
    focused: { control: 'boolean' },
    required: { control: 'boolean' },
    ref: { control: false },
  },
} satisfies Meta<typeof InputLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '12px',
};

export const Playground: Story = {
  render: (args) => <InputLabel {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputLabel size="sm">Small label</InputLabel>
      <InputLabel size="md">Medium label</InputLabel>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputLabel color="primary">Primary label</InputLabel>
      <InputLabel color="secondary">Secondary label</InputLabel>
      <InputLabel color="primary" focused>Primary focused</InputLabel>
      <InputLabel color="secondary" focused>Secondary focused</InputLabel>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputLabel>Default</InputLabel>
      <InputLabel focused>Focused</InputLabel>
      <InputLabel disabled>Disabled</InputLabel>
      <InputLabel error>Error</InputLabel>
      <InputLabel required>Required</InputLabel>
      <InputLabel error required>Error Required</InputLabel>
    </div>
  ),
};
