import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
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
    loading: false,
    loadingPosition: 'center',
  },
  argTypes: {
    children: {
      control: 'text',
    },
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
    loadingPosition: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    startIcon: {
      control: false,
    },
    endIcon: {
      control: false,
    },
    loadingIndicator: {
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
} satisfies Meta<typeof Button>;

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
  minWidth: '720px',
};

export const Playground: Story = {
  render: (args) => <Button {...args} />,
};

export const WithIcons: Story = {
  render: () => (
    <div style={rowStyle}>
      <Button startIcon={<span aria-hidden="true">←</span>}>Back</Button>
      <Button endIcon={<span aria-hidden="true">→</span>}>Next</Button>
      <Button
        variant="outlined"
        startIcon={<span aria-hidden="true">⭐</span>}
        endIcon={<span aria-hidden="true">↗</span>}
      >
        Action
      </Button>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div style={rowStyle}>
      <Button loading loadingPosition="start" startIcon={<span aria-hidden="true">⬇</span>}>
        Start Loading
      </Button>
      <Button loading loadingPosition="center">
        Center Loading
      </Button>
      <Button loading loadingPosition="end" endIcon={<span aria-hidden="true">→</span>}>
        End Loading
      </Button>
    </div>
  ),
};

export const CustomLoadingIndicator: Story = {
  render: () => (
    <Button
      loading
      loadingPosition="center"
      loadingIndicator={
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1em',
            height: '1em',
            fontSize: '14px',
            lineHeight: 1,
          }}
        >
          ⏳
        </span>
      }
    >
      Uploading
    </Button>
  ),
};

export const VariantsAndColors: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div style={rowStyle}>
        <Button variant="contained" color="primary">
          Primary Contained
        </Button>
        <Button variant="contained" color="secondary">
          Secondary Contained
        </Button>
      </div>

      <div style={rowStyle}>
        <Button variant="outlined" color="primary">
          Primary Outlined
        </Button>
        <Button variant="outlined" color="secondary">
          Secondary Outlined
        </Button>
      </div>

      <div style={rowStyle}>
        <Button variant="text" color="primary">
          Primary Text
        </Button>
        <Button variant="text" color="secondary">
          Secondary Text
        </Button>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={rowStyle}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={rowStyle}>
      <Button disabled>Contained</Button>
      <Button disabled variant="outlined">
        Outlined
      </Button>
      <Button disabled variant="text">
        Text
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div style={rowStyle}>
      <Button href="/" target="_blank" rel="noreferrer">
        Default Link
      </Button>
      <Button href="/" variant="outlined" target="_blank" rel="noreferrer">
        Outlined Link
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <Button fullWidth startIcon={<span aria-hidden="true">📦</span>}>
        Full Width Button
      </Button>
      <Button fullWidth variant="outlined" endIcon={<span aria-hidden="true">→</span>}>
        Continue
      </Button>
      <Button fullWidth variant="text">
        Text Action
      </Button>
    </div>
  ),
};
