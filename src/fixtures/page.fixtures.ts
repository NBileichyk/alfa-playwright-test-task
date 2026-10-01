import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/homepage.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ProductPage } from '../pages/product.page';

type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await page.goto('/');
    await use(new HomePage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
});

export { expect };
