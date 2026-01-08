# Playwright Test Automation Project

This project contains end-to-end tests written using Playwright for an e-commerce application.

## Overview

The tests are written in TypeScript and follow the Page Object Model (POM) design pattern to ensure clean and maintainable code. The project is configured to run tests against various browsers as supported by Playwright.

## Features Tested

The test suite covers the following key features of the e-commerce application:

*   **Login**: Verifies user authentication.
*   **Product Sorting**: Tests the functionality of sorting products on the products page.
*   **Add to Cart**: Ensures that items can be successfully added to the shopping cart.
*   **Remove from Cart**: Validates that items can be removed from the shopping cart.
*   **Checkout**: Tests the complete checkout process.

## Project Structure

*   `tests/`: Contains all the Playwright test files (`.spec.ts`).
*   `pages/`: Contains the Page Object Models (POMs) for different pages of the application (e.g., LoginPage, CartPage).
*   `playwright.config.ts`: The main configuration file for Playwright, where you can define browsers, reporters, and other settings.
*   `package.json`: Lists the project dependencies and scripts.
*   `.env`: Used for storing environment variables like URLs and credentials. A `.env.example` should be created to show the required variables.

## Getting Started

### Prerequisites

*   Node.js and npm installed.

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Install the Playwright browsers:
    ```bash
    npx playwright install
    ```

### Configuration

1.  Create a `.env` file in the root of the project.
2.  Add the necessary environment variables to the `.env` file, such as the application URL and user credentials. For example:
    ```
    BASE_URL=https://www.saucedemo.com/
    USERNAME=standard_user
    PASSWORD=secret_sauce
    ```

### Running the Tests

To run the entire test suite, use the following command:

```bash
npx playwright test
```

To run the tests in headed mode, use:

```bash
npx playwright test --headed
```

To view the test report after a run, use:

```bash
npx playwright show-report
```
