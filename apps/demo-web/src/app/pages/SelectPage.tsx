import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@berrypjh/react-ui';

import { Page, Preview, Section } from '../shell/ui';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

const LabeledSelect = ({
  label,
  variant = 'boxed',
  size,
  error,
  disabled,
  required,
  helperText,
  placeholder = 'Choose...',
}: {
  label: string;
  variant?: 'boxed' | 'filled' | 'plain';
  size?: 'sm' | 'md';
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
}) => (
  <FormControl variant={variant} size={size} error={error} disabled={disabled} required={required}>
    <InputLabel>{label}</InputLabel>
    <Select placeholder={placeholder}>
      {FRUITS.map((f) => (
        <MenuItem key={f} value={f}>
          {f}
        </MenuItem>
      ))}
    </Select>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

export const SelectPage = () => (
  <Page title="Select" lead="Select는 드롭다운 리스트에서 옵션을 선택할 수 있는 컴포넌트입니다.">
    <Section title="Variants" note="Boxed, Filled, Plain">
      <Preview>
        <LabeledSelect label="Boxed" variant="boxed" />
        <LabeledSelect label="Filled" variant="filled" />
        <LabeledSelect label="Plain" variant="plain" />
      </Preview>
    </Section>

    <Section title="Sizes" note="Small, Medium">
      <Preview>
        <LabeledSelect label="Small" size="sm" />
        <LabeledSelect label="Medium" size="md" />
      </Preview>
    </Section>

    <Section title="States" note="Error, Disabled, Required">
      <Preview>
        <LabeledSelect label="Error" error helperText="Selection is required" />
        <LabeledSelect label="Disabled" disabled />
        <LabeledSelect label="Required" required />
      </Preview>
    </Section>

    <Section title="Full Width">
      <Preview>
        <div style={{ width: '100%' }}>
          <FormControl variant="boxed" fullWidth>
            <InputLabel>Full Width</InputLabel>
            <Select placeholder="Choose an option">
              {FRUITS.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Preview>
    </Section>
  </Page>
);
