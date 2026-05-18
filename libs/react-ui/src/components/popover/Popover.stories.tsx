import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popover } from './Popover';
import { PopoverPanel } from './PopoverPanel';
import { PopoverTrigger } from './PopoverTrigger';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    defaultOpen: false,
    children: null,
  },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    open: { control: false },
    onOpenChange: { action: 'open-changed' },
    children: { control: false },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

const wrapperStyle = {
  position: 'relative' as const,
  display: 'inline-block',
};

const panelStyle = {
  position: 'absolute' as const,
  insetBlockStart: '100%',
  insetInlineStart: 0,
  marginBlockStart: '4px',
  minInlineSize: '240px',
};

export const Playground: Story = {
  render: (args) => (
    <div style={wrapperStyle}>
      <Popover {...args}>
        <PopoverTrigger>
          <button type="button">Open Popover</button>
        </PopoverTrigger>
        <PopoverPanel aria-label="Popover content" style={panelStyle}>
          Popover content. Tab으로 진입하거나 바깥을 클릭하거나 Escape로 닫힙니다.
        </PopoverPanel>
      </Popover>
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <Popover>
        <PopoverTrigger>
          <button type="button">Open</button>
        </PopoverTrigger>
        <PopoverPanel aria-labelledby="popover-default-title" style={panelStyle}>
          <div style={{ display: 'grid', gap: '8px' }}>
            <strong id="popover-default-title">Popover title</strong>
            <span>설명을 노출하는 surface입니다.</span>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={wrapperStyle}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <button type="button">{open ? 'Close' : 'Open'}</button>
            </PopoverTrigger>
            <PopoverPanel aria-label="Controlled popover" style={panelStyle}>
              controlled mode (open={String(open)})
            </PopoverPanel>
          </Popover>
        </div>
        <button type="button" onClick={() => setOpen((prev) => !prev)}>
          외부 토글
        </button>
      </div>
    );
  },
};

export const WithMenuRole: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <Popover>
        <PopoverTrigger>
          <button type="button" aria-haspopup="menu">
            Menu
          </button>
        </PopoverTrigger>
        <PopoverPanel asDialog={false} role="menu" aria-label="Actions" style={panelStyle}>
          <button type="button" role="menuitem" style={{ display: 'block', width: '100%' }}>
            Action 1
          </button>
          <button type="button" role="menuitem" style={{ display: 'block', width: '100%' }}>
            Action 2
          </button>
        </PopoverPanel>
      </Popover>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <Popover>
        <PopoverTrigger>
          <button type="button">Open long panel</button>
        </PopoverTrigger>
        <PopoverPanel
          aria-label="Long content popover"
          style={{ ...panelStyle, maxInlineSize: '320px' }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tempor sapien
          eget volutpat. Phasellus tincidunt eros eu erat fermentum, sed scelerisque purus
          sollicitudin.
        </PopoverPanel>
      </Popover>
    </div>
  ),
};
