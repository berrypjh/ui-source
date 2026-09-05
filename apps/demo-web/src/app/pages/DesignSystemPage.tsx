import { ReactNode, useEffect, useRef, useState } from 'react';

import { Button, TextField } from '@berrypjh/react-ui';

import { PageHeader } from '../components/DemoSection';

/**
 * 디자인 토큰 시스템 검증 페이지.
 *
 * 토큰 "목록"은 /tokens 가 보여준다. 여기서는 **시스템이 의도대로 동작하는지**를 본다 —
 * 특히 대비는 소스 값이 아니라 브라우저가 실제로 계산한 CSS 변수에서 측정하므로,
 * 테마를 바꾸면 그 자리에서 다시 계산된다.
 *
 * WCAG 계산식은 design-tokens 에도 있지만(`lib/contrast.ts`), 데모는 react-ui 만
 * 의존하므로 여기서는 같은 공식을 로컬로 둔다.
 */

/* ── WCAG 2.1 상대 명도 대비 ────────────────────────────────── */

const toRgb = (color: string): [number, number, number] | null => {
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
  }
  const fn = color.match(/rgba?\(([^)]+)\)/i);
  if (!fn) return null;
  const parts = fn[1]
    .split(/[,\s/]+/)
    .filter(Boolean)
    .map(Number);
  return parts.length >= 3 ? [parts[0], parts[1], parts[2]] : null;
};

const luminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string): number | null => {
  const ra = toRgb(a);
  const rb = toRgb(b);
  if (!ra || !rb) return null;
  const [la, lb] = [luminance(ra), luminance(rb)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/* ── 현재 테마의 실제 CSS 변수 값을 읽는다 ───────────────────── */

/** 테마가 바뀌면 다시 읽는다 — `data-theme` 속성 변화를 관찰한다. */
const useTokenValues = (names: string[]) => {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const read = () => {
      const style = getComputedStyle(el);
      setValues(Object.fromEntries(names.map((n) => [n, style.getPropertyValue(n).trim()])));
    };
    read();

    const root = el.closest('[data-theme]');
    if (!root) return;
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [names]);

  return { ref, values };
};

/* ── 공통 조각 ──────────────────────────────────────────────── */

/** 사이드바의 OVERVIEW / COMPONENTS 와 같은 분류 헤더. */
const Group = ({ label, children }: { label: string; children: ReactNode }) => (
  <section className="mb-6xl last:mb-0">
    <div className="flex items-center gap-lg mb-2xl">
      <h2 className="text-text-light text-xs font-semibold uppercase tracking-[0.1em] whitespace-nowrap">
        {label}
      </h2>
      <span className="h-px flex-1 bg-stroke-light" />
    </div>
    <div className="flex flex-col gap-4xl">{children}</div>
  </section>
);

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <section>
    <h3 className="text-text-default text-lg font-semibold mb-xs">{title}</h3>
    <p className="text-text-light text-sm leading-relaxed mb-xl max-w-[680px]">{description}</p>
    {children}
  </section>
);

const Card = ({ children }: { children: ReactNode }) => (
  <div className="bg-background-surface border border-stroke-default rounded-xl p-3xl">
    {children}
  </div>
);

const Mono = ({ children }: { children: ReactNode }) => (
  <code className="font-mono text-xs text-text-light">{children}</code>
);

const Pass = ({ ok }: { ok: boolean }) => (
  <span
    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
      ok ? 'bg-success-su100 text-success-su800' : 'bg-error-er100 text-error-er800'
    }`}
  >
    {ok ? 'AA 통과' : 'AA 미달'}
  </span>
);

/* ── 1. 토큰 계층 ───────────────────────────────────────────── */

const LAYERS = [
  {
    name: 'Primitive',
    desc: '원시 팔레트·스케일. Consumer override 불가 — 내부 구현이다.',
    examples: ['color.primary.pr700', 'color.neutral.ne500', 'borderWidth.primitive.sm'],
    tone: 'bg-background-default text-text-light',
  },
  {
    name: 'Semantic',
    desc: '역할로 이름 붙인 층. Consumer가 브랜드를 입히는 지점이다.',
    examples: ['color.text.default', 'color.field.border', 'color.secondaryBtn.hover'],
    tone: 'bg-primary-pr100 text-primary-pr800',
  },
  {
    name: 'Component',
    desc: '시맨틱으로 표현 못 하고 RN이 값으로 필요로 할 때만 승격한다.',
    examples: ['component.field.height.md', 'component.field.focusRingWidth'],
    tone: 'bg-secondary-se100 text-secondary-se800',
  },
];

const LayerSection = () => (
  <Section
    title="토큰 계층"
    description="컴포넌트는 Primitive를 직접 참조하지 않는다. 항상 Semantic을 거치므로, Consumer가 Semantic만 바꿔도 UI 전체가 따라온다."
  >
    <div className="grid gap-xl md:grid-cols-3">
      {LAYERS.map((l) => (
        <Card key={l.name}>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${l.tone}`}
          >
            {l.name}
          </span>
          <p className="text-text-default text-sm leading-relaxed mt-lg mb-lg">{l.desc}</p>
          <div className="flex flex-col gap-xs">
            {l.examples.map((e) => (
              <Mono key={e}>{e}</Mono>
            ))}
          </div>
        </Card>
      ))}
    </div>
  </Section>
);

/* ── 2. 접근성 (실시간 측정) ─────────────────────────────────── */

type Check = { label: string; fg: string; bg: string; need: number; note?: string };

const CHECKS: Check[] = [
  { label: '본문 텍스트', fg: '--ds-text-default', bg: '--ds-background-default', need: 4.5 },
  { label: '보조 텍스트', fg: '--ds-text-light', bg: '--ds-background-default', need: 4.5 },
  { label: 'Placeholder', fg: '--ds-text-placeholder', bg: '--ds-background-surface', need: 4.5 },
  { label: '링크', fg: '--ds-text-link', bg: '--ds-background-default', need: 4.5 },
  {
    label: 'Primary 버튼 라벨',
    fg: '--ds-text-contrast-text',
    bg: '--ds-primary-btn-default',
    need: 4.5,
  },
  {
    label: 'Secondary 버튼 라벨',
    fg: '--ds-text-contrast-text',
    bg: '--ds-secondary-btn-default',
    need: 4.5,
  },
  {
    label: 'Error 버튼 라벨',
    fg: '--ds-text-contrast-text',
    bg: '--ds-error-btn-default',
    need: 4.5,
  },
  {
    label: '필드 테두리',
    fg: '--ds-field-border',
    bg: '--ds-background-surface',
    need: 3,
    note: 'UI 경계',
  },
  {
    label: '포커스 표시자',
    fg: '--ds-stroke-primary',
    bg: '--ds-background-surface',
    need: 3,
    note: 'UI 경계',
  },
  {
    label: '비활성 텍스트',
    fg: '--ds-text-disable',
    bg: '--ds-background-default',
    need: 0,
    note: 'WCAG 면제',
  },
];

const NAMES = [...new Set(CHECKS.flatMap((c) => [c.fg, c.bg]))];

const ContrastSection = () => {
  const { ref, values } = useTokenValues(NAMES);

  return (
    <Section
      title="접근성 — 브라우저가 계산한 값으로 실시간 측정"
      description="소스 토큰이 아니라 지금 이 페이지에 적용된 CSS 변수에서 읽어 WCAG 2.1 대비를 계산한다. 상단에서 테마를 바꾸면 즉시 다시 계산된다."
    >
      <div ref={ref}>
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-light text-xs uppercase tracking-wide">
                <th className="text-left font-semibold pb-lg">조합</th>
                <th className="text-left font-semibold pb-lg">색</th>
                <th className="text-right font-semibold pb-lg">대비</th>
                <th className="text-right font-semibold pb-lg">기준</th>
                <th className="text-right font-semibold pb-lg">판정</th>
              </tr>
            </thead>
            <tbody>
              {CHECKS.map((c) => {
                const fg = values[c.fg] ?? '';
                const bg = values[c.bg] ?? '';
                const ratio = fg && bg ? contrast(fg, bg) : null;
                const exempt = c.need === 0;
                return (
                  <tr key={c.label} className="border-t border-stroke-light">
                    <td className="py-lg pr-lg text-text-default">
                      {c.label}
                      {c.note && <span className="text-text-light text-xs ml-md">{c.note}</span>}
                    </td>
                    <td className="py-lg pr-lg">
                      <span className="inline-flex items-center gap-sm">
                        <span
                          className="inline-block w-5 h-5 rounded border border-stroke-light"
                          style={{ background: bg }}
                        />
                        <span
                          className="inline-block w-5 h-5 rounded border border-stroke-light"
                          style={{ background: fg }}
                        />
                      </span>
                    </td>
                    <td className="py-lg pl-lg text-right font-mono text-text-default">
                      {ratio ? `${ratio.toFixed(2)}:1` : '—'}
                    </td>
                    <td className="py-lg pl-lg text-right font-mono text-text-light">
                      {exempt ? '—' : `${c.need}:1`}
                    </td>
                    <td className="py-lg pl-lg text-right">
                      {exempt ? (
                        <span className="text-text-light text-xs">비활성 요소 면제</span>
                      ) : (
                        <Pass ok={!!ratio && ratio >= c.need} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </Section>
  );
};

/* ── 3. 버튼 색 역할 ────────────────────────────────────────── */

const BTN_ROLES = [
  { key: 'primary', token: 'color.primaryBtn.*', exposed: true },
  { key: 'secondary', token: 'color.secondaryBtn.*', exposed: true },
  { key: 'error', token: 'color.errorBtn.*', exposed: false },
] as const;

const BTN_SLOTS = ['default', 'hover', 'disabled', 'focusRipple', 'outlinedHover'] as const;

/** 역할별 토큰 값을 그대로 보여준다 — 세 패밀리가 같은 shape 임을 눈으로 확인한다. */
const RoleSwatches = ({ role }: { role: string }) => {
  const prefix = role === 'primary' ? 'primary-btn' : `${role}-btn`;
  return (
    <div className="flex flex-wrap gap-md">
      {BTN_SLOTS.map((slot) => {
        const kebab = slot.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        return (
          <div key={slot} className="flex flex-col gap-xs items-center">
            <span
              className="inline-block w-14 h-9 rounded-md border border-stroke-light"
              style={{ background: `var(--ds-${prefix}-${kebab})` }}
            />
            <span className="text-text-light text-[11px]">{slot}</span>
          </div>
        );
      })}
    </div>
  );
};

const ButtonRoleSection = () => (
  <Section
    title="버튼 색 역할"
    description="primary / secondary / error 세 역할이 같은 토큰 shape(default·hover·disabled·focusRipple·outlinedHover·outlinedFocusRipple)를 공유한다. 새 역할을 더할 때도 이 6개 키를 그대로 따른다."
  >
    <Card>
      <div className="flex flex-col gap-3xl">
        {BTN_ROLES.map((role) => (
          <div key={role.key} className="flex flex-col gap-lg">
            <div className="flex items-center gap-lg flex-wrap">
              <Mono>{role.token}</Mono>
              {!role.exposed && (
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-wa100 text-warning-wa800">
                  토큰·CSS는 준비됨 · ButtonColor 타입 미노출
                </span>
              )}
            </div>

            <RoleSwatches role={role.key} />

            {role.exposed && (
              <div className="flex flex-wrap gap-lg items-center">
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
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  </Section>
);

/* ── 4. 폼 필드 상태 ────────────────────────────────────────── */

const FieldStateSection = () => (
  <Section
    title="폼 필드 상태"
    description="테두리·표면·포커스 링이 모두 color.field.* 와 component.field.* 로 표현된다. 높이는 component.field.height 로 web은 rem, RN은 숫자로 나간다."
  >
    <Card>
      <div className="flex flex-wrap gap-2xl items-start">
        <div className="flex flex-col gap-sm">
          <TextField label="기본" placeholder="입력하세요" />
          <Mono>color.field.border</Mono>
        </div>
        <div className="flex flex-col gap-sm">
          <TextField label="오류" error helperText="확인이 필요합니다" placeholder="입력하세요" />
          <Mono>color.field.focusRingError</Mono>
        </div>
        <div className="flex flex-col gap-sm">
          <TextField label="비활성" disabled placeholder="입력하세요" />
          <Mono>color.field.surfaceSubtle</Mono>
        </div>
        <div className="flex flex-col gap-sm">
          <TextField label="작은 크기" size="sm" placeholder="입력하세요" />
          <Mono>component.field.height.sm</Mono>
        </div>
      </div>
      <p className="text-text-light text-xs leading-relaxed mt-2xl">
        필드를 클릭해 포커스 링을 확인하세요 — 테두리가 3:1 대비를 담당하고, 옅은 글로우가 강조를
        더합니다.
      </p>
    </Card>
  </Section>
);

/* ── 5. Elevation & Motion ──────────────────────────────────── */

const ELEVATIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const ElevationSection = () => (
  <Section
    title="Elevation"
    description="boxShadow는 레이어별 자식 변수로 분해되지만, 바로 쓸 수 있는 합성 변수(--ds-shadow-*)를 함께 만든다. Tailwind shadow 유틸도 이 변수를 가리킨다."
  >
    <Card>
      <div className="flex flex-wrap gap-2xl">
        {ELEVATIONS.map((name) => (
          <div key={name} className="flex flex-col gap-md items-center">
            <div
              className="w-24 h-16 rounded-lg bg-background-surface border border-stroke-light"
              style={{ boxShadow: `var(--ds-shadow-${name})` }}
            />
            <Mono>{`shadow.${name}`}</Mono>
          </div>
        ))}
      </div>
    </Card>
  </Section>
);

const MotionSection = () => {
  const [on, setOn] = useState(false);
  const speeds = [
    { name: 'fast', varName: '--ds-motion-duration-fast' },
    { name: 'normal', varName: '--ds-motion-duration-normal' },
    { name: 'slow', varName: '--ds-motion-duration-slow' },
  ];

  return (
    <Section
      title="Motion"
      description="duration은 플랫폼마다 갈린다 — Web은 ms 문자열, RN은 숫자다. RN의 Animated.timing 이 숫자를 요구하기 때문이다."
    >
      <Card>
        <div className="flex flex-col gap-lg">
          {speeds.map((s) => (
            <div key={s.name} className="flex items-center gap-xl">
              <span className="w-28 shrink-0">
                <Mono>{`motion.duration.${s.name}`}</Mono>
              </span>
              <div className="flex-1 h-8 bg-background-default rounded-lg relative overflow-hidden">
                <div
                  className="absolute top-1 bottom-1 w-6 rounded bg-primary-pr500"
                  style={{
                    left: on ? 'calc(100% - 1.75rem)' : '0.25rem',
                    transitionProperty: 'left',
                    transitionDuration: `var(${s.varName})`,
                    transitionTimingFunction: 'var(--ds-motion-easing-standard)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2xl">
          <Button variant="outlined" size="sm" onClick={() => setOn((v) => !v)}>
            재생
          </Button>
        </div>
      </Card>
    </Section>
  );
};

/* ── 페이지 ─────────────────────────────────────────────────── */

export const DesignSystemPage = () => (
  <div data-testid="design-system-page" className="pb-6xl">
    <PageHeader
      badge="Design System"
      title="Design Tokens"
      description="토큰이 어떤 계층으로 구성되고, 컴포넌트가 그것을 어떻게 소비하며, 접근성 기준을 만족하는지 한 화면에서 확인합니다. 상단에서 테마를 바꾸면 모든 값이 함께 움직입니다."
    />

    <Group label="Overview">
      <LayerSection />
      <ContrastSection />
    </Group>

    <Group label="Components">
      <ButtonRoleSection />
      <FieldStateSection />
    </Group>

    <Group label="Styles">
      <ElevationSection />
      <MotionSection />
    </Group>
  </div>
);

export default DesignSystemPage;
