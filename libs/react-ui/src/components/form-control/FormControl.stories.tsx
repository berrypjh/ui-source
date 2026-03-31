import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputLabel } from '../input-label';
import { FormHelperText } from '../form-helper-text';
import { BoxedInput } from '../boxed-input';
import { FilledInput } from '../filled-input';
import { PlainInput } from '../plain-input';
import { FormControl } from './FormControl';

const meta = {
  title: 'Components/FormControl',
  component: FormControl,
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
    hiddenLabel: false,
    margin: 'none',
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
    margin: {
      control: 'select',
      options: ['none', 'dense', 'normal'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    hiddenLabel: { control: 'boolean' },
    focused: { control: 'boolean' },
    component: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof FormControl>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

export const Playground: Story = {
  render: (args) => (
    <FormControl {...args}>
      <InputLabel htmlFor="playground-input">Label</InputLabel>
      <BoxedInput id="playground-input" placeholder="Placeholder" />
      <FormHelperText>Helper text</FormHelperText>
    </FormControl>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={columnStyle}>
      <FormControl variant="boxed">
        <InputLabel htmlFor="boxed-input">Boxed</InputLabel>
        <BoxedInput id="boxed-input" placeholder="Boxed input" />
        <FormHelperText>Helper text</FormHelperText>
      </FormControl>
      <FormControl variant="filled">
        <InputLabel htmlFor="filled-input">Filled</InputLabel>
        <FilledInput id="filled-input" placeholder="Filled input" />
        <FormHelperText>Helper text</FormHelperText>
      </FormControl>
      <FormControl variant="plain">
        <InputLabel htmlFor="plain-input">Plain</InputLabel>
        <PlainInput id="plain-input" placeholder="Plain input" />
        <FormHelperText>Helper text</FormHelperText>
      </FormControl>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={columnStyle}>
      <FormControl size="sm">
        <InputLabel htmlFor="size-sm-input">Small</InputLabel>
        <BoxedInput id="size-sm-input" placeholder="Small" />
        <FormHelperText>Helper text</FormHelperText>
      </FormControl>
      <FormControl size="md">
        <InputLabel htmlFor="size-md-input">Medium</InputLabel>
        <BoxedInput id="size-md-input" placeholder="Medium" />
        <FormHelperText>Helper text</FormHelperText>
      </FormControl>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={columnStyle}>
      <FormControl>
        <InputLabel htmlFor="default-input">Default</InputLabel>
        <BoxedInput id="default-input" placeholder="Default" />
        <FormHelperText>Helper text</FormHelperText>
      </FormControl>
      <FormControl disabled>
        <InputLabel htmlFor="disabled-input">Disabled</InputLabel>
        <BoxedInput id="disabled-input" placeholder="Disabled" />
        <FormHelperText>Helper text</FormHelperText>
      </FormControl>
      <FormControl error>
        <InputLabel htmlFor="error-input">Error</InputLabel>
        <BoxedInput id="error-input" placeholder="Error" />
        <FormHelperText>Error message</FormHelperText>
      </FormControl>
      <FormControl required>
        <InputLabel htmlFor="required-input">Required</InputLabel>
        <BoxedInput id="required-input" placeholder="Required" />
        <FormHelperText>This field is required</FormHelperText>
      </FormControl>
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div style={columnStyle}>
      <FormControl fullWidth>
        <InputLabel htmlFor="fullwidth-input">Full Width</InputLabel>
        <BoxedInput id="fullwidth-input" placeholder="Full width input" />
        <FormHelperText>Helper text</FormHelperText>
      </FormControl>
      <FormControl fullWidth error>
        <InputLabel htmlFor="fullwidth-error-input">Full Width Error</InputLabel>
        <BoxedInput id="fullwidth-error-input" placeholder="Full width error" />
        <FormHelperText>Error message</FormHelperText>
      </FormControl>
    </div>
  ),
};
