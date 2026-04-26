import { SearchField } from '@berrypjh/react-ui';
import { DemoSection, PageHeader } from '../components/DemoSection';

const SUGGESTIONS = [
  { id: '1', label: 'React', description: 'JavaScript UI library' },
  { id: '2', label: 'TypeScript', description: 'Typed JavaScript' },
  { id: '3', label: 'Tailwind CSS', description: 'Utility-first CSS framework' },
  { id: '4', label: 'Vite', description: 'Next-gen frontend tooling' },
  { id: '5', label: 'Playwright', description: 'E2E testing framework' },
];

export const SearchFieldPage = () => (
  <div>
    <PageHeader
      badge="Component"
      title="SearchField"
      description="SearchField는 자동완성 검색을 제공하는 입력 필드입니다."
    />

    <DemoSection title="Variants" description="Boxed, Filled, Plain">
      <SearchField placeholder="Search (boxed)..." variant="boxed" />
      <SearchField placeholder="Search (filled)..." variant="filled" />
      <SearchField placeholder="Search (plain)..." variant="plain" />
    </DemoSection>

    <DemoSection title="With Suggestions" description="타이핑하면 추천 검색어가 표시됩니다.">
      <SearchField
        placeholder="Try typing 'R' or 'T'..."
        suggestions={SUGGESTIONS}
        variant="boxed"
      />
    </DemoSection>

    <DemoSection title="States" description="Disabled, Not clearable">
      <SearchField placeholder="Disabled" disabled />
      <SearchField placeholder="Not clearable" clearable={false} />
    </DemoSection>

    <DemoSection title="Full Width">
      <div style={{ width: '100%' }}>
        <SearchField placeholder="Full width search..." fullWidth suggestions={SUGGESTIONS} />
      </div>
    </DemoSection>
  </div>
);
