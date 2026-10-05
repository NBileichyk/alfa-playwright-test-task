import { test as base } from './page.fixtures';
import { getUser, type UserData, type UserRole } from '../data/users';

type AuthenticatedUserFixtures = {
  loggedInUser: void;
  currentUser: UserData;
  userRole: UserRole;
};

export const authenticatedTest = base.extend<AuthenticatedUserFixtures>({
  userRole: ['standardUser_1', { option: true }],

  currentUser: async ({ userRole }, use) => {
    await use(getUser(userRole));
  },

  loggedInUser: [
    async ({ homePage, categoryPage, loginPage, currentUser }, use) => {
      await homePage.navigate('/login');
      await loginPage.login(currentUser.email, currentUser.password);
      await loginPage.verifySuccessfulLoginMessage(currentUser.firstName, currentUser.lastName);

      try {
        await use();
      } finally {
        await categoryPage.openCategoryPage();
        await loginPage.logout();
      }
    },
    { auto: true },
  ],
});
