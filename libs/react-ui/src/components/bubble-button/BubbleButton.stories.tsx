import type { Meta, StoryObj } from '@storybook/react-vite';

import { BubbleButton } from './BubbleButton';

const meta = {
  title: 'Components/BubbleButton',
  component: BubbleButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Get Started',
    size: 'md',
    color: 'primary',
    disabled: false,
    fullWidth: false,
    delay: 0,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    delay: { control: { type: 'number', min: 0, max: 5, step: 0.1 } },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onClick: { action: 'clicked' },
    icon: { control: false },
    label: { control: 'text' },
    className: { control: false },
    style: { control: false },
    component: { control: false },
  },
} satisfies Meta<typeof BubbleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '16px',
  alignItems: 'center',
};

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

export const Playground: Story = {
  render: (args) => <BubbleButton {...args} />,
};

export const Default: Story = {
  args: {
    label: 'Get Started',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={rowStyle}>
      <BubbleButton size="sm" label="Small" />
      <BubbleButton size="md" label="Medium" />
      <BubbleButton size="lg" label="Large" />
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={rowStyle}>
      <BubbleButton color="primary" label="Primary" />
      <BubbleButton color="secondary" label="Secondary" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable',
    disabled: true,
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Full Width Button',
    fullWidth: true,
  },
};

export const WithIcon: Story = {
  render: () => (
    <div style={rowStyle}>
      <BubbleButton
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        }
        label="Starred"
      />
      <BubbleButton
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17L5 13L6.41 11.59L9 14.17L17.59 5.58L19 7L9 17Z" />
          </svg>
        }
        label="Confirm"
      />
      <BubbleButton label="No Icon" />
    </div>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <div style={rowStyle}>
      <BubbleButton delay={0} label="No Delay" />
      <BubbleButton delay={0.3} label="0.3s Delay" />
      <BubbleButton delay={0.6} label="0.6s Delay" />
    </div>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <BubbleButton label="Subscribe to our weekly newsletter" />
      <BubbleButton size="sm" label="Download the complete report" />
      <BubbleButton
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 20H19V18H5M19 9H15V3H9V9H5L12 16L19 9Z" />
          </svg>
        }
        label="Download the complete report as PDF"
      />
    </div>
  ),
};

export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      <BubbleButton label="Save changes" aria-label="Save all pending changes" />
      <BubbleButton
        label="Delete"
        aria-label="Delete selected item"
        aria-describedby="delete-hint"
      />
      <BubbleButton label="Submit" disabled aria-disabled="true" />
    </div>
  ),
  parameters: {
    a11y: { disable: false },
  },
};
