import { getStoryContext, type TestRunnerConfig } from '@storybook/test-runner';
import { checkA11y, configureAxe, injectAxe } from 'axe-playwright';

// Storybook test-runner + axe-playwright 기반 WCAG 자동 검사.
// WCAG 2.0/2.1 Level A + AA. 위반 시 CI fail.
// 기존 위반은 stories의 `parameters.a11y.disable = true`로 baseline 처리 — 후속 PR에서 점진 수정.
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    if (storyContext.parameters?.a11y?.disable) return;

    await configureAxe(page, {
      rules: [{ id: 'color-contrast', enabled: true }],
    });
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    });
  },
};

export default config;
