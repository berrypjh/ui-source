import { TextField } from '@berrypjh/react-ui';

import { Page, Preview, Section } from '../shell/ui';

export const TextFieldPage = () => (
  <Page title="TextField" lead="텍스트 입력 필드">
    <Section title="Variants" note="Boxed, Filled, Plain">
      <Preview>
        <TextField label="Boxed" variant="boxed" placeholder="Enter text..." />
        <TextField label="Filled" variant="filled" placeholder="Enter text..." />
        <TextField label="Plain" variant="plain" placeholder="Enter text..." />
      </Preview>
    </Section>

    <Section title="Sizes" note="Small, Medium">
      <Preview>
        <TextField label="Small" size="sm" placeholder="Small input" />
        <TextField label="Medium" size="md" placeholder="Medium input" />
      </Preview>
    </Section>

    <Section title="States" note="Error, Disabled, Required">
      <Preview>
        <TextField
          label="Error"
          error
          helperText="This field is required"
          placeholder="Error state"
        />
        <TextField label="Disabled" disabled placeholder="Cannot type here" />
        <TextField label="Required" required placeholder="Required field" />
      </Preview>
    </Section>

    <Section title="With Helper Text">
      <Preview>
        <TextField
          label="Password"
          type="password"
          helperText="Minimum 8 characters"
          placeholder="Enter password"
        />
        <TextField label="Username" helperText="Letters and numbers only" placeholder="johndoe" />
      </Preview>
    </Section>

    <Section title="Multiline" note="Textarea mode with rows">
      <Preview>
        <TextField label="Message" multiline rows={4} placeholder="Write your message..." />
      </Preview>
    </Section>

    <Section title="Full Width">
      <Preview>
        <div style={{ width: '100%' }}>
          <TextField label="Full Width" fullWidth placeholder="Stretches to container width" />
        </div>
      </Preview>
    </Section>
  </Page>
);
