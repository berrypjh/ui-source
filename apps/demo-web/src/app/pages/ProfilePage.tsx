import { Button, TextField } from '@berrypjh/react-ui';

import { Mono, Page, Panel, Preview, Section, Swatch } from '../shell/ui';
import { toChannels } from '../verification/checks';
import { useCurrentTheme } from '../verification/useCurrentTheme';
import { ProbeTrees, useProbeValues } from '../verification/useProbes';

/**
 * 이 branch 의 핵심 화면.
 *
 * 개발자가 알고 싶은 것은 셋이다 — 무엇을 덮어썼나(OVERRIDDEN), 무엇은 그대로인가(PRESERVED),
 * 파생 값도 따라왔나(DERIVED). 프로필을 토글해 기억으로 비교하지 않도록 두 값을 한 줄에 놓는다.
 */

type Kind = 'overridden' | 'preserved' | 'derived';

const ROWS: { token: string; cssVar: string; kind: Kind }[] = [
  { token: 'background.primary', cssVar: '--ds-background-primary', kind: 'overridden' },
  { token: 'background.surface', cssVar: '--ds-background-surface', kind: 'overridden' },
  { token: 'text.default', cssVar: '--ds-text-default', kind: 'overridden' },
  { token: 'primaryBtn.default', cssVar: '--ds-primary-btn-default', kind: 'overridden' },
  { token: 'stroke.default', cssVar: '--ds-stroke-default', kind: 'overridden' },
  { token: 'background.secondary', cssVar: '--ds-background-secondary', kind: 'preserved' },
  { token: 'text.link', cssVar: '--ds-text-link', kind: 'preserved' },
  { token: 'background.primary-rgb', cssVar: '--ds-background-primary-rgb', kind: 'derived' },
];

const VARS = ROWS.map((r) => r.cssVar);

const KIND_LABEL: Record<Kind, string> = {
  overridden: '덮어씀',
  preserved: '기본값 유지',
  derived: '파생',
};

const isColor = (v: string) => v.trim().startsWith('#') || v.trim().startsWith('rgb');

export const ProfilePage = () => {
  const theme = useCurrentTheme();
  const values = useProbeValues(theme, VARS);

  const counts = ROWS.reduce<Record<Kind, number>>(
    (acc, r) => ({ ...acc, [r.kind]: acc[r.kind] + 1 }),
    { overridden: 0, preserved: 0, derived: 0 },
  );

  return (
    <Page
      testId="profile-page"
      title="Consumer Profile"
      lead="Sample 프로필이 Shared 토큰을 어떻게 덮어쓰는지 확인합니다. 프로필을 바꾸지 않아도 두 값을 함께 봅니다."
    >
      <ProbeTrees theme={theme} />

      <Section
        title="토큰 비교"
        note={`덮어씀 ${counts.overridden} · 유지 ${counts.preserved} · 파생 ${counts.derived} · 테마 ${theme}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xsm border-collapse">
            <thead>
              <tr className="text-text-light text-xxsm">
                <th className="text-left font-semiBold pb-md pr-lg">토큰</th>
                <th className="text-left font-semiBold pb-md pr-lg w-[180px]">Default</th>
                <th className="text-left font-semiBold pb-md pr-lg w-[180px]">Sample</th>
                <th className="text-left font-semiBold pb-md w-[100px]">구분</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const base = values?.default[row.cssVar] ?? '';
                const sample = values?.sample[row.cssVar] ?? '';
                const changed = base !== '' && sample !== '' && base !== sample;
                return (
                  <tr
                    key={row.cssVar}
                    data-testid={`row-${row.token}`}
                    data-changed={changed}
                    className="border-t border-stroke-light align-baseline"
                  >
                    <td className="py-md pr-lg">
                      <span className="text-text-default">{row.token}</span>
                      <br />
                      <Mono>{row.cssVar}</Mono>
                    </td>
                    <td className="py-md pr-lg">
                      <span className="flex items-center gap-sm">
                        {isColor(base) && <Swatch color={base} />}
                        <span className="font-mono text-xxsm text-text-light">{base || '—'}</span>
                      </span>
                    </td>
                    <td className="py-md pr-lg">
                      <span className="flex items-center gap-sm">
                        {isColor(sample) && <Swatch color={sample} />}
                        <span
                          className={`font-mono text-xxsm ${changed ? 'text-text-default' : 'text-text-light'}`}
                        >
                          {sample || '—'}
                        </span>
                      </span>
                    </td>
                    <td className="py-md text-text-light text-xxsm">{KIND_LABEL[row.kind]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {values && (
          <p className="text-text-light text-xxsm mt-lg">
            파생 채널은 소스 색에서 자동 계산됩니다 — Sample의{' '}
            <span className="font-mono">background.primary</span>는{' '}
            <span className="font-mono">
              {toChannels(values.sample['--ds-background-primary']) ?? '—'}
            </span>{' '}
            채널을 만듭니다.
          </p>
        )}
      </Section>

      <Section title="실제 컴포넌트" note="상단 Profile을 바꾸면 아래 결과가 함께 바뀝니다">
        <Preview>
          <div data-testid="probe-button-contained">
            <Button variant="contained">Contained</Button>
          </div>
          <div data-testid="probe-button-outlined">
            <Button variant="outlined">Outlined</Button>
          </div>
          <div data-testid="probe-text-field">
            <TextField label="TextField" placeholder="입력하세요" />
          </div>
        </Preview>
      </Section>

      <Section title="Tailwind 유틸리티" note="Consumer 전용 preset 없이 같은 CSS 변수를 따릅니다">
        <Panel>
          <div className="flex flex-wrap gap-2xl">
            {[
              {
                cls: 'bg-background-primary',
                id: 'probe-tw-background-primary',
                label: 'bg-background-primary',
              },
              {
                cls: 'bg-background-primary/50',
                id: 'probe-tw-background-primary-alpha',
                label: 'bg-background-primary/50',
              },
              {
                cls: 'bg-background-secondary',
                id: 'probe-tw-background-secondary',
                label: 'bg-background-secondary (유지)',
              },
            ].map((t) => (
              <div key={t.id} className="flex flex-col gap-sm">
                <div data-testid={t.id} className={`w-[112px] h-[36px] rounded-sm ${t.cls}`} />
                <Mono>{t.label}</Mono>
              </div>
            ))}
          </div>
        </Panel>
      </Section>
    </Page>
  );
};

export default ProfilePage;
