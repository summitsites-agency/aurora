import { cartTotalCents } from '../cart/cartReducer.js';
import { SHIPPING_CENTS, FREE_SHIPPING_OVER_CENTS } from '../data/productDetail.js';

/** Free over the threshold, and free on an empty bag — charging shipping on
 *  nothing would show $12.00 on a checkout with no items. */
export function shippingFor(subtotalCents) {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_OVER_CENTS ? 0 : SHIPPING_CENTS;
}

export function orderTotals(cart) {
  const subtotalCents = cartTotalCents(cart);
  const shippingCents = shippingFor(subtotalCents);
  return { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}
