import type { Meta, StoryObj } from '@storybook/react';

import { ButtonBase } from './ButtonBase';

const meta = {
  title: 'Components/ButtonBase',
  component: ButtonBase,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'ButtonBase',
    variant: 'contained',
    size: 'md',
    color: 'primary',
    disabled: false,
    fullWidth: false,
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
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
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
  minWidth: '720px',
};

export const Playground: Story = {
  render: (args) => <ButtonBase {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase variant="contained">Contained</ButtonBase>
      <ButtonBase variant="outlined">Outlined</ButtonBase>
      <ButtonBase variant="text">Text</ButtonBase>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase size="sm">Small</ButtonBase>
      <ButtonBase size="md">Medium</ButtonBase>
      <ButtonBase size="lg">Large</ButtonBase>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase color="primary">Primary</ButtonBase>
      <ButtonBase color="secondary">Secondary</ButtonBase>
      <ButtonBase variant="outlined" color="primary">
        Primary Outlined
      </ButtonBase>
      <ButtonBase variant="outlined" color="secondary">
        Secondary Outlined
      </ButtonBase>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase disabled>Contained</ButtonBase>
      <ButtonBase disabled variant="outlined">
        Outlined
      </ButtonBase>
      <ButtonBase disabled variant="text">
        Text
      </ButtonBase>
    </div>
  ),
};

export const PolymorphicAsDiv: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase component="div">Div Button</ButtonBase>
      <ButtonBase component="div" variant="outlined">
        Div Outlined
      </ButtonBase>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div style={rowStyle}>
      <ButtonBase href="/" target="_blank" rel="noreferrer">
        Anchor Button
      </ButtonBase>
      <ButtonBase href="/" variant="outlined" target="_blank" rel="noreferrer">
        Outlined Link
      </ButtonBase>
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <ButtonBase fullWidth>Full Width Contained</ButtonBase>
      <ButtonBase fullWidth variant="outlined">
        Full Width Outlined
      </ButtonBase>
      <ButtonBase fullWidth variant="text">
        Full Width Text
      </ButtonBase>
    </div>
  ),
};
