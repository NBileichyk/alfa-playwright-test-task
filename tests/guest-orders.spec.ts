import { test, expect } from '../src/fixtures/page.fixtures';
import { HOMEPAGE_CONSTANTS } from '../src/constants/homepage.constants';

test.describe('Guest order flow', () => {
  test('Order products without login', async ({ homePage, productPage, checkoutPage }) => {
    await test.step('Select two products and add them to the cart', async () => {
      await homePage.clickMostPopularProductByName(HOMEPAGE_CONSTANTS.greenDuckProduct);
      await expect(productPage.productTitle).toHaveText(HOMEPAGE_CONSTANTS.greenDuckProduct);
      await productPage.addProductToCart();

      await homePage.navigate('/');

      await homePage.clickMostPopularProductByName(HOMEPAGE_CONSTANTS.blueDuckProduct);
      await expect(productPage.productTitle).toHaveText(HOMEPAGE_CONSTANTS.blueDuckProduct);
      await productPage.addProductToCart();

      await homePage.cart.clickCart();
    });

    await checkoutPage.verifyOrderSummary([1, 1], 40);

    await test.step('Return to the home page', async () => {
      await homePage.navigate('/');

      await expect(homePage.recentlyViewedProductsBox).toBeVisible();
      await expect(homePage.recentlyViewedTitle).toBeVisible();
      await expect(homePage.recentlyViewedProducts).toHaveCount(2);
    });
  });
});
