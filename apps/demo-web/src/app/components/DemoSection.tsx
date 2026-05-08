import { ReactNode } from 'react';

interface DemoSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const DemoSection = ({ title, description, children }: DemoSectionProps) => (
  <div className="mb-12">
    <h2 className="text-text-default text-xl font-semibold mb-1">{title}</h2>
    {description && <p className="text-text-light text-sm mb-5">{description}</p>}
    <div className="bg-background-surface border border-stroke-default rounded-xl p-8 flex flex-wrap gap-4 items-center">
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
  <div className="mb-10">
    {badge && (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 bg-primary-pr100 text-primary-pr700">
        {badge}
      </span>
    )}
    <h1 className="text-text-default text-3xl font-bold tracking-tight mb-2.5">{title}</h1>
    <p className="text-text-light text-base max-w-[600px]">{description}</p>
    <div className="h-px bg-stroke-default mt-8" />
  </div>
);

export const PropTag = ({ children }: { children: ReactNode }) => (
  <code className="inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-background-default text-text-default">
    {children}
  </code>
);
