import { Page } from '@playwright/test';
import { ProductSectionComponent } from '../components/product-section.component';
import { BasePage } from './base.page';

export class CategoryPage extends BasePage {
  products: ProductSectionComponent;

  constructor(page: Page) {
    super(page);

    this.products = new ProductSectionComponent(
      page.locator('.listing-wrapper.products'),
      'Category products'
    );
  }
}
