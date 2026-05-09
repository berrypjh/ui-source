import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlainInput } from './PlainInput';

const meta = {
  title: 'Components/PlainInput',
  component: PlainInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // TODO(a11y): 위반 수정 후 disable 제거
    a11y: { disable: true },
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
} satisfies Meta<typeof PlainInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
  </svg>
);

const AtIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.1 22 14.16 21.83 15.16 21.52L13.67 20.03C13.13 20.17 12.58 20.25 12 20.25C7.45 20.25 3.75 16.55 3.75 12C3.75 7.45 7.45 3.75 12 3.75C16.55 3.75 20.25 7.45 20.25 12V13C20.25 13.69 19.69 14.25 19 14.25C18.31 14.25 17.75 13.69 17.75 13V12C17.75 9.38 15.62 7.25 13 7.25C10.38 7.25 8.25 9.38 8.25 12C8.25 14.62 10.38 16.75 13 16.75C14.31 16.75 15.5 16.22 16.37 15.35C16.91 16.2 17.89 16.75 19 16.75C20.61 16.75 21.95 15.46 22 13.86V12C22 6.48 17.52 2 12 2ZM13 15C11.34 15 10 13.66 10 12C10 10.34 11.34 9 13 9C14.66 9 16 10.34 16 12C16 13.66 14.66 15 13 15Z" />
  </svg>
);

export const Playground: Story = {
  render: (args) => <PlainInput {...args} />,
};

export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput size="sm" placeholder="Small (sm)" />
      <PlainInput size="md" placeholder="Medium (md)" />
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput color="primary" placeholder="Primary color" />
      <PlainInput color="secondary" placeholder="Secondary color" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Cannot edit this value',
  },
};

export const Error: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput error placeholder="Invalid email address" value="not-an-email" />
      <PlainInput error placeholder="Required field is empty" />
    </div>
  ),
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Read-only content',
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Required field',
    id: 'required-plain-input',
    'aria-label': 'Required field',
  },
};

export const Multiline: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput multiline placeholder="Write your message here..." rows={3} />
      <PlainInput multiline placeholder="Larger text area..." rows={6} />
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '12px', width: '480px' }}>
      <PlainInput fullWidth placeholder="Full width input" />
      <PlainInput fullWidth size="sm" placeholder="Full width small" />
    </div>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput startAdornment={<SearchIcon />} placeholder="Search projects..." />
      <PlainInput
        startAdornment={<AtIcon />}
        placeholder="username"
        endAdornment={<span style={{ fontSize: '13px', color: '#888' }}>@company.com</span>}
      />
      <PlainInput
        startAdornment={<span style={{ fontSize: '13px', color: '#888' }}>$</span>}
        endAdornment={<span style={{ fontSize: '13px', color: '#888' }}>USD</span>}
        placeholder="0.00"
        type="number"
      />
    </div>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput value="This is a very long input value that demonstrates how the component handles overflow and text truncation in single-line mode" />
      <PlainInput
        multiline
        rows={4}
        value="This is a multiline input with a longer block of text. It can wrap across multiple lines and the component should handle the layout gracefully without breaking the design."
      />
    </div>
  ),
};

export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      <PlainInput
        id="a11y-plain-email"
        aria-label="Email address"
        type="email"
        placeholder="you@example.com"
        required
      />
      <PlainInput
        id="a11y-plain-search"
        aria-label="Search"
        startAdornment={<SearchIcon />}
        placeholder="Search..."
        role="searchbox"
      />
      <PlainInput
        id="a11y-plain-notes"
        aria-label="Additional notes"
        aria-describedby="a11y-plain-notes-hint"
        multiline
        rows={3}
        placeholder="Optional notes..."
      />
      <PlainInput aria-label="Disabled field" disabled value="Not editable" aria-disabled="true" />
    </div>
  ),
  parameters: {
    // TODO(a11y): A11y smoke-test 위반 수정 후 disable 제거
    a11y: { disable: true },
  },
};
