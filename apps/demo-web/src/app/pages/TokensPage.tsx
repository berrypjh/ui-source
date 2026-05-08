import { ReactNode } from 'react';

import { Web } from '@berrypjh/react-ui';

import { PageHeader } from '../components/DemoSection';

const { tokens } = Web.Light;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mb-12">
    <h2 className="text-text-default text-lg font-semibold mb-4">{title}</h2>
    <div className="bg-background-surface border border-stroke-default rounded-xl p-6">
      {children}
    </div>
  </section>
);

const Mono = ({ children }: { children: ReactNode }) => (
  <code className="font-mono text-xs text-text-light">{children}</code>
);

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <h3 className="text-text-light text-xs font-semibold uppercase tracking-wide mb-3">{children}</h3>
);

const Swatch = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col gap-1.5 min-w-[110px]">
    <div
      className="w-full h-14 rounded-lg border border-stroke-default"
      style={{ background: value }}
    />
    <div className="text-text-default text-xs font-medium">{name}</div>
    <Mono>{value}</Mono>
  </div>
);

const ColorSection = () => (
  <Section title="Color">
    {Object.entries(tokens.color).map(([group, scale]) => (
      <div key={group} className="mb-7">
        <SectionLabel>{group}</SectionLabel>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(110px,1fr))]">
          {Object.entries(scale as Record<string, string>).map(([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </div>
      </div>
    ))}
  </Section>
);

type TypographyToken = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
};

const TypographySample = ({ name, token }: { name: string; token: TypographyToken }) => (
  <div className="flex items-baseline gap-6 py-3 border-b border-stroke-light">
    <div className="min-w-[160px]">
      <div className="text-text-default text-xs font-semibold">{name}</div>
      <Mono>
        {token.fontSize} / {token.fontWeight}
      </Mono>
    </div>
    <div
      className="text-text-default flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
      style={{
        fontFamily: token.fontFamily,
        fontSize: token.fontSize,
        fontWeight: Number(token.fontWeight),
        letterSpacing: `${token.letterSpacing}px`,
        lineHeight: 1.2,
      }}
    >
      The quick brown fox jumps
    </div>
  </div>
);

const TypographySection = () => {
  const groups = ['display', 'heading', 'body', 'paragraph', 'caption'] as const;
  return (
    <Section title="Typography">
      {groups.map((group) => {
        const styles = (tokens.typography as Record<string, unknown>)[group] as
          | Record<string, TypographyToken>
          | undefined;
        if (!styles) return null;
        return (
          <div key={group} className="mb-6">
            <SectionLabel>{group}</SectionLabel>
            {Object.entries(styles).map(([name, token]) => (
              <TypographySample key={name} name={name} token={token} />
            ))}
          </div>
        );
      })}
    </Section>
  );
};

const SpacingSection = () => (
  <Section title="Spacing">
    <div className="flex flex-col gap-2">
      {Object.entries(tokens.spacing as Record<string, string>).map(([name, value]) => (
        <div key={name} className="flex items-center gap-4">
          <div className="min-w-[80px] text-text-default text-xs font-medium">{name}</div>
          <div className="h-3.5 rounded-sm bg-primary-pr500" style={{ width: value }} />
          <Mono>{value}</Mono>
        </div>
      ))}
    </div>
  </Section>
);

const RadiusSection = () => (
  <Section title="Radius">
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(110px,1fr))]">
      {Object.entries(tokens.radius as Record<string, string>).map(([name, value]) => (
        <div key={name} className="flex flex-col gap-1.5">
          <div
            className="w-full h-16 bg-primary-pr100 border border-primary-pr200"
            style={{ borderRadius: value }}
          />
          <div className="text-text-default text-xs font-medium">{name}</div>
          <Mono>{value}</Mono>
        </div>
      ))}
    </div>
  </Section>
);

const BorderWidthSection = () => {
  const groups = tokens.borderWidth as {
    primitive: Record<string, string>;
    semantic: Record<string, string>;
  };
  return (
    <Section title="Border Width">
      {(['primitive', 'semantic'] as const).map((group) => (
        <div key={group} className="mb-4">
          <SectionLabel>{group}</SectionLabel>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(110px,1fr))]">
            {Object.entries(groups[group]).map(([name, value]) => (
              <div key={name} className="flex flex-col gap-1.5">
                <div
                  className="w-full h-12 bg-background-surface"
                  style={{ border: `${value} solid var(--ds-primary-pr500)` }}
                />
                <div className="text-text-default text-xs font-medium">{name}</div>
                <Mono>{value}</Mono>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
};

const ShadowSection = () => {
  const shadowKeys = Object.keys(tokens.shadow);
  return (
    <Section title="Shadow">
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))]">
        {shadowKeys.map((name) => (
          <div key={name} className="flex flex-col gap-2">
            <div
              className="w-full h-16 bg-background-surface rounded-lg"
              style={{ boxShadow: `var(--ds-shadow-${name})` }}
            />
            <div className="text-text-default text-xs font-medium">{name}</div>
            <Mono>--ds-shadow-{name}</Mono>
          </div>
        ))}
      </div>
    </Section>
  );
};

export const TokensPage = () => (
  <div>
    <PageHeader
      title="Design Tokens"
      description="`@berrypjh/react-ui`이 export하는 Light 테마 토큰의 시각 카탈로그."
      badge="Tokens"
    />
    <ColorSection />
    <TypographySection />
    <SpacingSection />
    <RadiusSection />
    <BorderWidthSection />
    <ShadowSection />
  </div>
);
