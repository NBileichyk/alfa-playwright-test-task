import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/homepage.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ProductPage } from '../pages/product.page';
import { CategoryPage } from '../pages/category.page';

type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
  categoryPage: CategoryPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
});

export { expect };
