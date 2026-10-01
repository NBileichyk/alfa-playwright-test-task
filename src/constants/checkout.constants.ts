export const CHECKOUT_PAGE_CONSTANTS = {
  emptyCartMessage: 'There are no items in your cart.',
  backLink: 'Back',
  homeLink: 'Home',
  removeCartItemButton: 'Remove',
  confirmOrderButton: /confirm order|place order|submit order/i,
  orderSuccessMessage: /your order.*(is|has been)|order.*(created|placed|confirmed)|success/i,
} as const;
