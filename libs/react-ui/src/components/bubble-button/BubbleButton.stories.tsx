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
    label: 'Explore',
    icon: <span aria-hidden="true">🫧</span>,
    size: 'md',
    delay: 0,
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
    },
    icon: {
      control: false,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    delay: {
      control: {
        type: 'number',
        min: 0,
        max: 3,
        step: 0.1,
      },
    },
    disabled: {
      control: 'boolean',
    },
    className: {
      control: false,
    },
    children: {
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
    style: {
      control: false,
    },
  },
} satisfies Meta<typeof BubbleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '24px',
  alignItems: 'center',
  justifyContent: 'center',
};

const columnStyle = {
  display: 'grid',
  gap: '28px',
};

export const Playground: Story = {
  render: (args) => <BubbleButton {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div style={rowStyle}>
      <BubbleButton size="sm" icon={<span aria-hidden="true">✨</span>} label="Small" />
      <BubbleButton size="md" icon={<span aria-hidden="true">🫧</span>} label="Medium" />
      <BubbleButton size="lg" icon={<span aria-hidden="true">🌌</span>} label="Large" />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={rowStyle}>
      <BubbleButton icon={<span aria-hidden="true">📘</span>} label="Study" />
      <BubbleButton icon={<span aria-hidden="true">🧠</span>} label="Think" />
      <BubbleButton icon={<span aria-hidden="true">🚀</span>} label="Launch" />
      <BubbleButton icon={<span aria-hidden="true">🎨</span>} label="Design" />
    </div>
  ),
};

export const LabelOnly: Story = {
  render: () => (
    <div style={rowStyle}>
      <BubbleButton label="Focus" />
      <BubbleButton size="lg" label="Archive" />
      <BubbleButton size="sm" label="Start" />
    </div>
  ),
};

export const FloatingDelays: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div
      style={{
        minHeight: '420px',
        display: 'grid',
        placeItems: 'center',
        padding: '32px',
      }}
    >
      <div style={rowStyle}>
        <BubbleButton size="sm" delay={0} icon={<span aria-hidden="true">🌟</span>} label="0s" />
        <BubbleButton
          size="md"
          delay={0.4}
          icon={<span aria-hidden="true">☁️</span>}
          label="0.4s"
        />
        <BubbleButton
          size="lg"
          delay={0.8}
          icon={<span aria-hidden="true">🪐</span>}
          label="0.8s"
        />
        <BubbleButton
          size="md"
          delay={1.2}
          icon={<span aria-hidden="true">🌊</span>}
          label="1.2s"
        />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={rowStyle}>
      <BubbleButton disabled size="sm" icon={<span aria-hidden="true">🔒</span>} label="Locked" />
      <BubbleButton disabled size="md" icon={<span aria-hidden="true">💤</span>} label="Sleeping" />
      <BubbleButton disabled size="lg" icon={<span aria-hidden="true">🧊</span>} label="Frozen" />
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div style={rowStyle}>
      <BubbleButton
        href="https://example.com"
        target="_blank"
        rel="noreferrer"
        icon={<span aria-hidden="true">↗</span>}
        label="Open"
      />
      <BubbleButton
        href="https://example.com"
        target="_blank"
        rel="noreferrer"
        size="lg"
        delay={0.5}
        icon={<span aria-hidden="true">🌍</span>}
        label="Visit"
      />
    </div>
  ),
};

export const Gallery: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <BubbleButton size="sm" delay={0} icon={<span aria-hidden="true">📚</span>} label="Books" />
        <BubbleButton
          size="sm"
          delay={0.2}
          icon={<span aria-hidden="true">🧪</span>}
          label="Labs"
        />
        <BubbleButton
          size="sm"
          delay={0.4}
          icon={<span aria-hidden="true">🧭</span>}
          label="Maps"
        />
      </div>

      <div style={rowStyle}>
        <BubbleButton
          size="md"
          delay={0.1}
          icon={<span aria-hidden="true">🎯</span>}
          label="Goals"
        />
        <BubbleButton
          size="md"
          delay={0.5}
          icon={<span aria-hidden="true">💡</span>}
          label="Ideas"
        />
        <BubbleButton
          size="md"
          delay={0.9}
          icon={<span aria-hidden="true">🛰️</span>}
          label="Signals"
        />
      </div>

      <div style={rowStyle}>
        <BubbleButton
          size="lg"
          delay={0.3}
          icon={<span aria-hidden="true">🌠</span>}
          label="Galaxy"
        />
        <BubbleButton
          size="lg"
          delay={0.7}
          icon={<span aria-hidden="true">🔮</span>}
          label="Future"
        />
      </div>
    </div>
  ),
};
