import { Page, Locator } from '@playwright/test';

export class CheckoutPageClass {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueBtn: Locator;
  readonly finishBtn: Locator;
  readonly completeMsg: Locator;

  constructor(readonly page: Page) {
    this.firstName = this.page.locator('[data-test="firstName"]');
    this.lastName = this.page.locator('[data-test="lastName"]');
    this.postalCode = this.page.locator('[data-test="postalCode"]');
    this.continueBtn = this.page.locator('[data-test="continue"]');
    this.finishBtn = this.page.locator('[data-test="finish"]');
    this.completeMsg = this.page.locator('.complete-header');
  }

  async fillInformation(first: string, last: string, postal: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(postal);
    await this.continueBtn.click();
  }

  async finishCheckout() {
    await this.finishBtn.click();
  }
}