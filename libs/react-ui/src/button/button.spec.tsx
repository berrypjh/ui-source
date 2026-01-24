import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(
      <Button
        variant="primary"
        size="md"
        fullWidth={false}
        radiusTokenKey="radius.md"
        disabled={false}
        loading={false}
      >
        <span>Click me</span>
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Click me' })).toBeTruthy();
  });
});
