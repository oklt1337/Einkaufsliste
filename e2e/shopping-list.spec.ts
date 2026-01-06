import { test, expect, type APIRequestContext } from '@playwright/test';

const apiBaseUrl = 'http://localhost:4100';

const clearData = async (request: APIRequestContext) => {
  const itemsResponse = await request.get(`${apiBaseUrl}/items`);
  const items = (await itemsResponse.json()) as { id: string }[];
  await Promise.all(items.map((item) => request.delete(`${apiBaseUrl}/items/${item.id}`)));
  await request.put(`${apiBaseUrl}/list`, { data: { title: 'Meine Liste' } });
};

test.beforeEach(async ({ request }) => {
  await clearData(request);
});

test('add, toggle, and delete item', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Produkt').fill('Apfel');
  await page.getByRole('button', { name: 'Hinzufügen' }).click();

  await expect(page.getByText('Apfel')).toBeVisible();
  await expect(page.getByLabel('Anzahl von Apfel')).toHaveText('1');

  await page.getByLabel('Apfel gekauft').check();
  await expect(page.getByText('Apfel')).toHaveCSS('text-decoration-line', 'line-through');

  await page.getByRole('button', { name: 'Apfel löschen' }).click();
  await expect(page.getByText('Apfel')).not.toBeVisible();
});

test('adding same item increases quantity', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Produkt').fill('Milch');
  await page.getByRole('button', { name: 'Hinzufügen' }).click();
  await page.getByLabel('Produkt').fill('Milch');
  await page.getByRole('button', { name: 'Hinzufügen' }).click();

  await expect(page.getByLabel('Anzahl von Milch')).toHaveText('2');
});

test('title persists after reload', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Titel bearbeiten' }).click();
  const titleInput = page.getByRole('textbox', { name: 'Listenname' });
  await titleInput.waitFor();
  await titleInput.fill('Party Liste');
  await page.getByRole('button', { name: 'Speichern' }).click();

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Party Liste' })).toBeVisible();
});

test('drag and drop reorders items', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Produkt').fill('Apfel');
  await page.getByRole('button', { name: 'Hinzufügen' }).click();
  await page.getByLabel('Produkt').fill('Brot');
  await page.getByRole('button', { name: 'Hinzufügen' }).click();

  const listItems = page.getByRole('list').getByRole('listitem');
  await expect(listItems.nth(0)).toContainText('Apfel');
  await expect(listItems.nth(1)).toContainText('Brot');

  const dragHandle = page.getByLabel('Brot verschieben');
  const dropTarget = page.getByRole('listitem').filter({ hasText: 'Apfel' }).first();
  const handleBox = await dragHandle.boundingBox();
  const targetBox = await dropTarget.boundingBox();
  if (!handleBox || !targetBox) {
    throw new Error('Drag handles not visible');
  }
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
    steps: 10,
  });
  await page.mouse.up();

  await expect(listItems.nth(0)).toContainText('Brot', { timeout: 10_000 });
  await expect(listItems.nth(1)).toContainText('Apfel');
});

test('quantity buttons increase and decrease', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Produkt').fill('Kaffee');
  await page.getByRole('button', { name: 'Hinzufügen' }).click();

  const qty = page.getByLabel('Anzahl von Kaffee');
  await expect(qty).toHaveText('1');

  await page.getByRole('button', { name: 'Kaffee Anzahl erhöhen' }).click();
  await expect(qty).toHaveText('2');

  await page.getByRole('button', { name: 'Kaffee Anzahl verringern' }).click();
  await expect(qty).toHaveText('1');
});
