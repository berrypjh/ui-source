import type { Meta, StoryObj } from '@storybook/react-vite';

import { MenuItem } from '../menu-item';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'boxed',
    size: 'md',
    color: 'primary',
    disabled: false,
    error: false,
    required: false,
    fullWidth: false,
    multiline: false,
    select: false,
    margin: 'none',
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
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
    margin: {
      control: 'select',
      options: ['none', 'dense', 'normal'],
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    multiline: { control: 'boolean' },
    select: { control: 'boolean' },
    rows: { control: 'number' },
    children: { control: false },
    inputRef: { control: false },
    component: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
  alignItems: 'flex-start',
};

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

export const Playground: Story = {
  render: (args) => <TextField {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div style={columnStyle}>
      <TextField variant="boxed" label="Boxed" placeholder="Boxed variant" />
      <TextField variant="filled" label="Filled" placeholder="Filled variant" />
      <TextField variant="plain" label="Plain" placeholder="Plain variant" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <TextField size="sm" label="Small" placeholder="Small size" />
      <TextField size="md" label="Medium" placeholder="Medium size" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={columnStyle}>
      <TextField label="Default" placeholder="Default" />
      <TextField label="Disabled" placeholder="Disabled" disabled />
      <TextField label="Error" placeholder="Error" error />
      <TextField label="Required" placeholder="Required" required />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div style={columnStyle}>
      <TextField label="With helper" placeholder="Type something" helperText="Helper text below" />
      <TextField
        label="Error with helper"
        placeholder="Invalid value"
        error
        helperText="This field has an error"
      />
      <TextField
        label="Required with helper"
        placeholder="Required"
        required
        helperText="This field is required"
      />
    </div>
  ),
};

export const NoLabel: Story = {
  render: () => (
    <div style={columnStyle}>
      <TextField placeholder="No label" />
      <TextField placeholder="No label, error" error helperText="Error message" />
    </div>
  ),
};

export const Multiline: Story = {
  render: () => (
    <div style={columnStyle}>
      <TextField label="Multiline" placeholder="Multiline input" multiline rows={3} />
      <TextField
        label="Multiline with helper"
        placeholder="Multiline input"
        multiline
        rows={5}
        helperText="Enter your message"
      />
    </div>
  ),
};

export const AsSelect: Story = {
  render: () => (
    <div style={columnStyle}>
      <TextField label="Select" select placeholder="Choose one">
        <MenuItem value="apple">Apple</MenuItem>
        <MenuItem value="banana">Banana</MenuItem>
        <MenuItem value="cherry">Cherry</MenuItem>
      </TextField>
      <TextField label="Select error" select placeholder="Choose one" error helperText="Required">
        <MenuItem value="apple">Apple</MenuItem>
        <MenuItem value="banana">Banana</MenuItem>
        <MenuItem value="cherry">Cherry</MenuItem>
      </TextField>
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <TextField fullWidth label="Full width" placeholder="Full width input" />
      <TextField
        fullWidth
        label="Full width error"
        placeholder="Invalid"
        error
        helperText="Error message"
      />
      <TextField fullWidth label="Full width multiline" multiline rows={3} />
    </div>
  ),
};
