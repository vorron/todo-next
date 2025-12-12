import { expect, test } from '@playwright/test';

test('smoke: login → todos → search → detail → back', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Username').fill('sasha');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/todos/);
  await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();

  const search = page.getByLabel('Search todos');
  await search.fill('Рефакторинг');

  const todoTitle = 'Рефакторинг текущего проекта';
  await expect(page.getByText(todoTitle)).toBeVisible();

  await page.getByText(todoTitle).click();
  await expect(page).toHaveURL(/\/todos\//);

  await expect(page.getByRole('heading', { level: 1 })).toContainText(todoTitle);

  await page.getByRole('button', { name: '← Back to Todos' }).click();
  await expect(page).toHaveURL(/\/todos(\?|$)/);
});
