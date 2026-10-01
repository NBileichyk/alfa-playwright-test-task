import { test as base } from '@playwright/test';
import usersData from '../data/users.json' with { type: 'json' };
import { LoginPage } from '../pages/login.page';
import { CatalogPage } from '../pages/catalog.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ProductPage } from '../pages/product.page';

// Define available user roles from our JSON file
type UserRole = keyof typeof usersData;

type MyFixtures = {
  loginPage: LoginPage;
  // Fixture that accepts a user role and performs login
  loginAsUser: (role?: UserRole) => Promise<void>;
  catalogPage: CatalogPage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  loginAsUser: async ({ loginPage }, use) => {
    const loginFn = async (role: UserRole = 'standardUser') => {
      const user = usersData[role];

      if (!user) {
        throw new Error(`User with role "${role}" not found in users.json`);
      }

      await loginPage.navigate('/login');
      await loginPage.login(user.email, user.password);
      await loginPage.verifySuccessfulLogin(user.firstName, user.lastName);
    };

    // Pass the login function to the test
    await use(loginFn);
  },
});

export { expect } from '@playwright/test';
