import { Page, Locator } from '@playwright/test';

export class InventoryPageClass {
  private addButton:Locator;
  private removeButton;
  private cartBadge;
  private sortSelect;

  constructor(private page: Page) {
    this.addButton= this.page.locator('button.btn_inventory');
    this.removeButton = this.page.locator('button.btn_secondary');
    this.cartBadge = this.page.locator('.shopping_cart_badge');
    this.sortSelect = this.page.locator('.product_sort_container');
  }

  getCartBadge() {
    return this.cartBadge;
  }

  getAddButton() {
    //return this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    return this.addButton;
  }

  getRemoveButton() : Locator {
    return this.page.locator('[data-test="remove-sauce-labs-backpack"]');
    return this.removeButton;
  }

  async addItemByIndex(index: number) {
    //await this.page.locator('button.btn_inventory').nth(index).click();
    await this.addButton.nth(index).click();
  }

  async removeItemByIndex(index: number) {
    //await this.page.locator('button.btn_secondary').nth(index).click();
    await this.removeButton.nth(index).click();
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async sortBy(option: string) {
    await this.sortSelect.selectOption({ label: option });
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

// async getSortSelectedOption() {
//   return await this.page.locator('[data-test="product_sort_container"] >> option[selected]').textContent();
// }

async getSortSelectedOption() {
  return await this.page.locator('.product_sort_container').evaluate(select => {
    return (select as HTMLSelectElement).options[
      (select as HTMLSelectElement).selectedIndex
    ].textContent;
  });
}
}