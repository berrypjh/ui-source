import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    'aria-label': 'favorite',
    children: <span aria-hidden="true">★</span>,
    color: 'primary',
    size: 'md',
    edge: false,
    disabled: false,
    loading: null,
  },
  argTypes: {
    children: {
      control: false,
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    edge: {
      control: 'select',
      options: [false, 'start', 'end'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'select',
      options: [null, true, false],
    },
    loadingIndicator: {
      control: false,
    },
    className: {
      control: false,
    },
    component: {
      control: false,
    },
    href: {
      control: false,
    },
    ref: {
      control: false,
    },
  },
} satisfies Meta<typeof IconButton>;

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
  gap: '20px',
};

export const Playground: Story = {
  render: (args) => <IconButton {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div style={rowStyle}>
      <IconButton size="sm" aria-label="small favorite">
        <span aria-hidden="true">★</span>
      </IconButton>

      <IconButton size="md" aria-label="medium favorite">
        <span aria-hidden="true">★</span>
      </IconButton>

      <IconButton size="lg" aria-label="large favorite">
        <span aria-hidden="true">★</span>
      </IconButton>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={rowStyle}>
      <IconButton color="primary" aria-label="primary favorite">
        <span aria-hidden="true">★</span>
      </IconButton>

      <IconButton color="secondary" aria-label="secondary favorite">
        <span aria-hidden="true">★</span>
      </IconButton>
    </div>
  ),
};

export const EdgeOffsets: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          border: '1px solid var(--ds-neutral-ne300)',
          borderRadius: '12px',
          maxWidth: '420px',
        }}
      >
        <IconButton edge="start" aria-label="go back">
          <span aria-hidden="true">←</span>
        </IconButton>
        <span>Start edge aligned action</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '12px 16px',
          border: '1px solid var(--ds-neutral-ne300)',
          borderRadius: '12px',
          maxWidth: '420px',
        }}
      >
        <span>End edge aligned action</span>
        <IconButton edge="end" aria-label="more options">
          <span aria-hidden="true">⋯</span>
        </IconButton>
      </div>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div style={rowStyle}>
      <IconButton loading={true} aria-label="loading favorite">
        <span aria-hidden="true">★</span>
      </IconButton>

      <IconButton loading={false} aria-label="not loading favorite">
        <span aria-hidden="true">★</span>
      </IconButton>

      <IconButton
        loading={true}
        color="secondary"
        aria-label="custom loading indicator"
        loadingIndicator={
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1em',
              height: '1em',
              fontSize: '0.85em',
              lineHeight: 1,
            }}
          >
            ⏳
          </span>
        }
      >
        <span aria-hidden="true">★</span>
      </IconButton>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={rowStyle}>
      <IconButton disabled aria-label="disabled primary">
        <span aria-hidden="true">↗</span>
      </IconButton>

      <IconButton disabled color="secondary" aria-label="disabled secondary">
        <span aria-hidden="true">★</span>
      </IconButton>

      <IconButton disabled size="lg" aria-label="disabled large">
        <span aria-hidden="true">⚙</span>
      </IconButton>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div style={rowStyle}>
      <IconButton
        href="https://example.com"
        target="_blank"
        rel="noreferrer"
        aria-label="open external link"
      >
        <span aria-hidden="true">↗</span>
      </IconButton>

      <IconButton
        href="https://example.com"
        target="_blank"
        rel="noreferrer"
        color="secondary"
        size="lg"
        aria-label="open settings link"
      >
        <span aria-hidden="true">⚙</span>
      </IconButton>
    </div>
  ),
};

export const IconGallery: Story = {
  render: () => (
    <div style={rowStyle}>
      <IconButton aria-label="search">
        <span aria-hidden="true">⌕</span>
      </IconButton>

      <IconButton aria-label="edit">
        <span aria-hidden="true">✎</span>
      </IconButton>

      <IconButton aria-label="delete" color="secondary">
        <span aria-hidden="true">🗑</span>
      </IconButton>

      <IconButton aria-label="favorite" size="lg">
        <span aria-hidden="true">♥</span>
      </IconButton>
    </div>
  ),
};
