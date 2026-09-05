import { useState } from 'react';

import { Button, TextField } from '@berrypjh/react-ui';

import { Mono, Page, Panel, Preview, Section } from '../shell/ui';

/** 토큰 계층과 시각 스타일. 값 조회는 Tokens, 통합 검증은 Runtime 이 담당한다. */

const LAYERS = [
  {
    name: 'Primitive',
    desc: '원시 팔레트와 스케일. Consumer가 덮어쓸 수 없습니다.',
    examples: ['color.primary.pr700', 'color.neutral.ne500'],
  },
  {
    name: 'Semantic',
    desc: '역할로 이름 붙인 층. Consumer가 브랜드를 입히는 지점입니다.',
    examples: ['color.text.default', 'color.field.border'],
  },
  {
    name: 'Component',
    desc: '시맨틱으로 표현 못 하고 RN이 값으로 필요할 때만 올립니다.',
    examples: ['component.field.height.md'],
  },
];

const BTN_ROLES = [
  { key: 'primary', token: 'color.primaryBtn.*', exposed: true },
  { key: 'secondary', token: 'color.secondaryBtn.*', exposed: true },
  { key: 'error', token: 'color.errorBtn.*', exposed: false },
] as const;

const BTN_SLOTS = ['default', 'hover', 'disabled', 'focusRipple', 'outlinedHover'] as const;
const SHADOWS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const RoleSwatches = ({ role }: { role: string }) => (
  <div className="flex flex-wrap gap-md">
    {BTN_SLOTS.map((slot) => (
      <div key={slot} className="flex flex-col gap-xs items-center">
        <span
          className="inline-block w-[52px] h-[32px] rounded-sm border border-stroke-light"
          style={{
            background: `var(--ds-${role === 'primary' ? 'primary' : role}-btn-${slot.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)})`,
          }}
        />
        <span className="text-text-light text-xxsm">{slot}</span>
      </div>
    ))}
  </div>
);

export const FoundationPage = () => {
  const [play, setPlay] = useState(false);

  return (
    <Page testId="foundation-page" title="Styles" lead="토큰 계층과 시각 스타일을 확인합니다.">
      <Section title="토큰 계층" note="컴포넌트는 Primitive를 직접 참조하지 않습니다">
        <div className="border-t border-stroke-light">
          {LAYERS.map((l) => (
            <div key={l.name} className="flex flex-wrap gap-lg py-lg border-b border-stroke-light">
              <span className="text-text-default text-xsm font-semiBold w-[110px] shrink-0">
                {l.name}
              </span>
              <span className="text-text-light text-xsm flex-1 min-w-[220px]">{l.desc}</span>
              <span className="flex flex-col gap-xs">
                {l.examples.map((e) => (
                  <Mono key={e}>{e}</Mono>
                ))}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="버튼 색 역할" note="세 역할이 같은 토큰 shape을 공유합니다">
        <div className="flex flex-col gap-2xl">
          {BTN_ROLES.map((role) => (
            <div key={role.key} className="flex flex-col gap-md">
              <div className="flex items-center gap-md flex-wrap">
                <Mono>{role.token}</Mono>
                {!role.exposed && (
                  <span className="text-warning-wa800 text-xxsm">
                    토큰·CSS는 준비됨 · ButtonColor 타입 미노출
                  </span>
                )}
              </div>
              <RoleSwatches role={role.key} />
              {role.exposed && (
                <Preview>
                  <Button color={role.key} variant="contained">
                    Contained
                  </Button>
                  <Button color={role.key} variant="outlined">
                    Outlined
                  </Button>
                  <Button color={role.key} variant="text">
                    Text
                  </Button>
                  <Button color={role.key} variant="contained" disabled>
                    Disabled
                  </Button>
                </Preview>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="폼 필드 상태" note="color.field.* 와 component.field.* 로 표현됩니다">
        <Preview>
          <TextField label="기본" placeholder="입력하세요" />
          <TextField label="오류" error helperText="확인이 필요합니다" placeholder="입력하세요" />
          <TextField label="비활성" disabled placeholder="입력하세요" />
          <TextField label="작은 크기" size="sm" placeholder="입력하세요" />
        </Preview>
      </Section>

      <Section title="Elevation" note="레이어 자식에서 합성한 단일 변수를 씁니다">
        <div className="flex flex-wrap gap-xl">
          {SHADOWS.map((name) => (
            <div key={name} className="flex flex-col gap-md items-center">
              <div
                className="w-[88px] h-[56px] rounded-md bg-background-surface border border-stroke-light"
                style={{ boxShadow: `var(--ds-shadow-${name})` }}
              />
              <Mono>{`shadow.${name}`}</Mono>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Motion"
        note="Web은 ms 문자열, RN은 숫자로 나갑니다"
        actions={
          <Button variant="outlined" size="sm" onClick={() => setPlay((v) => !v)}>
            재생
          </Button>
        }
      >
        <Panel>
          <div className="flex flex-col gap-lg">
            {(['fast', 'normal', 'slow'] as const).map((s) => (
              <div key={s} className="flex flex-col sm:flex-row sm:items-center gap-sm sm:gap-xl">
                <span className="sm:w-[150px] shrink-0">
                  <Mono>{`motion.duration.${s}`}</Mono>
                </span>
                <div className="flex-1 h-[28px] bg-background-default rounded-sm relative overflow-hidden">
                  <div
                    className="absolute top-[4px] bottom-[4px] w-[20px] rounded-xs bg-background-primary"
                    style={{
                      left: play ? 'calc(100% - 24px)' : '4px',
                      transitionProperty: 'left',
                      transitionDuration: `var(--ds-motion-duration-${s})`,
                      transitionTimingFunction: 'var(--ds-motion-easing-standard)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Section>
    </Page>
  );
};

export default FoundationPage;
