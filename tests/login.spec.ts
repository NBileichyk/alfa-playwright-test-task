import { test } from '../src/fixtures/page.fixtures';
import usersData from '../src/data/users.json' with { type: 'json' };

test.describe('Login with valid user', () => {
  test('Authenticate with valid user credentials', async ({ loginPage }) => {
    const user = usersData.standardUser_1;

    await test.step('Submit valid user credentials', async () => {
      await loginPage.navigate('/login');
      await loginPage.login(user.email, user.password);
    });

    await test.step('Show the successful login message', async () => {
      await loginPage.verifySuccessfulLoginMessage(user.firstName, user.lastName);
    });
  });
});

test.describe('Login with invalid user', () => {
  test('Reject invalid user credentials', async ({ loginPage }) => {
    await test.step('Submit invalid user credentials', async () => {
      await loginPage.navigate('/login');
      await loginPage.loginWithCredentials(
        usersData.invalidUser.email,
        usersData.invalidUser.password
      );
    });

    await test.step('Show an invalid login notification', async () => {
      await loginPage.verifyInvalidLoginErrorMessage();
    });
  });
});
