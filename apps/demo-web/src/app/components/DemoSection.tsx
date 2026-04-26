import { ReactNode } from 'react';

interface DemoSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const DemoSection = ({ title, description, children }: DemoSectionProps) => (
  <div style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{title}</h2>
    {description && (
      <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>{description}</p>
    )}
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 32,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  </div>
);

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
}

export const PageHeader = ({ title, description, badge }: PageHeaderProps) => (
  <div style={{ marginBottom: 40 }}>
    {badge && (
      <span
        style={{
          display: 'inline-block',
          padding: '2px 10px',
          background: '#ede9fe',
          color: '#6d28d9',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        {badge}
      </span>
    )}
    <h1
      style={{
        fontSize: 32,
        fontWeight: 700,
        color: '#0f172a',
        margin: '0 0 10px',
        letterSpacing: '-0.5px',
      }}
    >
      {title}
    </h1>
    <p style={{ fontSize: 16, color: '#64748b', margin: 0, maxWidth: 600 }}>{description}</p>
    <div style={{ height: 1, background: '#e2e8f0', marginTop: 32 }} />
  </div>
);

export const PropTag = ({ children }: { children: ReactNode }) => (
  <code
    style={{
      display: 'inline-block',
      padding: '1px 6px',
      background: '#f1f5f9',
      color: '#334155',
      borderRadius: 4,
      fontSize: 12,
      fontFamily: 'monospace',
    }}
  >
    {children}
  </code>
);
