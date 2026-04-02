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
    required: { control: 'boolean' },
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

export const Default: Story = {
  args: {
    placeholder: 'Enter text',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <BoxedInput size="sm" placeholder="Small" />
      <BoxedInput size="md" placeholder="Medium" />
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={columnStyle}>
      <BoxedInput color="primary" placeholder="Primary" />
      <BoxedInput color="secondary" placeholder="Secondary" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled value',
    placeholder: 'Disabled',
  },
};

export const Error: Story = {
  args: {
    error: true,
    value: 'invalid',
    placeholder: 'Email address',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Read-only content',
  },
};

export const Required: Story = {
  render: () => (
    <div style={columnStyle}>
      <BoxedInput required placeholder="Required field" id="required-field" />
    </div>
  ),
};

export const Multiline: Story = {
  render: () => (
    <div style={columnStyle}>
      <BoxedInput multiline rows={3} placeholder="Write a short description" />
      <BoxedInput multiline rows={5} placeholder="Write a longer message" />
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
      <BoxedInput fullWidth placeholder="Full width with error" error />
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
        placeholder="username"
      />
    </div>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <BoxedInput
        defaultValue="This is a very long input value that might overflow or truncate depending on the container width"
        style={{ width: '240px' }}
      />
      <BoxedInput
        multiline
        rows={3}
        defaultValue="This is a long multiline text that spans multiple lines to demonstrate how the component handles extended content gracefully."
        style={{ width: '320px' }}
      />
    </div>
  ),
};

export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="a11y-email">Email address</label>
        <BoxedInput
          id="a11y-email"
          type="email"
          placeholder="you@example.com"
          aria-describedby="a11y-email-hint"
          required
        />
        <span id="a11y-email-hint" style={{ fontSize: '12px', color: '#666' }}>
          We will never share your email.
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="a11y-error-input">Username</label>
        <BoxedInput
          id="a11y-error-input"
          error
          defaultValue="invalid user!"
          aria-describedby="a11y-error-msg"
          aria-invalid="true"
        />
        <span id="a11y-error-msg" style={{ fontSize: '12px', color: '#d32f2f' }}>
          Username can only contain letters, numbers, and underscores.
        </span>
      </div>
    </div>
  ),
  parameters: {
    a11y: { disable: false },
  },
};
