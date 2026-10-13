import { Locator } from '@playwright/test';
import { ProductCardComponent } from './product-card.component';
import { ProductHelper } from '../helpers/product.helper';

export class ProductSectionComponent {
  locator: Locator;
  sectionName: string;

  constructor(locator: Locator, sectionName: string) {
    this.locator = locator;
    this.sectionName = sectionName;
  }

  async getProductByIndex(index: number = 0): Promise<ProductCardComponent> {
    const product = await ProductHelper.getProductByIndex(this.locator, index);

    if (!product) {
      throw new Error(`No product at index ${index} in the "${this.sectionName}" section.`);
    }

    return product;
  }

  async getProductByDiscountStatus(
    isDiscounted: boolean,
    index: number = 0
  ): Promise<ProductCardComponent> {
    return ProductHelper.getProductByDiscountStatus(this.locator, isDiscounted, index);
  }
}
