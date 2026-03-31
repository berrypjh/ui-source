import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormHelperText } from './FormHelperText';

const meta = {
  title: 'Components/FormHelperText',
  component: FormHelperText,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Helper text',
    size: 'md',
    disabled: false,
    error: false,
  },
  argTypes: {
    children: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    ref: { control: false },
  },
} satisfies Meta<typeof FormHelperText>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '12px',
};

export const Playground: Story = {
  render: (args) => <FormHelperText {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <FormHelperText size="sm">Small helper text</FormHelperText>
      <FormHelperText size="md">Medium helper text</FormHelperText>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={columnStyle}>
      <FormHelperText>Default helper text</FormHelperText>
      <FormHelperText disabled>Disabled helper text</FormHelperText>
      <FormHelperText error>Error helper text</FormHelperText>
    </div>
  ),
};
