import { test, expect } from '@playwright/test';
import { LoginPageClass } from '../pages/LoginPage';
import { InventoryPageClass } from '../pages/InventoryPage';

test.describe('Sort Feature', () => {
    let testNumber = 0;
    let loginPage: LoginPageClass;
    let inventoryPage: InventoryPageClass;

    test.beforeAll(async ({ browser }, testInfo) => {
        const page = await browser.newPage();
        loginPage = new LoginPageClass(page);
        await loginPage.goto();
        await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
        await page.context().storageState({ path: 'playwright/.auth/user.json' });
        await page.close();
        console.log(`Running tests on browser: ${testInfo.project.name}`);
    });

    test.afterAll(async ({ page }) => {
        await page.close();
    });

    test.beforeEach(async ({ context, page }, testInfo) => {
        const storageState = JSON.parse(require('fs').readFileSync('playwright/.auth/user.json', 'utf-8'));
        await context.addCookies(storageState.cookies);
        testNumber++;
         console.log(`Running test ${testNumber}: ${testInfo.title}`);
        inventoryPage = new InventoryPageClass(page);
        await inventoryPage.goto();
    });

      test.afterEach(async ({},testInfo) => {
        console.log(`Finished test ${testNumber}: ${testInfo.title}`);
  });

  
  test('default sort order is A-Z', async ({ page }) => {
    const names = await page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort());
  });

  test('sort products A-Z', async ({page }) => {
    await inventoryPage.sortBy('Name (A to Z)');
    const names = await page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort());
  });

  test('sort products Price high to low', async ({page }) => {
    await inventoryPage.sortBy('Price (high to low)');
    const pricesText = await page.locator('.inventory_item_price').allTextContents();
    const prices = pricesText.map(price => parseFloat(price.replace('$', '')));
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('default sort option is Name (A to Z) after page reload', async ({page }) => {
    const initialSortOption = await inventoryPage.getSortSelectedOption();
    expect(initialSortOption).toBe('Name (A to Z)');
    await inventoryPage.sortBy('Price (high to low)');
    const changedSortOption = await inventoryPage.getSortSelectedOption();
    expect(changedSortOption).toBe('Price (high to low)');
    await page.reload();
    const reloadedSortOption = await inventoryPage.getSortSelectedOption();
    expect(reloadedSortOption).toBe('Name (A to Z)');
    const names = await page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort());
  });

  test.fail('default sort option is not Name (Z to A) after page reload', async ({page }) => {
     const initialSortOption = await inventoryPage.getSortSelectedOption();
    expect(initialSortOption).toBe('Name (A to Z)');
    await inventoryPage.sortBy('Price (high to low)');
    const changedSortOption = await inventoryPage.getSortSelectedOption();
    expect(changedSortOption).toBe('Price (high to low)');
    await page.reload();
    const reloadedSortOption = await inventoryPage.getSortSelectedOption();
    expect(reloadedSortOption).toBe('Name (Z to A)');
    const names = await page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort());
  });
});