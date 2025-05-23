import { Page, Locator } from '@playwright/test';

export class CartPageClass {
  private checkoutButton;
  private removeButtons;
  private items;

  constructor(private page: Page) {
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.removeButtons = this.page.locator('button.cart_button');
    this.items = this.page.locator('.cart_item');
  }

  async removeItemByIndex(index: number) {
    await this.removeButtons.nth(index).click();
  }

  async clickCheckoutButton() {
    await this.checkoutButton.click();
  }
}