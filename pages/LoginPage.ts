import { Page } from '@playwright/test';

export class LoginPageClass {
    private username;
    private password;
    private loginButton;
    private errorMassage;

    constructor(private page: Page) {
        this.username = this.page.locator('[data-test="username"]');
        this.password = this.page.locator('[data-test="password"]');
        this.loginButton = this.page.locator('[data-test="login-button"]');
        this.errorMassage = this.page.locator('[data-test="error"]');
    }

    async goto() {
        await this.page.goto('/');
    }

    getErrorMessage() {
        return this.errorMassage;
    }

    async login(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}