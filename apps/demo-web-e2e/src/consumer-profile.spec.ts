import { expect, type Page, test } from '@playwright/test';

/**
 * Consumer Extension의 브라우저 computed-style 검증.
 *
 * 컴파일러 단위 테스트가 확인할 수 없는 것을 본다 — CSS import 순서, selector 우선순위,
 * 실제 React 컴포넌트 소비, Tailwind 유틸리티, 그리고 브라우저가 최종적으로 계산한 값.
 *
 * Default는 extension이 없는 경로, Sample은 컴파일된 CSS가 적용된 경로다.
 */

const SHARED = {
  backgroundPrimaryLight: 'rgb(4, 120, 87)',
  backgroundPrimaryDark: 'rgb(19, 111, 71)',
  backgroundSecondaryLight: 'rgb(134, 90, 29)',
};

const SAMPLE = {
  backgroundPrimaryLight: 'rgb(91, 33, 182)',
  backgroundPrimaryDark: 'rgb(167, 139, 250)',
  backgroundPrimaryLightAlpha: 'rgba(91, 33, 182, 0.5)',
};

const gotoPage = async (page: Page) => {
  await page.goto('/consumer-profile');
  await expect(page.getByTestId('consumer-profile-page')).toBeVisible();
};

const setProfile = async (page: Page, profile: 'default' | 'sample') => {
  await page.getByTestId(`profile-${profile}`).click();
  await expect(page.getByTestId('theme-root')).toHaveAttribute('data-profile', profile);
};

const setTheme = async (page: Page, theme: 'light' | 'dark' | 'sepia') => {
  await page.getByTestId(`theme-${theme}`).click();
  await expect(page.getByTestId('theme-root')).toHaveAttribute('data-theme', theme);
};

/** 요소의 계산된 CSS 속성. */
const computed = (page: Page, testId: string, property: string) =>
  page
    .getByTestId(testId)
    .evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop).trim(), property);

/** 요소에서 본 CSS 변수의 계산된 값. */
const cssVar = (page: Page, testId: string, name: string) => computed(page, testId, name);

test.describe('default profile', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page);
    await setProfile(page, 'default');
  });

  test('uses the shared token value', async ({ page }) => {
    expect(await cssVar(page, 'theme-root', '--ds-background-primary')).toBe('#047857');
    expect(await computed(page, 'probe-background-primary', 'background-color')).toBe(
      SHARED.backgroundPrimaryLight,
    );
  });

  test('follows the shared dark delta', async ({ page }) => {
    await setTheme(page, 'dark');
    expect(await computed(page, 'probe-background-primary', 'background-color')).toBe(
      SHARED.backgroundPrimaryDark,
    );
  });

  test('derives the shared rgb channel', async ({ page }) => {
    expect(await cssVar(page, 'theme-root', '--ds-background-primary-rgb')).toBe('4 120 87');
  });
});

test.describe('sample profile', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page);
    await setProfile(page, 'sample');
  });

  test('overrides the semantic token in light', async ({ page }) => {
    expect(await cssVar(page, 'theme-root', '--ds-background-primary')).toBe('#5B21B6');
    expect(await computed(page, 'probe-background-primary', 'background-color')).toBe(
      SAMPLE.backgroundPrimaryLight,
    );
  });

  test('overrides the semantic token in dark', async ({ page }) => {
    await setTheme(page, 'dark');
    expect(await computed(page, 'probe-background-primary', 'background-color')).toBe(
      SAMPLE.backgroundPrimaryDark,
    );
  });

  test('generates the rgb channel without manual authoring', async ({ page }) => {
    expect(await cssVar(page, 'theme-root', '--ds-background-primary-rgb')).toBe('91 33 182');
    expect(await computed(page, 'probe-background-primary-rgb', 'background-color')).toBe(
      SAMPLE.backgroundPrimaryLightAlpha,
    );
  });

  test('leaves non-overridden tokens at the shared value', async ({ page }) => {
    expect(await computed(page, 'probe-background-secondary', 'background-color')).toBe(
      SHARED.backgroundSecondaryLight,
    );
  });

  test('reaches a real React UI component', async ({ page }) => {
    const button = page.getByTestId('probe-button-contained').getByRole('button');
    await expect(button).toBeVisible();
    expect(await button.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      SAMPLE.backgroundPrimaryLight,
    );
  });

  test('reaches shared tailwind utilities with no consumer preset', async ({ page }) => {
    expect(await computed(page, 'probe-tw-background-primary', 'background-color')).toBe(
      SAMPLE.backgroundPrimaryLight,
    );
    expect(await computed(page, 'probe-tw-background-primary-alpha', 'background-color')).toBe(
      SAMPLE.backgroundPrimaryLightAlpha,
    );
  });

  test('leaves a non-overridden tailwind utility alone', async ({ page }) => {
    expect(await computed(page, 'probe-tw-background-secondary', 'background-color')).toBe(
      SHARED.backgroundSecondaryLight,
    );
  });
});

test.describe('profile isolation', () => {
  test('switching back to default restores every shared value', async ({ page }) => {
    await gotoPage(page);

    const read = () =>
      Promise.all([
        computed(page, 'probe-background-primary', 'background-color'),
        computed(page, 'probe-tw-background-primary', 'background-color'),
        page
          .getByTestId('probe-button-contained')
          .getByRole('button')
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      ]);

    await setProfile(page, 'default');
    const before = await read();

    await setProfile(page, 'sample');
    const sample = await read();
    expect(sample).not.toEqual(before);

    await setProfile(page, 'default');
    expect(await read()).toEqual(before);
  });

  test('profile and theme switch independently', async ({ page }) => {
    await gotoPage(page);
    const root = page.getByTestId('theme-root');

    await setProfile(page, 'sample');
    await setTheme(page, 'dark');
    await expect(root).toHaveAttribute('data-profile', 'sample');
    await expect(root).toHaveAttribute('data-theme', 'dark');

    await setProfile(page, 'default');
    // theme는 그대로 유지된다.
    await expect(root).toHaveAttribute('data-theme', 'dark');
    expect(await computed(page, 'probe-background-primary', 'background-color')).toBe(
      SHARED.backgroundPrimaryDark,
    );
  });

  test('non-overridden spacing and radius are identical in both profiles', async ({ page }) => {
    await gotoPage(page);

    await setProfile(page, 'default');
    const defaults = [
      await computed(page, 'probe-spacing-md', 'padding-top'),
      await computed(page, 'probe-radius-lg', 'border-radius'),
    ];

    await setProfile(page, 'sample');
    expect([
      await computed(page, 'probe-spacing-md', 'padding-top'),
      await computed(page, 'probe-radius-lg', 'border-radius'),
    ]).toEqual(defaults);
  });
});
