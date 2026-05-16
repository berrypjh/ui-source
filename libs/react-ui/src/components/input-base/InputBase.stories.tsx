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
    placeholder: 'Enter value',
    size: 'md',
    color: 'primary',
    disabled: false,
    error: false,
    readOnly: false,
    required: false,
    multiline: false,
    fullWidth: false,
    type: 'text',
    'aria-label': 'Input',
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
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    multiline: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
    startAdornment: { control: false },
    endAdornment: { control: false },
    inputProps: { control: false },
    textareaProps: { control: false },
    inputRef: { control: false },
    children: { control: false },
    className: { control: false },
    style: { control: false },
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

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" />
  </svg>
);

export const Playground: Story = {
  render: (args) => <InputBase {...args} />,
};

export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
    'aria-label': 'Name',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase size="sm" placeholder="Small (sm)" aria-label="Small input" />
      <InputBase size="md" placeholder="Medium (md)" aria-label="Medium input" />
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase color="primary" placeholder="Primary color" aria-label="Primary color input" />
      <InputBase
        color="secondary"
        placeholder="Secondary color"
        aria-label="Secondary color input"
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Cannot edit this value',
    'aria-label': 'Disabled input',
  },
};

export const Error: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase
        error
        placeholder="Invalid email address"
        value="not-an-email"
        aria-label="Email address"
        aria-invalid="true"
      />
      <InputBase
        error
        placeholder="Required field is empty"
        aria-label="Required field"
        aria-invalid="true"
      />
    </div>
  ),
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Read-only content',
    'aria-label': 'Read-only input',
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Required field',
    id: 'required-input',
    'aria-label': 'Required field',
  },
};

export const Multiline: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase
        multiline
        placeholder="Write your message here..."
        rows={3}
        aria-label="Short message"
      />
      <InputBase multiline placeholder="Larger text area..." rows={6} aria-label="Long message" />
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '12px', width: '480px' }}>
      <InputBase fullWidth placeholder="Full width input" aria-label="Full width input" />
      <InputBase
        fullWidth
        size="sm"
        placeholder="Full width small"
        aria-label="Full width small input"
      />
    </div>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase
        startAdornment={<SearchIcon />}
        placeholder="Search projects..."
        aria-label="Search projects"
      />
      <InputBase
        endAdornment={<LockIcon />}
        type="password"
        placeholder="Enter password"
        aria-label="Password"
      />
      <InputBase
        startAdornment={<span style={{ fontSize: '13px', color: 'var(--ds-text-light)' }}>$</span>}
        endAdornment={<span style={{ fontSize: '13px', color: 'var(--ds-text-light)' }}>USD</span>}
        placeholder="0.00"
        type="number"
        aria-label="Amount in USD"
      />
    </div>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase
        value="This is a very long input value that demonstrates how the component handles overflow and text truncation in single-line mode"
        aria-label="Long single-line value"
      />
      <InputBase
        multiline
        rows={4}
        value="This is a multiline input with a longer block of text. It can wrap across multiple lines and the component should handle the layout gracefully without breaking the design."
        aria-label="Long multiline value"
      />
    </div>
  ),
};

export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      <InputBase
        id="a11y-email"
        aria-label="Email address"
        type="email"
        placeholder="you@example.com"
        required
      />
      <InputBase
        id="a11y-search"
        aria-label="Search"
        startAdornment={<SearchIcon />}
        placeholder="Search..."
        role="searchbox"
      />
      <InputBase
        id="a11y-notes"
        aria-label="Additional notes"
        aria-describedby="a11y-notes-hint"
        multiline
        rows={3}
        placeholder="Optional notes..."
      />
      <InputBase aria-label="Disabled field" disabled value="Not editable" aria-disabled="true" />
    </div>
  ),
};
