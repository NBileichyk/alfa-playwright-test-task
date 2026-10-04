import { Locator, Page } from '@playwright/test';
import { ProductSectionComponent } from '../components/product-section.component';
import { BasePage } from './base.page';

export type SelectedProduct = {
  name: string;
  url: string;
};

export class CategoryPage extends BasePage {
  categoryTitle: Locator;
  filters: Locator;
  categoriesListing: Locator;
  productsListing: Locator;
  products: ProductSectionComponent;

  constructor(page: Page) {
    super(page);

    this.categoryTitle = page.locator('h1.title');
    this.filters = page.locator('nav.filter');
    this.categoriesListing = page.locator('.listing-wrapper.categories');
    this.productsListing = page.locator('.listing-wrapper.products');
    this.products = new ProductSectionComponent(this.productsListing, 'Category products');
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  async openProductByIndex(index: number): Promise<SelectedProduct> {
    const product = await this.products.getProductByIndex(index);
    const selectedProduct = {
      name: await product.getProductName(),
      url: await product.getProductUrl(),
    };

    await product.clickImage();
    return selectedProduct;
  }
}
