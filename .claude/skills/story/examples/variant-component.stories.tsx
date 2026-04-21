/**
 * 패턴: variant / size / color / loading이 있는 버튼형 컴포넌트
 * 실제 참조: libs/react-ui/src/components/button/Button.stories.tsx
 *
 * 적용 컴포넌트 예시: Button, IconButton, BubbleButton, Fab
 */
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // 모든 스토리에서 공유할 기본값 — 개별 스토리는 이 위에 덮어쓰기만
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
    variant: { control: 'select', options: ['contained', 'outlined', 'text'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['primary', 'secondary'] },
    loadingPosition: { control: 'select', options: ['start', 'center', 'end'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    onClick: { action: 'clicked' },
    // ReactNode / ref / style 계열은 control: false
    startIcon: { control: false },
    endIcon: { control: false },
    loadingIndicator: { control: false },
    className: { control: false },
    style: { control: false },
    component: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 공유 레이아웃 상수 — render 함수 안에서 인라인 style 대신 사용
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

// Playground: Controls 패널로 자유롭게 조작
export const Playground: Story = {
  render: (args) => <Button {...args} />,
};

// Default: 가장 기본 형태 — 필수 props만, 나머지는 meta.args 기본값
export const Default: Story = {
  args: {
    children: 'Save Changes',
  },
};

// AllVariants: variant union 전체를 한 화면에
export const AllVariants: Story = {
  render: () => (
    <div style={rowStyle}>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
};

// AllSizes: size union 전체
export const AllSizes: Story = {
  render: () => (
    <div style={rowStyle}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// AllColors: variant × color 조합 — 의미 있는 조합만
export const AllColors: Story = {
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Button variant="contained" color="primary">Primary</Button>
        <Button variant="contained" color="secondary">Secondary</Button>
      </div>
      <div style={rowStyle}>
        <Button variant="outlined" color="primary">Primary</Button>
        <Button variant="outlined" color="secondary">Secondary</Button>
      </div>
    </div>
  ),
};

// Disabled: disabled 상태 — 모든 variant에서 확인
export const Disabled: Story = {
  render: () => (
    <div style={rowStyle}>
      <Button variant="contained" disabled>Contained</Button>
      <Button variant="outlined" disabled>Outlined</Button>
      <Button variant="text" disabled>Text</Button>
    </div>
  ),
};

// Loading: loading prop이 있을 때만 — loadingPosition 조합 포함
export const Loading: Story = {
  render: () => (
    <div style={columnStyle}>
      <div style={rowStyle}>
        <Button loading loadingPosition="start">Loading Start</Button>
        <Button loading loadingPosition="center">Loading Center</Button>
        <Button loading loadingPosition="end">Loading End</Button>
      </div>
      <div style={rowStyle}>
        <Button variant="outlined" loading>Outlined</Button>
        <Button variant="text" loading>Text</Button>
      </div>
    </div>
  ),
};

// FullWidth: layout을 'padded'로 교체해서 너비가 보이게
export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '12px', width: '400px' }}>
      <Button fullWidth variant="contained">Create Account</Button>
      <Button fullWidth variant="outlined">Sign In</Button>
    </div>
  ),
};

// WithLongText: 긴 텍스트에서의 레이아웃 확인
export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <Button>Subscribe to the weekly newsletter</Button>
      <Button variant="outlined">Download the complete annual report</Button>
      <Button variant="text">View all available integrations and plugins</Button>
    </div>
  ),
};

// A11y: aria 올바른 사용 예시 — a11y.disable: false 필수
export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      <Button aria-label="Save all pending changes">Save</Button>
      <Button
        variant="outlined"
        aria-label="Delete selected item"
        aria-describedby="delete-warning"
      >
        Delete
      </Button>
      <Button loading aria-busy="true" aria-label="Submitting form, please wait">
        Submit
      </Button>
      <Button disabled aria-disabled="true">
        Unavailable Action
      </Button>
    </div>
  ),
  parameters: {
    a11y: { disable: false },
  },
};
