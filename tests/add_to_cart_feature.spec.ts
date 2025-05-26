import { test, expect } from '@playwright/test';
import { LoginPageClass } from '../pages/LoginPage';
import { InventoryPageClass } from '../pages/InventoryPage';


test.describe('Add to Cart Feature', () => {
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

  test.beforeEach(async ({ context , page}, testInfo) => {
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


  test.describe('add to cart / remove button test', () => {

    test('add to cart button shall be visible', async ({ }) => {
      const addButtonLocator = inventoryPage.getAddButton();
      await expect(addButtonLocator.nth(0)).toBeVisible();
      
      const cartBadge = inventoryPage.getCartBadge();
      await expect(cartBadge).not.toBeVisible();
    });

    test('remove button appears after adding item', async ({ }) => {

      await inventoryPage.addItemByIndex(0);
      
      const removeButtonLocator = inventoryPage.getRemoveButton();
      await expect(removeButtonLocator.nth(0)).toBeVisible();
      
      const cartBadge = inventoryPage.getCartBadge();
      await expect(cartBadge).toBeVisible();
      await expect(cartBadge).toHaveText('1');
    });
  });

  test.describe('cart Badge test', () => {
    test('cart is initially empty', async ({ }) => {
      const cartBadge = inventoryPage.getCartBadge();
      await expect(cartBadge).not.toBeVisible();
    });

    test.fail('ensure cart is initially empty not visible', async ({ }) => {
      const cartBadge = inventoryPage.getCartBadge();
      await expect(cartBadge).toBeVisible();
    });

    test('cart badge updates when adding item', async ({ }) => {
      await inventoryPage.addItemByIndex(0);
      
      const cartBadge = inventoryPage.getCartBadge();
      await expect(cartBadge).toBeVisible();
      await expect(cartBadge).toHaveText('1');
    });

    test('cart badge disappears when removing item', async ({  }) => {
      await inventoryPage.addItemByIndex(0);
      await inventoryPage.removeItemByIndex(0);
      
      const cartBadge = inventoryPage.getCartBadge();
      await expect(cartBadge).not.toBeVisible();
    });
  });
});