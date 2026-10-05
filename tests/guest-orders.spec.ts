import { test, expect } from '../src/fixtures/page.fixtures';
import { ProductHelper } from '../src/helpers/product.helper';

test.describe('Guest checkout', () => {
  test('Order two products without signing in', async ({
    homePage,
    categoryPage,
    productPage,
    checkoutPage,
  }) => {
    let viewedProductUrls: string[] = [];
    let firstProduct = { name: '', url: '' };
    let secondProduct = { name: '', url: '' };
    let firstProductPrice = 0;
    let secondProductPrice = 0;

    await test.step('Select and add the first product', async () => {
      await homePage.navigate('/rubber-ducks-c-1/');
      await categoryPage.openCategoryPage();
      const product = await categoryPage.products.getProductByIndex(0);
      firstProduct = {
        name: await product.getProductName(),
        url: await product.getProductUrl(),
      };
      firstProductPrice = await ProductHelper.convertPriceToNumber(
        await product.getPriceText((await product.isDiscounted()) ? 'campaign' : 'price')
      );
      await product.clickImage();
      await productPage.verifyProductTitle(firstProduct.name);
      await productPage.addProductToCart();
    });

    await test.step('Select and add the second product', async () => {
      await categoryPage.openCategoryPage();
      const product = await categoryPage.products.getProductByIndex(1);
      secondProduct = {
        name: await product.getProductName(),
        url: await product.getProductUrl(),
      };
      secondProductPrice = await ProductHelper.convertPriceToNumber(
        await product.getPriceText((await product.isDiscounted()) ? 'campaign' : 'price')
      );
      await product.clickImage();
      await productPage.verifyProductTitle(secondProduct.name);
      await productPage.addProductToCart();
    });

    await test.step('Verify cart items and total', async () => {
      viewedProductUrls = [secondProduct.url, firstProduct.url];
      const expectedTotal = firstProductPrice + secondProductPrice;
      await homePage.cart.verifyCartSummary(2, expectedTotal);

      await checkoutPage.openCheckoutPage();
      await checkoutPage.verifyOrderSummary([1, 1], expectedTotal, [
        firstProduct.name,
        secondProduct.name,
      ]);
    });

    await test.step('Verify guest details are blank', async () => {
      await expect(checkoutPage.firstNameInput).toBeEmpty();
      await expect(checkoutPage.lastNameInput).toBeEmpty();
      await expect(checkoutPage.emailInput).toBeEmpty();
    });

    await test.step('Verify recently viewed products', async () => {
      await homePage.openHomePage();
      await homePage.verifyRecentlyViewedProductsInOrder(viewedProductUrls);
    });
  });
});
