import { TextField } from '@berrypjh/react-ui';

import { DemoSection, PageHeader } from '../components/DemoSection';

export const TextFieldPage = () => (
  <div>
    <PageHeader badge="Component" title="TextField" description="텍스트 입력 필드" />

    <DemoSection title="Variants" description="Boxed, Filled, Plain">
      <TextField label="Boxed" variant="boxed" placeholder="Enter text..." />
      <TextField label="Filled" variant="filled" placeholder="Enter text..." />
      <TextField label="Plain" variant="plain" placeholder="Enter text..." />
    </DemoSection>

    <DemoSection title="Sizes" description="Small, Medium">
      <TextField label="Small" size="sm" placeholder="Small input" />
      <TextField label="Medium" size="md" placeholder="Medium input" />
    </DemoSection>

    <DemoSection title="States" description="Error, Disabled, Required">
      <TextField
        label="Error"
        error
        helperText="This field is required"
        placeholder="Error state"
      />
      <TextField label="Disabled" disabled placeholder="Cannot type here" />
      <TextField label="Required" required placeholder="Required field" />
    </DemoSection>

    <DemoSection title="With Helper Text">
      <TextField
        label="Password"
        type="password"
        helperText="Minimum 8 characters"
        placeholder="Enter password"
      />
      <TextField label="Username" helperText="Letters and numbers only" placeholder="johndoe" />
    </DemoSection>

    <DemoSection title="Multiline" description="Textarea mode with rows">
      <TextField label="Message" multiline rows={4} placeholder="Write your message..." />
    </DemoSection>

    <DemoSection title="Full Width">
      <div style={{ width: '100%' }}>
        <TextField label="Full Width" fullWidth placeholder="Stretches to container width" />
      </div>
    </DemoSection>
  </div>
);
