import { test as base } from './page.fixtures';
import { UserRole } from '../enums/user-role.enum';
import { getUser } from '../data/users';
import type { UserData } from '../types/user-data.interface';

type AuthenticatedUserFixtures = {
  loggedInUser: void;
  currentUser: UserData;
  userRole: UserRole;
};

export const authenticatedTest = base.extend<AuthenticatedUserFixtures>({
  userRole: [UserRole.STANDARD_USER_1, { option: true }],

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
