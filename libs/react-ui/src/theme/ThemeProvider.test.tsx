import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createRenderer, describeConformance } from '../../test';

import { ThemeProvider } from './ThemeProvider';
import { themeProviderClasses } from './ThemeProvider.constants';

describe('<ThemeProvider />', () => {
  const { render } = createRenderer();

  describeConformance(<ThemeProvider>hello</ThemeProvider>, () => ({
    render,
    classes: themeProviderClasses,
    refInstanceof: HTMLDivElement,
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'rootClass'],
  }));

  describe('root', () => {
    it('children을 렌더링해야 한다', () => {
      render(
        <ThemeProvider>
          <button type="button">hello</button>
        </ThemeProvider>,
      );

      expect(screen.getByRole('button', { name: 'hello' })).toBeInTheDocument();
    });

    it('기본 mode는 light 이어야 한다', () => {
      render(<ThemeProvider>content</ThemeProvider>);

      const root = screen.getByText('content');

      expect(root).toHaveClass(themeProviderClasses.root);
      expect(root).toHaveAttribute('data-theme', 'light');
    });

    it('전달한 mode를 data-theme에 적용해야 한다', () => {
      render(<ThemeProvider mode="dark">content</ThemeProvider>);

      const root = screen.getByText('content');

      expect(root).toHaveAttribute('data-theme', 'dark');
    });

    it('className을 root class와 함께 병합해야 한다', () => {
      render(<ThemeProvider className="custom-theme-provider">content</ThemeProvider>);

      const root = screen.getByText('content');

      expect(root).toHaveClass(themeProviderClasses.root);
      expect(root).toHaveClass('custom-theme-provider');
    });

    it('style을 root element에 적용해야 한다', () => {
      render(
        <ThemeProvider style={{ padding: '12px', backgroundColor: 'rgb(0, 0, 0)' }}>
          content
        </ThemeProvider>,
      );

      const root = screen.getByText('content');

      expect(root).toHaveStyle({
        padding: '12px',
        backgroundColor: 'rgb(0, 0, 0)',
      });
    });

    it('추가 div props를 root element에 전달해야 한다', () => {
      render(
        <ThemeProvider aria-label="theme root" id="theme-provider-root">
          content
        </ThemeProvider>,
      );

      const root = screen.getByLabelText('theme root');

      expect(root).toHaveAttribute('id', 'theme-provider-root');
      expect(root).toHaveClass(themeProviderClasses.root);
    });
  });
});
