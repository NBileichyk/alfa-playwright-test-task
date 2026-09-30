import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  // Method to verify the successful login message with dynamic first and last name
  async verifySuccessfulLogin(firstName: string, lastName: string) {
    const successMessage = this.page
      .locator('.notice.success')
      .filter({ hasText: `You are now logged in as ${firstName} ${lastName}` });

    await expect(successMessage).toBeVisible();
  }
}
