import { authenticatedTest as test } from '../src/fixtures/authenticated-user.fixture';
import { expect } from '../src/fixtures/page.fixtures';
import { ProductHelper } from '../src/helpers/product.helper';

const orderScenarios = [
  {
    title: 'Order a product without discount',
    userRole: 'standardUser_1' as const,
    isDiscounted: false,
    productIndex: 1,
    expectedQuantity: 3,
    priceType: 'price' as const,
    expectedStickerCount: 0,
  },
  {
    title: 'Order a product with discount',
    userRole: 'standardUser_2' as const,
    isDiscounted: true,
    productIndex: 0,
    expectedQuantity: 2,
    priceType: 'campaign' as const,
    expectedStickerCount: 1,
  },
];

for (const scenario of orderScenarios) {
  test.describe(scenario.title, () => {
    test.use({ userRole: scenario.userRole });

    test(`Complete order ${scenario.isDiscounted ? 'with' : 'without'} discount`, async ({
      homePage,
      categoryPage,
      checkoutPage,
      productPage,
    }) => {
      const { isDiscounted, productIndex, expectedQuantity, priceType, expectedStickerCount } =
        scenario;
      let expectedTotal = 0;
      let productName = '';

      await test.step('Clear the cart', async () => {
        await homePage.navigate('/checkout');
        await checkoutPage.clearExistingCart();
        await checkoutPage.openCategoryPage();
      });

      await test.step(`Select a ${isDiscounted ? 'discounted' : 'non-discounted'} product`, async () => {
        const selectedProduct = await ProductHelper.getProductByDiscountStatus(
          categoryPage.products.locator,
          isDiscounted,
          productIndex
        );
        const itemPrice = await ProductHelper.convertPriceToNumber(
          await selectedProduct.getPriceText(priceType)
        );

        expectedTotal = itemPrice * expectedQuantity;
        productName = await selectedProduct.getProductName();
        await selectedProduct.clickImage();

        await productPage.verifyProductTitle(productName);
        await expect(productPage.mainImage).toBeVisible();
        await expect(productPage.saleSticker).toHaveCount(expectedStickerCount);
      });

      await test.step(`Add ${expectedQuantity} items to the cart`, async () => {
        await productPage.addProducts(expectedQuantity);
        await homePage.cart.verifyCartIsVisible();
        await homePage.cart.verifyCartQuantity(expectedQuantity);
      });

      await test.step('Verify the checkout summary', async () => {
        await checkoutPage.openCheckoutPage();
        await checkoutPage.verifyOrderSummary([expectedQuantity], expectedTotal, [productName]);
      });

      await test.step('Place the order', async () => {
        await checkoutPage.clickConfirmOrder();
        await checkoutPage.verifyOrderSuccess();
      });
    });
  });
}
