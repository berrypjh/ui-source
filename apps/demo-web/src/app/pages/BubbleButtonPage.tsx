import { BubbleButton } from '@berrypjh/react-ui';

import { DemoSection, PageHeader } from '../components/DemoSection';

const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M20 12h1M3 12H2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 20v1M12 3V2" />
  </svg>
);

export const BubbleButtonPage = () => (
  <div>
    <PageHeader
      badge="Component"
      title="BubbleButton"
      description="Bubble Button은 아이콘과 텍스트 레이블을 결합한 애니메이션 버튼으로, 주로 빠른 액션 툴바에서 사용됩니다."
    />

    <DemoSection title="기본 사용법" description="아이콘과 텍스트 레이블을 결합한 애니메이션 버튼">
      <BubbleButton label="Home" icon={<HomeIcon />} />
      <BubbleButton label="Notifications" icon={<BellIcon />} />
      <BubbleButton label="Settings" icon={<SettingsIcon />} />
    </DemoSection>

    <DemoSection title="Size" description="Small, Medium, Large">
      <BubbleButton size="sm" label="Small" icon={<HomeIcon />} />
      <BubbleButton size="md" label="Medium" icon={<BellIcon />} />
      <BubbleButton size="lg" label="Large" icon={<SettingsIcon />} />
    </DemoSection>

    <DemoSection
      title="Delay Animation"
      description="delay prop을 사용한 애니메이션 효과를 볼 수 있습니다."
    >
      <BubbleButton label="First" icon={<HomeIcon />} delay={0} />
      <BubbleButton label="Second" icon={<BellIcon />} delay={100} />
      <BubbleButton label="Third" icon={<SettingsIcon />} delay={200} />
    </DemoSection>

    <DemoSection title="Disabled">
      <BubbleButton label="Disabled" icon={<HomeIcon />} disabled />
      <BubbleButton label="Also Disabled" icon={<BellIcon />} disabled />
    </DemoSection>
  </div>
);
