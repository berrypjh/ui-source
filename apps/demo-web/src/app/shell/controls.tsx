import { ReactNode } from 'react';

/**
 * 전역 컨트롤. Topbar 에 고정 배치해 어느 페이지에서든 같은 자리에서 현재 상태를 읽고 바꾼다.
 *
 * pill 이 아니라 segmented control 이다 — 선택지가 상호배타적이고 개수가 고정이라
 * 개발 도구에서 가장 읽기 쉬운 형태다.
 */
export const Segmented = <T extends string>({
  label,
  value,
  options,
  onChange,
  testIdPrefix,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  testIdPrefix: string;
}) => (
  <div className="flex items-center gap-md">
    {/* 좁은 화면에서는 접는다. group 의 aria-label 이 이름을 계속 제공한다. */}
    <span className="hidden md:inline text-text-light text-xxsm whitespace-nowrap">{label}</span>
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-sm border border-stroke-default overflow-hidden"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            data-testid={`${testIdPrefix}-${o.value}`}
            className={[
              'px-md py-xs text-xxsm border-0 cursor-pointer transition-colors',
              active
                ? 'bg-background-primary text-text-contrastText'
                : 'bg-background-surface text-text-light hover:text-text-default',
            ].join(' ')}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  </div>
);

/** 상태 한 줄. 색만으로 의미를 전달하지 않도록 점 + 텍스트를 함께 쓴다. */
export const StatusDot = ({ tone }: { tone: 'ok' | 'warn' | 'error' | 'idle' }) => {
  const color = {
    ok: 'bg-success-su600',
    warn: 'bg-warning-wa600',
    error: 'bg-error-er600',
    idle: 'bg-neutral-ne400',
  }[tone];
  return <span className={`inline-block w-1.5 h-1.5 rounded-xs shrink-0 ${color}`} aria-hidden />;
};

export const StatusRow = ({
  name,
  tone,
  status,
  detail,
  testId,
}: {
  name: ReactNode;
  tone: 'ok' | 'warn' | 'error' | 'idle';
  status: string;
  detail?: ReactNode;
  testId?: string;
}) => (
  // 결론(status)이 항상 오른쪽 끝 같은 자리에 오도록 폭을 고정한다. 보조 설명은 그 앞에 둔다.
  <div
    data-testid={testId}
    data-status={tone}
    className="flex items-baseline gap-md py-md border-t border-stroke-light first:border-t-0"
  >
    <span className="flex items-center gap-sm min-w-0 flex-1">
      <StatusDot tone={tone} />
      <span className="text-text-default text-xsm truncate">{name}</span>
    </span>
    {detail}
    <span className="text-text-light text-xxsm shrink-0 w-[72px] text-right">{status}</span>
  </div>
);
