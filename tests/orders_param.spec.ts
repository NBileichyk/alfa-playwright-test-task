import { authenticatedTest as test } from '../src/fixtures/authenticated-user.fixture';
import { expect } from '../src/fixtures/page.fixtures';
import { ProductHelper } from '../src/helpers/product.helper';

const testCasesData = [
  {
    title: 'Order a product without discount and change the quantity',
    userRole: 'standardUser_1' as const,
    isDiscounted: false,
    productIndex: 1,
    expectedQuantity: 3,
    priceType: 'price' as const,
    expectedStickerCount: 0,
  },
  {
    title: 'Order a product with discount and change the quantity',
    userRole: 'standardUser_2' as const,
    isDiscounted: true,
    productIndex: 0,
    expectedQuantity: 2,
    priceType: 'campaign' as const,
    expectedStickerCount: 1,
  },
];

test.describe('Product ordering parametrized suite', () => {
  testCasesData.forEach(
    ({
      title,
      userRole,
      isDiscounted,
      productIndex,
      expectedQuantity,
      priceType,
      expectedStickerCount,
    }) => {
      test.use({ userRole });

      test(title, async ({ homePage, categoryPage, checkoutPage, productPage }) => {
        let expectedTotal = 0;
        let productTitle: string;

        await test.step('Prepare an empty cart', async () => {
          await homePage.navigate('/checkout');
          await checkoutPage.clearExistingCart();
          await checkoutPage.openCategoryPage();
        });

        await test.step(`Select the product (${isDiscounted ? 'with discount' : 'without discount'})`, async () => {
          const selectedProduct = await ProductHelper.getProductByDiscountStatus(
            categoryPage.products.locator,
            isDiscounted,
            productIndex
          );

          const itemPrice = await ProductHelper.convertPriceToNumber(
            await selectedProduct.getPriceText(priceType)
          );
          expectedTotal = itemPrice * expectedQuantity;
          productTitle = await selectedProduct.getProductName();
          await selectedProduct.clickImage();

          await productPage.verifyProductTitle(productTitle);
          await expect(productPage.mainImage).toBeVisible();
          await expect(productPage.saleSticker).toHaveCount(expectedStickerCount);
        });

        await test.step(`Add ${expectedQuantity} units of the selected product to the cart`, async () => {
          await productPage.addProducts(expectedQuantity);

          await homePage.cart.verifyCartIsVisible();
          await homePage.cart.verifyCartQuantity(expectedQuantity);
        });

        await test.step('Go to the checkout page and verify the order data', async () => {
          await checkoutPage.openCheckoutPage();
          await checkoutPage.verifyOrderSummary([expectedQuantity], expectedTotal);
        });

        await test.step('Confirm the order', async () => {
          await checkoutPage.clickConfirmOrder();
          await checkoutPage.verifyOrderSuccess();
        });
      });
    }
  );
});
