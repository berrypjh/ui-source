import type { Meta, StoryObj } from '@storybook/react-vite';

import { SkipLink } from './SkipLink';

const meta = {
  title: 'Components/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    targetId: 'main-content',
    children: '본문으로 건너뛰기',
  },
  argTypes: {
    targetId: { control: 'text' },
    children: { control: 'text' },
    className: { control: false },
    style: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof SkipLink>;

export default meta;

type Story = StoryObj<typeof meta>;

const layoutStyle = {
  display: 'grid',
  gap: '12px',
};

const dummyMain = {
  border: '1px dashed #ccc',
  padding: '24px',
  borderRadius: '4px',
} as const;

export const Playground: Story = {
  render: (args) => (
    <div style={layoutStyle}>
      <header style={{ ...dummyMain, background: '#fafafa' }}>
        <SkipLink {...args} />
        Header (반복 영역)
      </header>
      <main id="main-content" style={dummyMain} tabIndex={-1}>
        Main content. Tab 키로 페이지에 진입해 SkipLink가 노출되는지 확인합니다.
      </main>
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <div style={layoutStyle}>
      <header style={{ ...dummyMain, background: '#fafafa' }}>
        <SkipLink targetId="main-default">본문으로 건너뛰기</SkipLink>
        Header
      </header>
      <main id="main-default" style={dummyMain} tabIndex={-1}>
        Main content
      </main>
    </div>
  ),
};

export const MultipleTargets: Story = {
  render: () => (
    <div style={layoutStyle}>
      <header style={{ ...dummyMain, background: '#fafafa' }}>
        <SkipLink targetId="multi-main">본문으로 건너뛰기</SkipLink>
        <SkipLink targetId="multi-nav">내비게이션으로 건너뛰기</SkipLink>
        Header
      </header>
      <nav id="multi-nav" style={dummyMain} tabIndex={-1} aria-label="Primary">
        Navigation
      </nav>
      <main id="multi-main" style={dummyMain} tabIndex={-1}>
        Main content
      </main>
    </div>
  ),
};

export const A11y: Story = {
  render: () => (
    <div style={layoutStyle}>
      <header style={{ ...dummyMain, background: '#fafafa' }}>
        <SkipLink targetId="a11y-main" aria-label="페이지 본문으로 건너뛰기">
          본문으로 건너뛰기
        </SkipLink>
        Header
      </header>
      <main id="a11y-main" style={dummyMain} tabIndex={-1}>
        Main content
      </main>
    </div>
  ),
};
