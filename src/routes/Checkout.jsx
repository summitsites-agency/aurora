import { Link } from 'react-router-dom';
import { useCart } from '../cart/CartProvider.jsx';
import { bySlug } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { orderTotals } from '../lib/totals.js';
import { FREE_SHIPPING_OVER_CENTS } from '../data/productDetail.js';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import './Checkout.css';

export default function Checkout() {
  useDocumentTitle('Your bag');
  const { cart, dispatch } = useCart();
  const { subtotalCents, shippingCents, totalCents } = orderTotals(cart);
  const empty = cart.lines.length === 0;

  return (
    <main className="co">
      <h1 className="co__title">Your bag</h1>

      {empty ? (
        <p className="co__empty">
          Your bag is empty. <Link to="/shop" className="u-label">View all</Link>
        </p>
      ) : (
        <div className="co__grid">
          <ul className="co__lines">
            {cart.lines.map((line) => {
              const product = bySlug(line.slug);
              return (
                <li className="co__line" key={`${line.slug}-${line.size}`}>
                  <span style={{ background: product.groundSoft, display: 'block' }}>
                    <img
                      src={product.image.card}
                      alt=""
                      width="880" height="1100"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </span>
                  <div>
                    <p>{product.name}</p>
                    <p className="u-label">Size {line.size}</p>
                    <QuantityStepper
                      qty={line.qty}
                      label={`${product.name}, size ${line.size}`}
                      onChange={(qty) => dispatch({ type: 'setQty', slug: line.slug, size: line.size, qty })}
                    />
                  </div>
                  <span>{formatPrice(line.priceCents * line.qty)}</span>
                </li>
              );
            })}
          </ul>

          <div className="co__summary">
            <div className="co__row">
              <span className="u-label">Subtotal</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <div className="co__row">
              <span className="u-label">Shipping</span>
              <span>{shippingCents === 0 ? 'Free' : formatPrice(shippingCents)}</span>
            </div>
            {shippingCents > 0 && (
              <p className="co__paynote">
                {formatPrice(FREE_SHIPPING_OVER_CENTS - subtotalCents)} away from free shipping.
              </p>
            )}
            <div className="co__row co__row--total">
              <span className="u-label">Total</span>
              <span>{formatPrice(totalCents)}</span>
            </div>

            {/* ── STRIPE SEAM ──────────────────────────────────────────────
                This is the only block that changes to accept real payments.

                1. npm i @stripe/stripe-js @stripe/react-stripe-js
                2. Add a server route that creates a PaymentIntent from
                   `cart.lines` — recompute the price SERVER-SIDE from the
                   slugs. Never trust a total sent by the browser.
                3. Replace the button below with Stripe's <PaymentElement />
                   wrapped in <Elements>.

                Nothing else on the site needs to change. There is deliberately
                no Stripe dependency and no publishable key in this build. */}
            <button type="button" className="co__pay u-label" disabled>
              Pay {formatPrice(totalCents)}
            </button>
            <p className="co__paynote">
              Payments are not connected yet. This is a preview of the checkout.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
