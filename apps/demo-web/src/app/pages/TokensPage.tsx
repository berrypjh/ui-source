import { ReactNode } from 'react';

import { Web } from '@berrypjh/design-tokens';

import { PageHeader } from '../components/DemoSection';

const { tokens } = Web.Light;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2
      style={{
        fontSize: 18,
        fontWeight: 600,
        color: '#0f172a',
        margin: '0 0 16px',
      }}
    >
      {title}
    </h2>
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 24,
      }}
    >
      {children}
    </div>
  </section>
);

const Mono = ({ children }: { children: ReactNode }) => (
  <code
    style={{
      fontFamily: 'monospace',
      fontSize: 12,
      color: '#475569',
    }}
  >
    {children}
  </code>
);

const Swatch = ({ name, value }: { name: string; value: string }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      minWidth: 110,
    }}
  >
    <div
      style={{
        width: '100%',
        height: 56,
        borderRadius: 8,
        background: value,
        border: '1px solid #e2e8f0',
      }}
    />
    <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 500 }}>{name}</div>
    <Mono>{value}</Mono>
  </div>
);

const ColorSection = () => (
  <Section title="Color">
    {Object.entries(tokens.color).map(([group, scale]) => (
      <div key={group} style={{ marginBottom: 28 }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            margin: '0 0 12px',
          }}
        >
          {group}
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: 16,
          }}
        >
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
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 24,
      padding: '12px 0',
      borderBottom: '1px solid #f1f5f9',
    }}
  >
    <div style={{ minWidth: 160 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{name}</div>
      <Mono>
        {token.fontSize} / {token.fontWeight}
      </Mono>
    </div>
    <div
      style={{
        fontFamily: token.fontFamily,
        fontSize: token.fontSize,
        fontWeight: Number(token.fontWeight),
        letterSpacing: `${token.letterSpacing}px`,
        lineHeight: 1.2,
        color: '#0f172a',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
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
          <div key={group} style={{ marginBottom: 24 }}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                margin: '0 0 4px',
              }}
            >
              {group}
            </h3>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(tokens.spacing as Record<string, string>).map(([name, value]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ minWidth: 80, fontSize: 13, color: '#0f172a', fontWeight: 500 }}>
            {name}
          </div>
          <div
            style={{
              height: 14,
              width: value,
              background: '#6366f1',
              borderRadius: 2,
            }}
          />
          <Mono>{value}</Mono>
        </div>
      ))}
    </div>
  </Section>
);

const RadiusSection = () => (
  <Section title="Radius">
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: 16,
      }}
    >
      {Object.entries(tokens.radius as Record<string, string>).map(([name, value]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              width: '100%',
              height: 64,
              background: '#e0e7ff',
              border: '1px solid #c7d2fe',
              borderRadius: value,
            }}
          />
          <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 500 }}>{name}</div>
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
        <div key={group} style={{ marginBottom: 16 }}>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              margin: '0 0 12px',
            }}
          >
            {group}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
              gap: 16,
            }}
          >
            {Object.entries(groups[group]).map(([name, value]) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  style={{
                    width: '100%',
                    height: 48,
                    background: '#ffffff',
                    border: `${value} solid #6366f1`,
                  }}
                />
                <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 500 }}>{name}</div>
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 24,
        }}
      >
        {shadowKeys.map((name) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                width: '100%',
                height: 64,
                background: '#ffffff',
                borderRadius: 8,
                boxShadow: `var(--ds-shadow-${name})`,
              }}
            />
            <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 500 }}>{name}</div>
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
      description="`@berrypjh/design-tokens`이 export하는 Light 테마 토큰의 시각 카탈로그."
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
