import { test, expect } from '@playwright/test';

test.describe('Berry UI Demo', () => {
  test('homepage loads with hero title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Berry UI' })).toBeVisible();
  });

  test('navigates to TextField page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'TextField' }).click();
    await expect(page).toHaveURL('/components/text-field');
    await expect(page.getByRole('heading', { name: 'TextField' })).toBeVisible();
  });

  test('navigates to Select page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Select' }).click();
    await expect(page).toHaveURL('/components/select');
    await expect(page.getByRole('heading', { name: 'Select' })).toBeVisible();
  });

  test('component cards on homepage are clickable', async ({ page }) => {
    await page.goto('/');
    await page.getByText('FAB').first().click();
    await expect(page).toHaveURL('/components/fab');
  });
});
