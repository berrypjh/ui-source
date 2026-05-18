import '@berrypjh/ui-core/css';
import '../src/styles';

import { createElement } from 'react';

import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

import { ThemeProvider } from '../src/theme/ThemeProvider';

const dsViewports = {
  mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' }, type: 'mobile' },
  tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
} as const;

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color|fill|stroke|shadow)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: { ...dsViewports, ...INITIAL_VIEWPORTS },
    },
  },
  initialGlobals: {
    viewport: { value: 'responsive' },
  },
  tags: ['autodocs'],
  globalTypes: {
    themeMode: {
      name: 'Theme',
      description: 'Theme mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'sepia', title: 'Sepia' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const story = createElement(Story);
      const content = createElement(
        'div',
        {
          style: {
            padding: '24px',
            boxSizing: 'border-box',
            background:
              context.globals.themeMode === 'dark'
                ? 'var(--ds-neutral-ne900)'
                : 'var(--ds-neutral-ne100)',
            color:
              context.globals.themeMode === 'dark'
                ? 'var(--ds-text-contrast-text)'
                : 'var(--ds-text-default)',
          },
        },
        story,
      );

      if (context.parameters.disableThemeDecorator === true) {
        return content;
      }

      const mode = context.globals.themeMode;

      return createElement(ThemeProvider, { mode, children: content });
    },
  ],
};

export default preview;
