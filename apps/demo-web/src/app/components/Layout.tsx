import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@berrypjh/react-ui';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ label: 'Home', path: '/' }],
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
      { label: 'BubbleButton', path: '/components/bubble-button' },
    ],
  },
];

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <ThemeProvider style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            style={{
              height: 56,
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              padding: '0 32px',
              background: '#ffffff',
              position: 'sticky',
              top: 0,
              zIndex: 50,
            }}
          >
            <span style={{ fontSize: 14, color: '#64748b' }}>
              {location.pathname === '/'
                ? 'Getting Started'
                : location.pathname
                    .replace('/components/', '')
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          </header>

          {/* Content */}
          <main style={{ flex: 1, background: '#f8fafc', padding: '40px 48px', minHeight: 0 }}>
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};
