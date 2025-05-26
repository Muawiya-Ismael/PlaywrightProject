import { expect, Page, test } from "@playwright/test";
import { LoginPageClass } from "../pages/LoginPage";
import { InventoryPageClass } from "../pages/InventoryPage";
import { CartPageClass } from "../pages/CartPage";

test.describe("Remove From Cart Feature", () => {
    let testNumber = 0;
    let loginPage: LoginPageClass;
    let inventoryPage: InventoryPageClass;
    let sharedPage: Page;

    test.beforeAll(async ({ browser }, testInfo) => {
        sharedPage = await browser.newPage();
        loginPage = new LoginPageClass(sharedPage);
        await loginPage.goto();
        await loginPage.login(
            process.env.SAUCE_USERNAME!,
            process.env.SAUCE_PASSWORD!,
        );
        await sharedPage.context().storageState({ path: '../playwright/.auth/user.json' });
        await sharedPage.close();
        console.log(`Running tests on browser: ${testInfo.project.name}`);
    });

    test.afterAll(async () => {
        if (sharedPage && !sharedPage.isClosed()) {
            await sharedPage.close();
        }
    });

    test.beforeEach(async ({ context, page }, testInfo) => {
        const storageState = JSON.parse(
            require("fs").readFileSync('../playwright/.auth/user.json', "utf-8"),
        );
        await context.addCookies(storageState.cookies);
        testNumber++;
        console.log(`Running test ${testNumber}: ${testInfo.title}`);
        inventoryPage = new InventoryPageClass(page);
        await inventoryPage.goto();
    });

    test.afterEach(async ({}, testInfo) => {
        console.log(`Finished test ${testNumber}: ${testInfo.title}`);
    });

    test.describe("Remove button test", () => {
        test("add button appears after removing item in home page", async ({}) => {
            await inventoryPage.addItemByIndex(0);

            const removeButtonLocator = inventoryPage.getRemoveButton();
            const firstRemoveButton = removeButtonLocator.nth(0);
            await expect(firstRemoveButton).toBeVisible();

            await firstRemoveButton.click();

            const newFirstAddButton = inventoryPage.getAddButton().nth(0);
            await expect(newFirstAddButton).toBeVisible();

            const buttonText = await newFirstAddButton.textContent();
            expect(buttonText?.toLowerCase()).toContain("add to cart");
        });

        test("remove item from cart page after adding from inventory", async ({
            page,
        }) => {
            await inventoryPage.addItemByIndex(0);
            await inventoryPage.openCart();

            const cartPage = new CartPageClass(page);

            await cartPage.removeItemByIndex(0);

            const itemsCount = await cartPage.itemsCount();
            expect(itemsCount).toBe(0);
        });
    });

    test.describe("cart Badge test", () => {
        test("cart is empty after removing an item", async ({}) => {
            await inventoryPage.addItemByIndex(0);

            const removeButtonLocator = inventoryPage.getRemoveButton();
            const firstRemoveButton = removeButtonLocator.nth(0);
            await firstRemoveButton.click();

            const cartBadge = inventoryPage.getCartBadge();
            await expect(cartBadge).not.toBeVisible();
        });
    });
});