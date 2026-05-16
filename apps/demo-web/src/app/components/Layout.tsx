import { ReactNode, useState } from 'react';

import { ThemeName, ThemeProvider, themes } from '@berrypjh/react-ui';

import { NavLink, useLocation } from 'react-router-dom';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ThemeToggle = ({ mode, onChange }: { mode: ThemeName; onChange: (m: ThemeName) => void }) => (
  <div
    role="group"
    aria-label="Theme"
    className="inline-flex border border-stroke-default rounded-lg overflow-hidden bg-background-surface"
  >
    {themes.map((t) => {
      const isActive = mode === t.name;
      return (
        <button
          key={t.name}
          type="button"
          onClick={() => onChange(t.name)}
          aria-pressed={isActive}
          className={
            isActive
              ? 'px-3 py-1.5 text-xs font-medium border-0 cursor-pointer transition-all bg-primary-pr500 text-text-contrastText'
              : 'px-3 py-1.5 text-xs font-medium border-0 cursor-pointer transition-all bg-transparent text-text-light'
          }
        >
          {capitalize(t.name)}
        </button>
      );
    })}
  </div>
);

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'Home', path: '/' },
      { label: 'Design Tokens', path: '/tokens' },
    ],
  },
  {
    label: 'Components',
    items: [
      { label: 'Button', path: '/components/button' },
      { label: 'TextField', path: '/components/text-field' },
      { label: 'Select', path: '/components/select' },
      { label: 'SearchField', path: '/components/search-field' },
      { label: 'FAB', path: '/components/fab' },
      { label: 'IconButton', path: '/components/icon-button' },
    ],
  },
];

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [mode, setMode] = useState<ThemeName>('light');

  return (
    <ThemeProvider
      mode={mode}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: 240,
            minHeight: '100vh',
            background: '#0f172a',
            color: '#e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 100,
            overflowY: 'auto',
          }}
        >
          {/* Logo */}
          <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1e293b' }}>
            <div
              style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.5px' }}
            >
              Berry UI
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Component Library</div>
          </div>

          {/* Nav */}
          <nav style={{ padding: '16px 0', flex: 1 }}>
            {NAV_GROUPS.map((group) => (
              <div key={group.label} style={{ marginBottom: 8 }}>
                <div
                  style={{
                    padding: '6px 20px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                  }}
                >
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const isActive =
                    item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={{
                        display: 'block',
                        padding: '8px 20px',
                        fontSize: 14,
                        color: isActive ? '#f8fafc' : '#94a3b8',
                        textDecoration: 'none',
                        background: isActive ? '#1e293b' : 'transparent',
                        borderLeft: isActive ? '2px solid #6366f1' : '2px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #1e293b',
              fontSize: 12,
              color: '#475569',
            }}
          >
            @berrypjh/react-ui
          </div>
        </aside>

        {/* Main */}
        <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Top bar */}
          <header
            className="bg-background-surface border-b border-stroke-default"
            style={{
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 32px',
              position: 'sticky',
              top: 0,
              zIndex: 50,
            }}
          >
            <span className="text-text-light text-sm">
              {location.pathname === '/'
                ? 'Getting Started'
                : location.pathname
                    .replace('/components/', '')
                    .replace(/^\//, '')
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
            <ThemeToggle mode={mode} onChange={setMode} />
          </header>

          {/* Content — 페이지 메인 배경. Tailwind 클래스로 토큰 사용. light/dark/sepia에서 자동 변환 */}
          <main
            className="bg-background-default text-text-default"
            style={{ flex: 1, padding: '40px 48px', minHeight: 0 }}
          >
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};
