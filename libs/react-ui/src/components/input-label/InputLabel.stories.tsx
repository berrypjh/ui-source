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
    children: 'Email address',
    size: 'md',
    color: 'primary',
    disabled: false,
    error: false,
    focused: false,
    required: false,
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
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    focused: { control: 'boolean' },
    required: { control: 'boolean' },
    children: { control: 'text' },
    className: { control: false },
    style: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof InputLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '12px',
  minWidth: '280px',
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '24px',
  alignItems: 'center',
};

export const Playground: Story = {
  render: (args) => <InputLabel {...args} />,
};

export const Default: Story = {
  args: {
    children: 'Email address',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputLabel size="sm">Small label</InputLabel>
      <InputLabel size="md">Medium label</InputLabel>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={rowStyle}>
      <InputLabel color="primary">Primary</InputLabel>
      <InputLabel color="secondary">Secondary</InputLabel>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Username',
    disabled: true,
  },
};

export const Error: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputLabel error>Email address</InputLabel>
      <InputLabel error size="sm">
        Password
      </InputLabel>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputLabel required>Full name</InputLabel>
      <InputLabel required size="sm">
        Email address
      </InputLabel>
      <InputLabel required color="secondary">
        Phone number
      </InputLabel>
    </div>
  ),
};

export const Focused: Story = {
  render: () => (
    <div style={rowStyle}>
      <InputLabel focused color="primary">
        Primary focused
      </InputLabel>
      <InputLabel focused color="secondary">
        Secondary focused
      </InputLabel>
    </div>
  ),
};

export const DisabledWithError: Story = {
  args: {
    children: 'Account ID',
    disabled: true,
    error: true,
  },
};

export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputLabel>Billing address line 1 (street and building number)</InputLabel>
      <InputLabel required>
        Emergency contact full name and relationship to account holder
      </InputLabel>
      <InputLabel error>
        Primary email address for account notifications and security alerts
      </InputLabel>
    </div>
  ),
};

export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      {/* htmlFor로 input과 연결 */}
      <div>
        <InputLabel htmlFor="a11y-email">Email address</InputLabel>
        <input
          id="a11y-email"
          type="email"
          placeholder="you@example.com"
          style={{ display: 'block', marginTop: '4px' }}
        />
      </div>
      {/* required asterisk */}
      <div>
        <InputLabel htmlFor="a11y-name" required>
          Full name
        </InputLabel>
        <input
          id="a11y-name"
          type="text"
          placeholder="Jane Smith"
          required
          aria-required="true"
          style={{ display: 'block', marginTop: '4px' }}
        />
      </div>
      {/* error state */}
      <div>
        <InputLabel htmlFor="a11y-password" error>
          Password
        </InputLabel>
        <input
          id="a11y-password"
          type="password"
          aria-invalid="true"
          aria-describedby="a11y-password-error"
          style={{ display: 'block', marginTop: '4px' }}
        />
        <p id="a11y-password-error" style={{ fontSize: '12px', color: '#c00', margin: '4px 0 0' }}>
          Password must be at least 8 characters.
        </p>
      </div>
    </div>
  ),
};
