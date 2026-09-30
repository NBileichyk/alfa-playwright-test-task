import { Page } from '@playwright/test';
import { CartComponent } from '../components/cart.component';

export class BasePage {
  protected page: Page;
  readonly cart: CartComponent;

  constructor(page: Page) {
    this.page = page;
    this.cart = new CartComponent(page);
  }

  async navigate(path: string = '/') {
    await this.page.goto(path);
  }
}
