import { test as base } from './page.fixtures';
import usersData from '../data/users.json' with { type: 'json' };

type UserRole = Exclude<keyof typeof usersData, 'invalidUser'>;
type UserData = (typeof usersData)[UserRole];

type AuthenticatedUserFixtures = {
  loggedInUser: void;
  currentUser: UserData;
  userRole: UserRole;
};

export const authenticatedTest = base.extend<AuthenticatedUserFixtures>({
  userRole: ['standardUser_1', { option: true }],

  currentUser: async ({ userRole }, use) => {
    await use(usersData[userRole]);
  },

  loggedInUser: [
    async ({ homePage, categoryPage, loginPage, currentUser }, use) => {
      await homePage.navigate('/login');
      await loginPage.login(currentUser.email, currentUser.password);
      await loginPage.verifySuccessfulLoginMessage(currentUser.firstName, currentUser.lastName);

      try {
        await use();
      } finally {
        await categoryPage.openCategory();
        await loginPage.logout();
      }
    },
    { auto: true },
  ],
});
