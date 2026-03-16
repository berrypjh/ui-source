import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fab } from './Fab';

const meta = {
  title: 'Components/Fab',
  component: Fab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    'aria-label': 'create',
    color: 'primary',
    size: 'lg',
    shape: 'circular',
    icon: <span aria-hidden="true">＋</span>,
    children: undefined,
    disabled: false,
  },
  argTypes: {
    children: {
      control: 'text',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    shape: {
      control: 'select',
      options: ['circular', 'extended'],
    },
    icon: {
      control: false,
    },
    disabled: {
      control: 'boolean',
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
} satisfies Meta<typeof Fab>;

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
  render: (args) => <Fab {...args} />,
};

export const Circular: Story = {
  render: () => (
    <div style={rowStyle}>
      <Fab aria-label="add" icon={<span aria-hidden="true">＋</span>} />
      <Fab aria-label="edit" color="secondary" icon={<span aria-hidden="true">✎</span>} />
      <Fab aria-label="favorite" size="sm" icon={<span aria-hidden="true">♥</span>} />
      <Fab aria-label="settings" size="md" icon={<span aria-hidden="true">⚙</span>} />
    </div>
  ),
};

export const Extended: Story = {
  render: () => (
    <div style={rowStyle}>
      <Fab shape="extended" icon={<span aria-hidden="true">＋</span>}>
        Create
      </Fab>

      <Fab shape="extended" color="secondary" icon={<span aria-hidden="true">✉</span>}>
        Send
      </Fab>

      <Fab shape="extended" size="sm" icon={<span aria-hidden="true">⬇</span>}>
        Download
      </Fab>

      <Fab shape="extended" size="md" icon={<span aria-hidden="true">↗</span>}>
        Share
      </Fab>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Fab aria-label="small add" size="sm" icon={<span aria-hidden="true">＋</span>} />
        <Fab aria-label="medium add" size="md" icon={<span aria-hidden="true">＋</span>} />
        <Fab aria-label="large add" size="lg" icon={<span aria-hidden="true">＋</span>} />
      </div>

      <div style={rowStyle}>
        <Fab shape="extended" size="sm" icon={<span aria-hidden="true">＋</span>}>
          Small
        </Fab>
        <Fab shape="extended" size="md" icon={<span aria-hidden="true">＋</span>}>
          Medium
        </Fab>
        <Fab shape="extended" size="lg" icon={<span aria-hidden="true">＋</span>}>
          Large
        </Fab>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Fab aria-label="primary add" color="primary" icon={<span aria-hidden="true">＋</span>} />
        <Fab
          aria-label="secondary add"
          color="secondary"
          icon={<span aria-hidden="true">＋</span>}
        />
      </div>

      <div style={rowStyle}>
        <Fab shape="extended" color="primary" icon={<span aria-hidden="true">★</span>}>
          Primary
        </Fab>
        <Fab shape="extended" color="secondary" icon={<span aria-hidden="true">★</span>}>
          Secondary
        </Fab>
      </div>
    </div>
  ),
};

export const IconAndLabelCombinations: Story = {
  render: () => (
    <div style={rowStyle}>
      <Fab shape="extended" icon={<span aria-hidden="true">＋</span>}>
        Add item
      </Fab>

      <Fab shape="extended">Label only</Fab>

      <Fab aria-label="favorite" icon={<span aria-hidden="true">♥</span>} />

      <Fab shape="extended" color="secondary">
        Text only
      </Fab>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={rowStyle}>
      <Fab disabled aria-label="disabled create" icon={<span aria-hidden="true">＋</span>} />
      <Fab
        disabled
        color="secondary"
        aria-label="disabled settings"
        icon={<span aria-hidden="true">⚙</span>}
      />
      <Fab disabled shape="extended" icon={<span aria-hidden="true">✉</span>}>
        Disabled
      </Fab>
      <Fab disabled shape="extended" color="secondary" icon={<span aria-hidden="true">★</span>}>
        Secondary Disabled
      </Fab>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div style={rowStyle}>
      <Fab
        href="/"
        target="_blank"
        rel="noreferrer"
        aria-label="open create page"
        icon={<span aria-hidden="true">↗</span>}
      />

      <Fab
        href="/"
        target="_blank"
        rel="noreferrer"
        shape="extended"
        icon={<span aria-hidden="true">↗</span>}
      >
        Open Link
      </Fab>
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div style={rowStyle}>
      <Fab aria-label="add" icon={<span aria-hidden="true">＋</span>} />
      <Fab aria-label="edit" icon={<span aria-hidden="true">✎</span>} />
      <Fab aria-label="share" icon={<span aria-hidden="true">↗</span>} />
      <Fab aria-label="favorite" color="secondary" icon={<span aria-hidden="true">♥</span>} />
      <Fab shape="extended" icon={<span aria-hidden="true">✉</span>}>
        Message
      </Fab>
      <Fab shape="extended" color="secondary" icon={<span aria-hidden="true">⚙</span>}>
        Settings
      </Fab>
    </div>
  ),
};
