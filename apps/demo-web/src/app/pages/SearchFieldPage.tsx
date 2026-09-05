import { SearchField } from '@berrypjh/react-ui';

import { Page, Preview, Section } from '../shell/ui';

const SUGGESTIONS = [
  { id: '1', label: 'React', description: 'JavaScript UI library' },
  { id: '2', label: 'TypeScript', description: 'Typed JavaScript' },
  { id: '3', label: 'Tailwind CSS', description: 'Utility-first CSS framework' },
  { id: '4', label: 'Vite', description: 'Next-gen frontend tooling' },
  { id: '5', label: 'Playwright', description: 'E2E testing framework' },
];

export const SearchFieldPage = () => (
  <Page title="SearchField" lead="SearchField는 자동완성 검색을 제공하는 입력 필드입니다.">
    <Section title="Variants" note="Boxed, Filled, Plain">
      <Preview>
        <SearchField placeholder="Search (boxed)..." variant="boxed" />
        <SearchField placeholder="Search (filled)..." variant="filled" />
        <SearchField placeholder="Search (plain)..." variant="plain" />
      </Preview>
    </Section>

    <Section title="With Suggestions" note="타이핑하면 추천 검색어가 표시됩니다.">
      <Preview>
        <SearchField
          placeholder="Try typing 'R' or 'T'..."
          suggestions={SUGGESTIONS}
          variant="boxed"
        />
      </Preview>
    </Section>

    <Section title="States" note="Disabled, Not clearable">
      <Preview>
        <SearchField placeholder="Disabled" disabled />
        <SearchField placeholder="Not clearable" clearable={false} />
      </Preview>
    </Section>

    <Section title="Full Width">
      <Preview>
        <div style={{ width: '100%' }}>
          <SearchField placeholder="Full width search..." fullWidth suggestions={SUGGESTIONS} />
        </div>
      </Preview>
    </Section>
  </Page>
);
