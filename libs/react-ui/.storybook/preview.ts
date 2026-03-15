import { createElement } from 'react';
import type { Preview } from '@storybook/react';

import { ThemeProvider } from '../src/theme/ThemeProvider';
import '@berrypjh/design-tokens/css';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color|fill|stroke|shadow)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ['autodocs'],
  globalTypes: {
    themeMode: {
      name: 'Theme',
      description: 'Global theme mode',
      defaultValue: 'global',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'global', title: 'Global' },
          { value: 'dark', title: 'Dark' },
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

      const mode = context.globals.themeMode === 'dark' ? 'dark' : 'global';

      return createElement(ThemeProvider, { mode }, content);
    },
  ],
};

export default preview;
