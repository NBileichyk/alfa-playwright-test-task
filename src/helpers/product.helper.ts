import { Locator } from '@playwright/test';
import { ProductCardComponent } from '../components/product-card.component';

export class ProductHelper {
  static convertPriceToNumber(price: string): number {
    const normalizedPrice = price.replace(/[^0-9.-]/g, '');

    if (!/^-?\d+(?:\.\d+)?$/.test(normalizedPrice)) {
      throw new Error(`Invalid product price: "${price}".`);
    }

    return Number(normalizedPrice);
  }

  static async getFilteredProducts(
    sectionLocator: Locator,
    isDiscounted: boolean
  ): Promise<ProductCardComponent[]> {
    const allProductsInSection = sectionLocator.locator('.product.column.shadow.hover-light');
    const totalCount = await allProductsInSection.count();
    const filteredProducts: ProductCardComponent[] = [];

    for (let i = 0; i < totalCount; i++) {
      const productLocator = allProductsInSection.nth(i);
      const productCard = new ProductCardComponent(productLocator);

      const productIsDiscounted = await productCard.isDiscounted();

      if (isDiscounted === productIsDiscounted) {
        filteredProducts.push(productCard);
      }
    }

    return filteredProducts;
  }

  static async getAllProducts(sectionLocator: Locator): Promise<ProductCardComponent[]> {
    const allProductsInSection = sectionLocator.locator('.product.column.shadow.hover-light');
    const totalCount = await allProductsInSection.count();
    const products: ProductCardComponent[] = [];

    for (let i = 0; i < totalCount; i++) {
      const productLocator = allProductsInSection.nth(i);
      products.push(new ProductCardComponent(productLocator));
    }

    return products;
  }

  static async getProductByIndex(
    sectionLocator: Locator,
    index: number = 0
  ): Promise<ProductCardComponent | null> {
    const products = await ProductHelper.getAllProducts(sectionLocator);

    if (index < 0 || index >= products.length) {
      return null;
    }

    return products[index];
  }

  static async getProductByDiscountStatus(
    sectionLocator: Locator,
    isDiscounted: boolean,
    index: number = 0
  ): Promise<ProductCardComponent> {
    const matchingProducts = await ProductHelper.getFilteredProducts(sectionLocator, isDiscounted);
    const discountLabel = isDiscounted ? 'discounted' : 'regular (non-discounted)';

    if (matchingProducts.length === 0) {
      throw new Error(`No ${discountLabel} products found in the specified section.`);
    }

    if (!Number.isInteger(index) || index < 0 || index >= matchingProducts.length) {
      throw new Error(
        `Product index ${index} is out of bounds. Only ${matchingProducts.length} ${discountLabel} products available.`
      );
    }

    return matchingProducts[index];
  }
}
