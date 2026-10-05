import { test, expect } from '../src/fixtures/page.fixtures';
import { getUser, invalidUser } from '../src/data/users';

test.describe('Valid login', () => {
  test('Log in with valid credentials', async ({ loginPage }) => {
    const user = getUser('standardUser_1');

    await test.step('Submit valid credentials', async () => {
      await loginPage.navigate('/login');
      await loginPage.login(user.email, user.password);
    });

    await test.step('Verify successful login', async () => {
      await loginPage.verifySuccessfulLoginMessage(user.firstName, user.lastName);
      await expect(loginPage.successfulLoginMessage).toBeVisible();
    });
  });
});

test.describe('Invalid login', () => {
  test('Reject invalid credentials', async ({ loginPage }) => {
    await test.step('Submit invalid credentials', async () => {
      await loginPage.navigate('/login');
      await loginPage.login(invalidUser.email, invalidUser.password);
    });

    await test.step('Verify the login error', async () => {
      await loginPage.verifyInvalidLoginErrorMessage();
      await expect(loginPage.invalidLoginErrorMessage).toBeVisible();
    });
  });
});
