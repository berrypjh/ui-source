import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchField } from './SearchField';
import type { SearchFieldSuggestion } from './SearchField.types';

const meta = {
  title: 'Components/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // TODO(a11y): 위반 수정 후 disable 제거
    a11y: { disable: true },
  },
  args: {
    placeholder: 'Search',
    variant: 'boxed',
    size: 'md',
    color: 'primary',
    clearable: true,
    disabled: false,
    error: false,
    readOnly: false,
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['plain', 'filled', 'boxed'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    clearable: { control: 'boolean' },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
    onClear: { action: 'cleared' },
    onValueChange: { action: 'valueChanged' },
    onSuggestionSelect: { action: 'suggestionSelected' },
    suggestions: { control: false },
    noSuggestionsText: { control: false },
    inputProps: { control: false },
    inputRef: { control: false },
    className: { control: false },
    style: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

const projectSuggestions: SearchFieldSuggestion[] = [
  { id: '1', label: 'Dashboard', description: 'Main overview page' },
  { id: '2', label: 'Analytics', description: 'Usage metrics and reports' },
  { id: '3', label: 'Settings', description: 'Account and workspace settings' },
  { id: '4', label: 'Team members', description: 'Manage users and permissions' },
];

const simpleSuggestions: SearchFieldSuggestion[] = [
  { id: '1', label: 'React' },
  { id: '2', label: 'TypeScript' },
  { id: '3', label: 'Storybook' },
  { id: '4', label: 'Vite' },
];

const suggestionsWithDisabled: SearchFieldSuggestion[] = [
  { id: '1', label: 'Active project' },
  { id: '2', label: 'Archived project', disabled: true },
  { id: '3', label: 'Another active project' },
  { id: '4', label: 'Locked project', disabled: true },
];

export const Playground: Story = {
  render: (args) => (
    <div style={{ minWidth: '320px' }}>
      <SearchField {...args} />
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <div style={{ minWidth: '320px' }}>
      <SearchField placeholder="Search projects..." />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={columnStyle}>
      <SearchField variant="plain" placeholder="Plain variant" />
      <SearchField variant="filled" placeholder="Filled variant" />
      <SearchField variant="boxed" placeholder="Boxed variant" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <SearchField size="sm" placeholder="Small (sm)" />
      <SearchField size="md" placeholder="Medium (md)" />
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={columnStyle}>
      <SearchField color="primary" placeholder="Primary color" />
      <SearchField color="secondary" placeholder="Secondary color" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ minWidth: '320px' }}>
      <SearchField disabled placeholder="Search is disabled" />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div style={{ minWidth: '320px' }}>
      <SearchField error defaultValue="invalid??query" placeholder="Search" />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div style={{ minWidth: '320px' }}>
      <SearchField readOnly value="TypeScript" />
    </div>
  ),
};

export const WithSuggestions: Story = {
  render: () => (
    <div style={{ minWidth: '320px' }}>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px', marginTop: 0 }}>
        Click or focus the input to see suggestions.
      </p>
      <SearchField
        placeholder="Search pages..."
        suggestions={simpleSuggestions}
        onSuggestionSelect={(s) => console.log('selected', s)}
      />
    </div>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <div style={{ minWidth: '320px' }}>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px', marginTop: 0 }}>
        Click or focus the input to see suggestions with descriptions.
      </p>
      <SearchField
        placeholder="Search features..."
        suggestions={projectSuggestions}
        onSuggestionSelect={(s) => console.log('selected', s)}
      />
    </div>
  ),
};

export const WithDisabledSuggestion: Story = {
  render: () => (
    <div style={{ minWidth: '320px' }}>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px', marginTop: 0 }}>
        Some suggestions are disabled and cannot be selected.
      </p>
      <SearchField
        placeholder="Search projects..."
        suggestions={suggestionsWithDisabled}
        onSuggestionSelect={(s) => console.log('selected', s)}
      />
    </div>
  ),
};

export const WithNoSuggestionsText: Story = {
  render: () => (
    <div style={{ minWidth: '320px' }}>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px', marginTop: 0 }}>
        Focus the input to see the empty state message.
      </p>
      <SearchField placeholder="Search..." suggestions={[]} noSuggestionsText="No results found" />
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '12px', width: '480px' }}>
      <SearchField fullWidth placeholder="Full width search" />
      <SearchField
        fullWidth
        size="sm"
        placeholder="Full width small"
        suggestions={simpleSuggestions}
      />
    </div>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <div style={columnStyle}>
      <SearchField
        defaultValue="This is a very long search query that tests overflow handling in single line mode"
        placeholder="Search..."
      />
      <SearchField
        placeholder="Search across all projects, workspaces, and team members..."
        suggestions={projectSuggestions}
      />
    </div>
  ),
};

export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      {/* combobox role은 자동으로 inputProps에 설정됨 */}
      <SearchField
        id="a11y-search-main"
        aria-label="Search across all pages"
        placeholder="Search..."
        suggestions={simpleSuggestions}
      />
      {/* aria-describedby로 힌트 연결 */}
      <SearchField
        id="a11y-search-hints"
        aria-label="Search projects"
        aria-describedby="a11y-search-hint"
        placeholder="Search projects..."
        suggestions={projectSuggestions}
        noSuggestionsText="No matching projects"
      />
      <SearchField
        aria-label="Search (disabled)"
        disabled
        aria-disabled="true"
        placeholder="Search unavailable"
      />
    </div>
  ),
  parameters: {
    a11y: { disable: false },
  },
};
