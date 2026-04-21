/**
 * 패턴: children을 직접 전달하는 컴포넌트 (render 함수 기반 스토리)
 * 실제 참조: libs/react-ui/src/components/select/Select.stories.tsx
 *
 * 적용 컴포넌트 예시: Select, Menu, Tabs, Accordion
 *
 * 핵심 차이점:
 * - children이 ReactNode이므로 Playground도 render 함수로 작성
 * - Default 역시 args 대신 render로 실제 children 포함
 * - argTypes.children은 control: false
 */
import type { Meta, StoryObj } from '@storybook/react-vite';

import { MenuItem } from '../menu-item';
import { Select } from '../select/Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'boxed',
    size: 'md',
    color: 'primary',
    disabled: false,
    error: false,
    required: false,
    fullWidth: false,
    multiple: false,
    displayEmpty: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['plain', 'filled', 'boxed'] },
    size: { control: 'select', options: ['sm', 'md'] },
    color: { control: 'select', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    multiple: { control: 'boolean' },
    displayEmpty: { control: 'boolean' },
    onChange: { action: 'changed' },
    onOpen: { action: 'opened' },
    onClose: { action: 'closed' },
    // children이 있는 컴포넌트는 이 props들을 control: false로
    children: { control: false },
    renderValue: { control: false },
    placeholder: { control: false },
    className: { control: false },
    style: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '280px',
};

// Playground: children이 있어서 render 함수로 작성 (args spread + 기본 children 포함)
export const Playground: Story = {
  render: (args) => (
    <Select {...args} defaultValue="react">
      <MenuItem value="react">React</MenuItem>
      <MenuItem value="vue">Vue</MenuItem>
      <MenuItem value="angular">Angular</MenuItem>
    </Select>
  ),
};

// Default: args 대신 render로 — children 없이는 의미 없는 컴포넌트
export const Default: Story = {
  render: () => (
    <Select defaultValue="monthly">
      <MenuItem value="daily">Daily</MenuItem>
      <MenuItem value="weekly">Weekly</MenuItem>
      <MenuItem value="monthly">Monthly</MenuItem>
      <MenuItem value="yearly">Yearly</MenuItem>
    </Select>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={columnStyle}>
      <Select variant="plain" defaultValue="option1">
        <MenuItem value="option1">Plain variant</MenuItem>
        <MenuItem value="option2">Option 2</MenuItem>
      </Select>
      <Select variant="filled" defaultValue="option1">
        <MenuItem value="option1">Filled variant</MenuItem>
        <MenuItem value="option2">Option 2</MenuItem>
      </Select>
      <Select variant="boxed" defaultValue="option1">
        <MenuItem value="option1">Boxed variant</MenuItem>
        <MenuItem value="option2">Option 2</MenuItem>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="weekly">
      <MenuItem value="daily">Daily</MenuItem>
      <MenuItem value="weekly">Weekly</MenuItem>
      <MenuItem value="monthly">Monthly</MenuItem>
    </Select>
  ),
};

export const Error: Story = {
  render: () => (
    <div style={columnStyle}>
      <Select error defaultValue="">
        <MenuItem value="">Select a role</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="member">Member</MenuItem>
      </Select>
    </div>
  ),
};

// FullWidth: layout 'padded' 필수
export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '12px', width: '480px' }}>
      <Select fullWidth defaultValue="monthly">
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </Select>
    </div>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <Select defaultValue="very-long">
        <MenuItem value="short">Short</MenuItem>
        <MenuItem value="very-long">
          This is a very long option label that tests overflow handling
        </MenuItem>
        <MenuItem value="another">Another option</MenuItem>
      </Select>
    </div>
  ),
};

// A11y: label + labelId + htmlFor 연결 패턴
export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      <div>
        <label
          id="a11y-role-label"
          htmlFor="a11y-role-select"
          style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}
        >
          User role
        </label>
        <Select
          id="a11y-role-select"
          labelId="a11y-role-label"
          defaultValue="viewer"
          aria-describedby="a11y-role-hint"
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="editor">Editor</MenuItem>
          <MenuItem value="viewer">Viewer</MenuItem>
        </Select>
        <p id="a11y-role-hint" style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>
          Admins have full access to all settings.
        </p>
      </div>
      <div>
        <label
          id="a11y-status-label"
          htmlFor="a11y-status-select"
          style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}
        >
          Status
        </label>
        <Select
          id="a11y-status-select"
          labelId="a11y-status-label"
          error
          defaultValue=""
          aria-describedby="a11y-status-error"
        >
          <MenuItem value="">Select status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
        <p id="a11y-status-error" style={{ fontSize: '12px', color: 'red', margin: '4px 0 0' }}>
          Please select a valid status.
        </p>
      </div>
    </div>
  ),
  parameters: {
    a11y: { disable: false },
  },
};
