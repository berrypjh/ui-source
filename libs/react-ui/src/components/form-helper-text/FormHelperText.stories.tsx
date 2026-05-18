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
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    children: { control: 'text' },
    className: { control: false },
    style: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof FormHelperText>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '8px',
  minWidth: '320px',
};

export const Playground: Story = {
  render: (args) => <FormHelperText {...args} />,
};

export const Default: Story = {
  args: {
    children: 'We will never share your email with anyone.',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <FormHelperText size="sm">Small helper text</FormHelperText>
      <FormHelperText size="md">Medium helper text</FormHelperText>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'This field is currently disabled.',
    disabled: true,
  },
};

export const Error: Story = {
  render: () => (
    <div style={columnStyle}>
      <FormHelperText error>Please enter a valid email address.</FormHelperText>
      <FormHelperText error>Password must be at least 8 characters.</FormHelperText>
      <FormHelperText error size="sm">
        This field is required.
      </FormHelperText>
    </div>
  ),
};

export const DisabledWithError: Story = {
  args: {
    children: 'Field is disabled and has an error.',
    disabled: true,
    error: true,
  },
};

export const Empty: Story = {
  render: () => (
    <div style={columnStyle}>
      <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
        Space character renders a zero-width space (preserves layout height):
      </p>
      <FormHelperText> </FormHelperText>
      <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
        Normal helper text for comparison:
      </p>
      <FormHelperText>Normal helper text</FormHelperText>
    </div>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <FormHelperText>
        Your password must be at least 8 characters long and include one uppercase letter, one
        number, and one special character.
      </FormHelperText>
      <FormHelperText error>
        The email address you entered is already associated with an existing account. Please sign in
        or use a different email address.
      </FormHelperText>
    </div>
  ),
};

export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      {/* id로 연결해 aria-describedby에서 참조 */}
      <div>
        <label htmlFor="a11y-email" style={{ display: 'block', marginBottom: '4px' }}>
          Email address
        </label>
        <input
          id="a11y-email"
          type="email"
          placeholder="you@example.com"
          aria-describedby="a11y-email-helper"
          style={{ display: 'block', marginBottom: '4px' }}
        />
        <FormHelperText id="a11y-email-helper">
          Enter the email address you used to register.
        </FormHelperText>
      </div>
      <div>
        <label htmlFor="a11y-password" style={{ display: 'block', marginBottom: '4px' }}>
          Password
        </label>
        <input
          id="a11y-password"
          type="password"
          placeholder="Password"
          aria-invalid="true"
          aria-describedby="a11y-password-error"
          style={{ display: 'block', marginBottom: '4px' }}
        />
        <FormHelperText id="a11y-password-error" error role="alert">
          Password must be at least 8 characters.
        </FormHelperText>
      </div>
    </div>
  ),
};
