import { expect, test } from '@playwright/test';

/** 정보 구조 스모크 — 사이드바에서 각 작업 영역으로 이동할 수 있는지. */

test.describe('네비게이션', () => {
  test('개요가 첫 화면이다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('overview-page')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: '개요' })).toBeVisible();
  });

  const DESTINATIONS = [
    { name: 'Runtime', url: '/verify', testId: 'verify-page' },
    { name: 'Consumer Profile', url: '/verify/profile', testId: 'profile-page' },
    { name: 'Tokens', url: '/tokens', testId: 'tokens-page' },
    { name: 'Styles', url: '/foundation', testId: 'foundation-page' },
  ];

  for (const { name, url, testId } of DESTINATIONS) {
    test(`사이드바에서 ${name} 로 이동한다`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByTestId(testId)).toBeVisible();
    });
  }

  test('컴포넌트로 이동한다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'TextField', exact: true }).click();
    await expect(page).toHaveURL('/components/text-field');
    await expect(page.getByRole('heading', { level: 1, name: 'TextField' })).toBeVisible();
  });

  test('현재 위치를 표시한다', async ({ page }) => {
    await page.goto('/tokens');
    await expect(page.getByRole('link', { name: 'Tokens', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
