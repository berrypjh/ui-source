import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThemeProvider } from './ThemeProvider';
import { Button } from '../components/button/Button';

const meta = {
  title: 'Theme/ThemeProvider',
  component: ThemeProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    disableThemeDecorator: true,
  },
  args: {
    mode: 'global',
    children: null,
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['global', 'dark'],
    },
    children: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle = {
  display: 'grid',
  gap: '16px',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid var(--ds-neutral-ne300)',
  background: 'var(--ds-neutral-ne100)',
  color: 'var(--ds-text-default)',
  minWidth: '320px',
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: 1.4,
};

const bodyStyle = {
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.6,
  color: 'var(--ds-text-light)',
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
  alignItems: 'center',
};

export const Playground: Story = {
  args: {
    children: null,
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <div
        style={{
          ...surfaceStyle,
          background: args.mode === 'dark' ? 'var(--ds-neutral-ne800)' : '#ffffff',
          borderColor:
            args.mode === 'dark' ? 'var(--ds-neutral-ne700)' : 'var(--ds-neutral-ne300)',
          color: args.mode === 'dark' ? 'var(--ds-text-contrast-text)' : 'var(--ds-text-default)',
        }}
      >
        <div style={{ display: 'grid', gap: '8px' }}>
          <h2 style={sectionTitleStyle}>ThemeProvider</h2>
          <p
            style={{
              ...bodyStyle,
              color: args.mode === 'dark' ? 'var(--ds-neutral-ne300)' : 'var(--ds-text-light)',
            }}
          >
            <code>data-theme</code> 변경에 따라 내부 컴포넌트가 어떻게 반응하는지 확인하기 위한
            예시
          </p>
        </div>
        <div style={rowStyle}>
          <Button variant="contained" color="primary">
            Button
          </Button>
          <Button variant="outlined" color="secondary">
            Secondary
          </Button>
          <Button loading loadingPosition="start" startIcon={<>*</>}>
            Loading
          </Button>
        </div>
      </div>
    </ThemeProvider>
  ),
};

export const Default: Story = {
  args: {
    mode: 'global',
    children: null,
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <div style={{ ...surfaceStyle, background: '#ffffff' }}>
        <h3 style={sectionTitleStyle}>Global Theme</h3>
        <div style={rowStyle}>
          <Button>Button</Button>
          <Button variant="outlined">Button</Button>
        </div>
      </div>
    </ThemeProvider>
  ),
};

export const AllModes: Story = {
  args: {
    children: null,
  },
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <ThemeProvider mode="global">
        <div style={{ ...surfaceStyle, background: '#ffffff' }}>
          <h3 style={sectionTitleStyle}>Global</h3>
          <div style={rowStyle}>
            <Button variant="contained">Button</Button>
            <Button variant="outlined">Button</Button>
          </div>
        </div>
      </ThemeProvider>

      <ThemeProvider mode="dark">
        <div
          style={{
            ...surfaceStyle,
            background: 'var(--ds-neutral-ne800)',
            borderColor: 'var(--ds-neutral-ne700)',
            color: 'var(--ds-text-contrast-text)',
          }}
        >
          <h3 style={{ ...sectionTitleStyle, color: 'var(--ds-text-contrast-text)' }}>Dark</h3>
          <div style={rowStyle}>
            <Button variant="contained">Button</Button>
            <Button variant="outlined">Button</Button>
          </div>
        </div>
      </ThemeProvider>
    </div>
  ),
};

export const NestedThemeExample: Story = {
  args: {
    children: null,
  },
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <ThemeProvider mode="global">
      <div
        style={{
          ...surfaceStyle,
          background: '#ffffff',
          gap: '24px',
        }}
      >
        <h3 style={sectionTitleStyle}>Global (Outer)</h3>
        <div style={rowStyle}>
          <Button>Button</Button>
          <Button variant="outlined">Button</Button>
        </div>

        <ThemeProvider mode="dark">
          <div
            style={{
              ...surfaceStyle,
              background: 'var(--ds-neutral-ne800)',
              borderColor: 'var(--ds-neutral-ne700)',
              color: 'var(--ds-text-contrast-text)',
            }}
          >
            <h3 style={{ ...sectionTitleStyle, color: 'var(--ds-text-contrast-text)' }}>
              Dark (Inner)
            </h3>
            <div style={rowStyle}>
              <Button>Button</Button>
              <Button variant="outlined">Button</Button>
            </div>
          </div>
        </ThemeProvider>
      </div>
    </ThemeProvider>
  ),
};
