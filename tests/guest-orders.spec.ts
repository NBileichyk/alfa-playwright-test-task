import { test } from '../src/fixtures/page.fixtures';

test.describe('Guest order flow', () => {
  test('Order products without login', async ({
    homePage,
    categoryPage,
    productPage,
    checkoutPage,
  }) => {
    let viewedProductUrls: string[] = [];
    let firstProduct = { name: '', url: '' };
    let secondProduct = { name: '', url: '' };

    await test.step('Open the category page and add the first product and add it to the cart', async () => {
      await categoryPage.openCategory();
      firstProduct = await categoryPage.openProductByIndex(0);
      await productPage.verifyProductTitle(firstProduct.name);
      await productPage.addProductToCart();
      //!!! ASSERT
    });

    await test.step('Open the category page and add the second product to the cart', async () => {
      await categoryPage.openCategory();
      secondProduct = await categoryPage.openProductByIndex(1);
      await productPage.verifyProductTitle(secondProduct.name);
      await productPage.addProductToCart();
      //!!! ASSERT
    });

    await test.step('Verify that both products are in the order summary', async () => {
      viewedProductUrls = [secondProduct.url, firstProduct.url];
      const expectedTotal = await homePage.cart.getTotal();

      await checkoutPage.openCheckoutPage();
      await checkoutPage.verifyOrderSummary([1, 1], expectedTotal);
    });

    await test.step('Return to the home page and verify Recently Viewed products', async () => {
      await homePage.openHomePage();
      await homePage.verifyRecentlyViewedProductsInOrder(viewedProductUrls);
    });
  });
});
