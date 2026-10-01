import { test as base } from './page.fixtures';
import usersData from '../data/users.json' with { type: 'json' };

type UserRole = Exclude<keyof typeof usersData, 'invalidUser'>;

type AuthenticatedUserFixtures = {
  authenticatedUser: void;
  userRole: UserRole;
};

export const authenticatedTest = base.extend<AuthenticatedUserFixtures>({
  userRole: ['standardUser_1', { option: true }],

  authenticatedUser: [
    async ({ homePage, checkoutPage, loginPage, userRole }, use) => {
      const user = usersData[userRole];

      await homePage.navigate('/login');
      await loginPage.login(user.email, user.password);
      await loginPage.verifySuccessfulLogin(user.firstName, user.lastName);

      try {
        await use();
      } finally {
        await checkoutPage.clickHomeAfterSuccessfulOrder();
        await loginPage.logout();
      }
    },
    { auto: true },
  ],
});
