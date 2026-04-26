import { FormControl, FormHelperText, InputLabel, Select, MenuItem } from '@berrypjh/react-ui';
import { DemoSection, PageHeader } from '../components/DemoSection';

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
  <div>
    <PageHeader
      badge="Component"
      title="Select"
      description="Select는 드롭다운 리스트에서 옵션을 선택할 수 있는 컴포넌트입니다."
    />

    <DemoSection title="Variants" description="Boxed, Filled, Plain">
      <LabeledSelect label="Boxed" variant="boxed" />
      <LabeledSelect label="Filled" variant="filled" />
      <LabeledSelect label="Plain" variant="plain" />
    </DemoSection>

    <DemoSection title="Sizes" description="Small, Medium">
      <LabeledSelect label="Small" size="sm" />
      <LabeledSelect label="Medium" size="md" />
    </DemoSection>

    <DemoSection title="States" description="Error, Disabled, Required">
      <LabeledSelect label="Error" error helperText="Selection is required" />
      <LabeledSelect label="Disabled" disabled />
      <LabeledSelect label="Required" required />
    </DemoSection>

    <DemoSection title="Full Width">
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
    </DemoSection>
  </div>
);
