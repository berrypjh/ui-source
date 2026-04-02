import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonBase } from './ButtonBase';

const meta = {
  title: 'Components/ButtonBase',
  component: ButtonBase,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Button',
    variant: 'contained',
    size: 'md',
    color: 'primary',
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onClick: { action: 'clicked' },
    onKeyDown: { action: 'keyDown' },
    onKeyUp: { action: 'keyUp' },
    className: { control: false },
    style: { control: false },
    component: { control: false },
    children: { control: 'text' },
  },
} satisfies Meta<typeof ButtonBase>;

export default meta;

type Story = StoryObj<typeof meta>;

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
  alignItems: 'center',
};

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

export const Playground: Story = {
  render: (args) => <ButtonBase {...args} />,
};

export const Default: Story = {
  args: {
    children: 'Save Changes',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase variant="contained">Contained</ButtonBase>
      <ButtonBase variant="outlined">Outlined</ButtonBase>
      <ButtonBase variant="text">Text</ButtonBase>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase size="sm">Small</ButtonBase>
      <ButtonBase size="md">Medium</ButtonBase>
      <ButtonBase size="lg">Large</ButtonBase>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <ButtonBase variant="contained" color="primary">
          Primary
        </ButtonBase>
        <ButtonBase variant="contained" color="secondary">
          Secondary
        </ButtonBase>
      </div>
      <div style={rowStyle}>
        <ButtonBase variant="outlined" color="primary">
          Primary
        </ButtonBase>
        <ButtonBase variant="outlined" color="secondary">
          Secondary
        </ButtonBase>
      </div>
      <div style={rowStyle}>
        <ButtonBase variant="text" color="primary">
          Primary
        </ButtonBase>
        <ButtonBase variant="text" color="secondary">
          Secondary
        </ButtonBase>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase variant="contained" disabled>
        Contained
      </ButtonBase>
      <ButtonBase variant="outlined" disabled>
        Outlined
      </ButtonBase>
      <ButtonBase variant="text" disabled>
        Text
      </ButtonBase>
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '12px', width: '400px' }}>
      <ButtonBase fullWidth variant="contained">
        Create Account
      </ButtonBase>
      <ButtonBase fullWidth variant="outlined">
        Sign In
      </ButtonBase>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase href="https://example.com" variant="contained">
        Visit Site
      </ButtonBase>
      <ButtonBase href="https://example.com" variant="outlined">
        Documentation
      </ButtonBase>
      <ButtonBase href="https://example.com" variant="text">
        Learn More
      </ButtonBase>
    </div>
  ),
};

export const AsCustomComponent: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase component="div" variant="contained">
        div element
      </ButtonBase>
      <ButtonBase component="span" variant="outlined">
        span element
      </ButtonBase>
    </div>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <ButtonBase variant="contained">Subscribe to the weekly newsletter</ButtonBase>
      <ButtonBase variant="outlined">Download the complete annual report</ButtonBase>
      <ButtonBase variant="text">View all available integrations and plugins</ButtonBase>
    </div>
  ),
};

export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      <ButtonBase aria-label="Save all pending changes">Save</ButtonBase>
      <ButtonBase
        variant="outlined"
        aria-label="Delete selected item"
        aria-describedby="delete-warning"
      >
        Delete
      </ButtonBase>
      <ButtonBase
        component="div"
        variant="text"
        role="button"
        aria-label="Custom interactive element"
      >
        Custom Element
      </ButtonBase>
      <ButtonBase disabled aria-disabled="true">
        Unavailable
      </ButtonBase>
    </div>
  ),
  parameters: {
    a11y: { disable: false },
  },
};
