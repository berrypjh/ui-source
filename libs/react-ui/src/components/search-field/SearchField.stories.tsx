import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchField } from './SearchField';

const meta = {
  title: 'Components/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    placeholder: 'Search',
    variant: 'boxed',
    size: 'md',
    color: 'primary',
    disabled: false,
    error: false,
    fullWidth: false,
    clearable: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['boxed', 'filled', 'plain'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    clearable: { control: 'boolean' },
    suggestions: { control: false },
    inputProps: { control: false },
    inputRef: { control: false },
    onClear: { control: false },
    onValueChange: { control: false },
    onSuggestionSelect: { control: false },
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

const suggestions = [
  { id: '1', label: 'Apple' },
  { id: '2', label: 'Banana', description: 'Yellow fruit' },
  { id: '3', label: 'Cherry', description: 'Small red fruit' },
  { id: '4', label: 'Disabled option', disabled: true },
];

export const Playground: Story = {
  render: (args) => <SearchField {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div style={columnStyle}>
      <SearchField variant="boxed" placeholder="Boxed" />
      <SearchField variant="filled" placeholder="Filled" />
      <SearchField variant="plain" placeholder="Plain" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <SearchField size="sm" placeholder="Small" />
      <SearchField size="md" placeholder="Medium" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={columnStyle}>
      <SearchField placeholder="Default" />
      <SearchField placeholder="Disabled" disabled />
      <SearchField placeholder="Error" error />
    </div>
  ),
};

export const WithSuggestions: Story = {
  render: () => (
    <div style={{ ...columnStyle, minWidth: '320px' }}>
      <SearchField
        defaultValue="a"
        suggestions={suggestions}
        onSuggestionSelect={(s) => console.log('selected', s)}
      />
    </div>
  ),
};

export const NoSuggestionsText: Story = {
  render: () => (
    <SearchField
      defaultValue="xyz"
      suggestions={[]}
      noSuggestionsText="No results found"
    />
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <SearchField fullWidth placeholder="Full width search" />
      <SearchField fullWidth placeholder="Full width with suggestions" suggestions={suggestions} />
    </div>
  ),
};
