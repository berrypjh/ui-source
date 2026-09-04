import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  SearchField,
  Select,
  TextField,
} from '@berrypjh/react-ui';

import { PageHeader } from '../components/DemoSection';

/**
 * Consumer Extension 검증 페이지.
 *
 * 여기 있는 요소는 전부 브라우저 computed style로 확인하기 위한 것이다.
 * 값을 하드코딩하지 않고 Shared 토큰(`var(--ds-*)`)이나 Shared Tailwind 유틸리티만 쓴다 —
 * Sample profile이 켜지면 같은 요소가 컴파일된 CSS 값을 따라가야 한다.
 */

const Probe = ({
  testId,
  label,
  style,
  className,
}: {
  testId: string;
  label: string;
  style?: React.CSSProperties;
  className?: string;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span className="text-text-light" style={{ fontSize: 12 }}>
      {label}
    </span>
    <div
      data-testid={testId}
      className={className}
      style={{ width: 120, height: 40, borderRadius: 6, ...style }}
    />
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
    {children}
  </div>
);

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 40 }}>
    <h2 className="text-text-default" style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
      {title}
    </h2>
    {children}
  </section>
);

export const ConsumerProfilePage = () => (
  <div data-testid="consumer-profile-page">
    <PageHeader
      badge="Consumer"
      title="Consumer Profile"
      description="Default와 Sample Consumer profile을 나란히 비교합니다. Sample은 컴파일된 CSS만 적용되며 JS 런타임 주입은 없습니다."
    />

    <Group title="Overridden semantic tokens (raw CSS variables)">
      <Row>
        <Probe
          testId="probe-background-primary"
          label="--ds-background-primary"
          style={{ background: 'var(--ds-background-primary)' }}
        />
        <Probe
          testId="probe-background-primary-rgb"
          label="--ds-background-primary-rgb @ 50%"
          style={{ background: 'rgb(var(--ds-background-primary-rgb) / 0.5)' }}
        />
        <Probe
          testId="probe-text-default"
          label="--ds-text-default"
          style={{ background: 'var(--ds-text-default)' }}
        />
        <Probe
          testId="probe-stroke-default"
          label="--ds-stroke-default"
          style={{ background: 'var(--ds-stroke-default)' }}
        />
      </Row>
    </Group>

    <Group title="Non-overridden tokens (must stay at shared defaults)">
      <Row>
        <Probe
          testId="probe-background-secondary"
          label="--ds-background-secondary"
          style={{ background: 'var(--ds-background-secondary)' }}
        />
        <Probe
          testId="probe-spacing-md"
          label="--ds-spacing-md (padding)"
          style={{ background: 'var(--ds-background-grey)', padding: 'var(--ds-spacing-md)' }}
        />
        <Probe
          testId="probe-radius-lg"
          label="--ds-radius-lg"
          style={{ background: 'var(--ds-background-grey)', borderRadius: 'var(--ds-radius-lg)' }}
        />
      </Row>
    </Group>

    <Group title="Shared Tailwind utilities (no consumer preset)">
      <Row>
        <Probe
          testId="probe-tw-background-primary"
          label="bg-background-primary"
          className="bg-background-primary"
        />
        <Probe
          testId="probe-tw-background-primary-alpha"
          label="bg-background-primary/50"
          className="bg-background-primary/50"
        />
        <Probe
          testId="probe-tw-background-secondary"
          label="bg-background-secondary (not overridden)"
          className="bg-background-secondary"
        />
      </Row>
    </Group>

    <Group title="Real React UI components">
      <Row>
        <div data-testid="probe-button-contained">
          <Button variant="contained">Contained</Button>
        </div>
        <div data-testid="probe-button-outlined">
          <Button variant="outlined">Outlined</Button>
        </div>
        <div data-testid="probe-text-field">
          <TextField label="TextField" placeholder="Type here" />
        </div>
        <div data-testid="probe-search-field">
          <SearchField placeholder="Search" />
        </div>
        <div data-testid="probe-select">
          <FormControl variant="boxed">
            <InputLabel>Select</InputLabel>
            <Select placeholder="Choose...">
              <MenuItem value="a">Option A</MenuItem>
              <MenuItem value="b">Option B</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Row>
    </Group>
  </div>
);

export default ConsumerProfilePage;
