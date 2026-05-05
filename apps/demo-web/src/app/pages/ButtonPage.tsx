import { Button } from '@berrypjh/react-ui';

import { DemoSection, PageHeader } from '../components/DemoSection';

export const ButtonPage = () => (
  <div>
    <PageHeader
      badge="Component"
      title="Button"
      description="버튼은 사용자가 작업을 수행하거나 선택을 할 수 있도록 하는 UI 요소입니다."
    />

    <DemoSection title="Variants" description="버튼 세가지 스타일">
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </DemoSection>

    <DemoSection title="Sizes" description="버튼 크기">
      <Button variant="contained" size="sm">
        Small
      </Button>
      <Button variant="contained" size="md">
        Medium
      </Button>
      <Button variant="contained" size="lg">
        Large
      </Button>
    </DemoSection>

    <DemoSection title="Colors" description="Primary와 secondary 컬러 variants">
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
    </DemoSection>

    <DemoSection title="Loading State" description="로딩 상태">
      <Button variant="contained" loading loadingPosition="start">
        Loading Start
      </Button>
      <Button variant="contained" loading loadingPosition="center">
        Loading
      </Button>
      <Button variant="contained" loading loadingPosition="end">
        Loading End
      </Button>
    </DemoSection>

    <DemoSection title="Disabled">
      <Button variant="contained" disabled>
        Contained
      </Button>
      <Button variant="outlined" disabled>
        Outlined
      </Button>
      <Button variant="text" disabled>
        Text
      </Button>
    </DemoSection>

    <DemoSection title="Full Width">
      <div style={{ width: '100%' }}>
        <Button variant="contained" fullWidth>
          Full Width Button
        </Button>
      </div>
    </DemoSection>
  </div>
);
