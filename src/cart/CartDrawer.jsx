import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartProvider.jsx';
import { bySlug } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cart, dispatch, open, closeCart, totalCents, count } = useCart();
  const panelRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    panelRef.current?.querySelector('button, a')?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { closeCart(); return; }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      restoreRef.current?.focus?.();
    };
  }, [open, closeCart]);

  return (
    <>
      <div className="drawer-scrim" data-open={open} onClick={closeCart} aria-hidden="true" />
      <aside
        className="drawer"
        data-open={open}
        ref={panelRef}
        aria-label="Shopping bag"
        inert={!open}
      >
        <header className="drawer__head">
          <span className="u-label">Bag ({count})</span>
          <button onClick={closeCart} aria-label="Close bag">Close</button>
        </header>

        <div className="drawer__lines">
          {cart.lines.length === 0 && <p>Your bag is empty.</p>}
          {cart.lines.map((line) => {
            const product = bySlug(line.slug);
            return (
              <div className="drawer__line" key={`${line.slug}-${line.size}`}>
                <img src={product.image.card} alt="" width="880" height="1100" />
                <div>
                  <p>{product.name}</p>
                  <p className="u-label">Size {line.size}</p>
                  <button onClick={() => dispatch({ type: 'remove', slug: line.slug, size: line.size })}>
                    Remove
                  </button>
                </div>
                <span>{formatPrice(line.priceCents * line.qty)}</span>
              </div>
            );
          })}
        </div>

        <div className="drawer__foot">
          <div className="drawer__total">
            <span className="u-label">Subtotal</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
          <Link to="/checkout" onClick={closeCart}>Checkout</Link>
        </div>
      </aside>
    </>
  );
}
