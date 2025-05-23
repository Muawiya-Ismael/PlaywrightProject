import { test, expect } from '@playwright/test';
import { LoginPageClass } from '../pages/LoginPage';


const invalidCredentials = [
    {
        name: 'invalid username',
        username: 'invalid_user',
        password: process.env.SAUCE_PASSWORD!,
        expectedError: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
        name: 'invalid password',
        username: process.env.SAUCE_USERNAME!,
        password: 'invalid_password',
        expectedError: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
        name: 'invalid username and password',
        username: 'invalid_user',
        password: 'invalid_password',
        expectedError: 'Epic sadface: Username and password do not match any user in this service',
    },
];

const missingCredentials = [
    {
        name: 'missing username',
        username: '',
        password: process.env.SAUCE_PASSWORD!,
        expectedError: 'Epic sadface: Username is required',
    },
    {
        name: 'missing password',
        username: process.env.SAUCE_USERNAME!,
        password: '',
        expectedError: 'Epic sadface: Password is required',
    },
    {
        name: 'missing username and password',
        username: '',
        password: '',
        expectedError: 'Epic sadface: Username is required',
    },
];


test.describe('Login Feature', () => {
    let testNumber = 0;
    let loginPage: LoginPageClass;

    test.beforeAll(async ({ page }, testInfo) => {
        console.log(`Running tests on browser: ${testInfo.project.name}`);
    });

    test.afterAll(async ({ page }) => {
        await page.close();
    });

    test.beforeEach(async ({ page }, testInfo) => {
        loginPage = new LoginPageClass(page);
        await loginPage.goto();
        testNumber++;
            console.log(`Running test ${testNumber}: ${testInfo.title}`);

    });

     test.afterEach(async ({},testInfo) => {
        console.log(`Finished test ${testNumber}: ${testInfo.title}`);
  });


    test('valid user', async ({ page }) => {
        await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
        await expect(page).toHaveURL(/inventory.html/);
    });

    test.fail('valid user shall navigate to /inventory.html/ page not / page', async ({ page }) => {
        await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
        await expect(page).toBeNull();
    });

    test.describe('invalid credentials', () => {
        invalidCredentials.forEach(({ name, username, password, expectedError }) => {
            test(name, async ({ page }) => {
                await loginPage.login(username, password);
                await expect(loginPage.getErrorMessage()).toBeVisible();
                await expect(loginPage.getErrorMessage()).toHaveText(expectedError);
            });
        });
    });

    test.describe('missing credentials', () => {
        missingCredentials.forEach(({ name, username, password, expectedError }) => {
            test(name, async ({ page }) => {
                await loginPage.login(username, password);
                await expect(loginPage.getErrorMessage()).toBeVisible();
                await expect(loginPage.getErrorMessage()).toHaveText(expectedError);
            });
        });
    });

});