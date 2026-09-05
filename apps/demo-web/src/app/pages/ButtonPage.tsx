import { Button } from '@berrypjh/react-ui';

import { Page, Preview, Section } from '../shell/ui';

export const ButtonPage = () => (
  <Page
    title="Button"
    lead="버튼은 사용자가 작업을 수행하거나 선택을 할 수 있도록 하는 UI 요소입니다."
  >
    <Section title="Variants" note="버튼 세가지 스타일">
      <Preview>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </Preview>
    </Section>

    <Section title="Sizes" note="버튼 크기">
      <Preview>
        <Button variant="contained" size="sm">
          Small
        </Button>
        <Button variant="contained" size="md">
          Medium
        </Button>
        <Button variant="contained" size="lg">
          Large
        </Button>
      </Preview>
    </Section>

    <Section title="Colors" note="Primary와 secondary 컬러 variants">
      <Preview>
        <Button variant="contained" color="primary">
          Primary
        </Button>
        <Button variant="contained" color="secondary">
          Secondary
        </Button>
        <Button variant="outlined" color="primary">
          Primary
        </Button>
        <Button variant="outlined" color="secondary">
          Secondary
        </Button>
      </Preview>
    </Section>

    <Section title="Loading State" note="로딩 상태">
      <Preview>
        <Button variant="contained" loading loadingPosition="start">
          Loading Start
        </Button>
        <Button variant="contained" loading loadingPosition="center">
          Loading
        </Button>
        <Button variant="contained" loading loadingPosition="end">
          Loading End
        </Button>
      </Preview>
    </Section>

    <Section title="Disabled">
      <Preview>
        <Button variant="contained" disabled>
          Contained
        </Button>
        <Button variant="outlined" disabled>
          Outlined
        </Button>
        <Button variant="text" disabled>
          Text
        </Button>
      </Preview>
    </Section>

    <Section title="Full Width">
      <Preview>
        <div style={{ width: '100%' }}>
          <Button variant="contained" fullWidth>
            Full Width Button
          </Button>
        </div>
      </Preview>
    </Section>
  </Page>
);
