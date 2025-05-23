import { expect, Page, test } from "@playwright/test";
import { LoginPageClass } from "../pages/LoginPage";
import { InventoryPageClass } from "../pages/InventoryPage";
import { CartPageClass } from "../pages/CartPage";
import { CheckoutPageClass } from "../pages/CheckoutPage";

test.describe("Checkout Feature", () => {
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
        await sharedPage.context().storageState({ path: "auth.json" });
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
            require("fs").readFileSync("auth.json", "utf-8"),
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

    test.describe("Checkout", () => {
        test.fail("checkout button visibility", async ({ page }) => {
            const cartPage = new CartPageClass(page);
            await page.goto("/cart.html");

            const cartItems = await cartPage.itemsCount();
            expect(cartItems).toBe(0);

            const checkoutButton = page.locator('[data-test="checkout"]');
            await expect(checkoutButton).toHaveCount(0);
        });

        test("Checkout with one item", async ({ page }) => {
            inventoryPage = new InventoryPageClass(page);
            const cartPage = new CartPageClass(page);
            const checkoutPage = new CheckoutPageClass(page);

            await inventoryPage.goto();
            await inventoryPage.addItemByIndex(0);

            await inventoryPage.openCart();

            const checkoutBtn = page.locator('[data-test="checkout"]');
            await expect(checkoutBtn).toBeVisible();

            await cartPage.clickCheckoutButton();

            await checkoutPage.fillInformation("User", "Customer", "69420");

            await checkoutPage.finishCheckout();

            checkoutPage.finishCheckout

            await expect(checkoutPage.completeMsg).toBeVisible();
            await expect(checkoutPage.completeMsg).toContainText(
                "Thank you for your order",
            );
        });
    });
});