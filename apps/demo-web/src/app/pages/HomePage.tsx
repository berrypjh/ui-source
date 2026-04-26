import { useNavigate } from 'react-router-dom';
import { Button } from '@berrypjh/react-ui';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          borderRadius: 20,
          padding: '60px 48px',
          marginBottom: 48,
          color: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 20,
            backdropFilter: 'blur(8px)',
          }}
        >
          @berrypjh/react-ui
        </div>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            margin: '0 0 16px',
            letterSpacing: '-1px',
            lineHeight: 1.1,
          }}
        >
          Berry UI
        </h1>
        <p
          style={{
            fontSize: 18,
            color: '#c7d2fe',
            margin: '0 0 32px',
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          A clean, accessible React component library built with design tokens and Tailwind CSS.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="lg"
            onClick={() => navigate('/components/button')}
            style={{ background: '#ffffff', color: '#4338ca', fontWeight: 600 }}
          >
            Browse Components
          </Button>
          <Button
            variant="outlined"
            size="lg"
            onClick={() => window.open('https://github.com/berrypjh/ui-source', '_blank')}
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}
          >
            View on GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};
