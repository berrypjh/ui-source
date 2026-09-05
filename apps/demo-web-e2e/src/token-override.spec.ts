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
  await page.goto('/verify');
  await expect(page.getByTestId('verify-page')).toBeVisible();
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
    await page.goto('/verify/profile');
    const button = page.getByTestId('probe-button-contained').getByRole('button');
    await expect(button).toBeVisible();
    expect(await button.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      SAMPLE.backgroundPrimaryLight,
    );
  });

  test('reaches shared tailwind utilities with no consumer preset', async ({ page }) => {
    await page.goto('/verify/profile');
    expect(await computed(page, 'probe-tw-background-primary', 'background-color')).toBe(
      SAMPLE.backgroundPrimaryLight,
    );
    expect(await computed(page, 'probe-tw-background-primary-alpha', 'background-color')).toBe(
      SAMPLE.backgroundPrimaryLightAlpha,
    );
  });

  test('leaves a non-overridden tailwind utility alone', async ({ page }) => {
    await page.goto('/verify/profile');
    expect(await computed(page, 'probe-tw-background-secondary', 'background-color')).toBe(
      SHARED.backgroundSecondaryLight,
    );
  });
});

test.describe('profile isolation', () => {
  test('switching back to default restores every shared value', async ({ page }) => {
    await page.goto('/verify/profile');
    await expect(page.getByTestId('profile-page')).toBeVisible();

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

test.describe('runtime verification surface', () => {
  /**
   * Demo 의 Runtime Verification 패널은 ThemeProvider 바깥에 probe 를 심어 Default 와 Sample 을
   * 동시에 측정한다. 그 메커니즘은 실제 브라우저에서만 성립하므로(CSS 복합 선택자 매칭 +
   * getComputedStyle) 여기서 한 번 확인한다. 개별 계약의 상세 검증은 위 테스트들이 담당한다.
   */
  test('reports every integration contract as passing', async ({ page }) => {
    await gotoPage(page);

    const panel = page.getByTestId('runtime-verification');
    await expect(panel).toBeVisible();

    // 측정이 끝나 상태가 확정될 때까지 기다린다.
    await expect(page.getByTestId('check-override')).toHaveAttribute('data-status', 'pass');

    for (const id of ['override', 'preserved', 'derived', 'react-ui', 'tailwind']) {
      await expect(page.getByTestId(`check-${id}`), `${id} 계약`).toHaveAttribute(
        'data-status',
        'pass',
      );
    }
  });

  test('keeps reporting pass after switching theme', async ({ page }) => {
    await gotoPage(page);
    await setTheme(page, 'dark');

    for (const id of ['override', 'preserved', 'derived', 'react-ui']) {
      await expect(page.getByTestId(`check-${id}`)).toHaveAttribute('data-status', 'pass');
    }
  });
});

test.describe('demo runtime health', () => {
  /** 콘솔 에러는 실제 실행에서만 드러난다 — 깨진 import, React 오류, 누락된 자산 등. */
  test('loads every demo route without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (e) => errors.push(e.message));

    // 화면의 h1 으로 확인한다. AppShell 은 어떤 경로에서든 <main> 을 렌더하므로
    // <main> 만 보면 존재하지 않는 경로에서도 통과해 버린다.
    const ROUTES: [path: string, heading: string][] = [
      ['/', '개요'],
      ['/verify', 'Runtime'],
      ['/verify/profile', 'Consumer Profile'],
      ['/tokens', 'Tokens'],
      ['/foundation', 'Styles'],
      ['/components/button', 'Button'],
      ['/components/select', 'Select'],
    ];

    for (const [path, heading] of ROUTES) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1, name: heading }), path).toBeVisible();
    }

    expect(errors).toEqual([]);
  });
});
