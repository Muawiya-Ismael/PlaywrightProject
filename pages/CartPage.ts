import { Page, Locator } from "@playwright/test";

export class CartPageClass {
    private checkoutButton: Locator;
    private removeButtons: Locator;
    private _items: Locator;

    constructor(private page: Page) {
        this.checkoutButton = this.page.locator('[data-test="checkout"]');
        this.removeButtons = this.page.locator("button.cart_button");
        this._items = this.page.locator(".cart_item");
    }

    async removeItemByIndex(index: number) {
        await this.removeButtons.nth(index).click();
    }

    async clickCheckoutButton() {
        await this.checkoutButton.click();
    }

    async itemsCount() {
        return await this._items.count();
    }
}